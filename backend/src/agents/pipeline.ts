import type { SupabaseClient } from "@supabase/supabase-js";
import type { MistralClient } from "../services/mistral";
import type { AnalysisType, SimplificationLevel, SourceType } from "../types";
import { readFromText, readFromImage, readFromPdf, type StructuredDocument } from "./reader";
import { simplifyDocument, type SimplifierResult } from "./simplifier";
import { triageDocument } from "./legal-triage";
import type { LegalContext } from "../prompts/legal-triage";

// Cost per million tokens (USD) — Mistral pricing
const COST_RATES: Record<string, { input: number; output: number }> = {
  "ministral-8b-latest": { input: 0.1, output: 0.1 },
  "mistral-large-latest": { input: 2.0, output: 6.0 },
  "pixtral-large-latest": { input: 2.0, output: 6.0 },
};

function estimateCost(model: string, tokensIn: number, tokensOut: number): number {
  const rates = COST_RATES[model] ?? { input: 2.0, output: 6.0 };
  return (tokensIn * rates.input + tokensOut * rates.output) / 1_000_000;
}

export type PipelineInput = {
  sourceType: SourceType;
  content: string; // raw text for text_input; ignored for file uploads
  filePath?: string; // Supabase storage path for pdf_upload/image_upload
  mimeType?: string; // for image uploads
  userId: string;
  documentId: string;
  simplificationLevel: SimplificationLevel;
  analysisType: AnalysisType;
};

export type PipelineResult = {
  analysisId: string;
  summary: SimplifierResult;
  abuseScore: number | null;
  tokensUsed: { input: number; output: number };
  costUsd: number;
  durationMs: number;
};

export async function analyzeDocument(
  input: PipelineInput,
  mistralClient: MistralClient,
  supabaseAdmin: SupabaseClient
): Promise<PipelineResult> {
  const startTime = Date.now();
  let totalTokensIn = 0;
  let totalTokensOut = 0;
  let totalCost = 0;

  // Step 1: Reader Agent → structured_data
  let structuredText: string;
  let structuredDoc: StructuredDocument | null = null;

  if (input.sourceType === "pdf_upload" && input.filePath) {
    // Download PDF from Supabase Storage → extract text → Reader
    const { data: fileData, error: dlError } = await supabaseAdmin.storage
      .from("uploads")
      .download(input.filePath);
    if (dlError || !fileData) {
      throw new Error("Failed to download PDF from storage");
    }
    const pdfBytes = await fileData.arrayBuffer();
    const readerResult = await readFromPdf(pdfBytes, mistralClient);
    if (!readerResult.success || !readerResult.data) {
      throw new Error(`Reader agent failed: ${readerResult.error}`);
    }
    totalTokensIn += readerResult.tokensInput;
    totalTokensOut += readerResult.tokensOutput;
    totalCost += estimateCost(readerResult.modelUsed, readerResult.tokensInput, readerResult.tokensOutput);
    structuredText = readerResult.data.texto_completo;
    structuredDoc = readerResult.data;

    await supabaseAdmin
      .from("documents")
      .update({
        raw_text: readerResult.data.texto_completo,
        structured_data: readerResult.data,
        title: readerResult.data.titulo,
        doc_type: readerResult.data.tipo_documento,
      })
      .eq("id", input.documentId);
  } else if (input.sourceType === "image_upload" && input.filePath) {
    // Download image from Supabase Storage → base64 → Pixtral OCR
    const { data: fileData, error: dlError } = await supabaseAdmin.storage
      .from("uploads")
      .download(input.filePath);
    if (dlError || !fileData) {
      throw new Error("Failed to download image from storage");
    }
    const arrayBuf = await fileData.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuf).reduce((s, b) => s + String.fromCharCode(b), "")
    );
    const mimeType = input.mimeType || "image/jpeg";

    const readerResult = await readFromImage(base64, mimeType, mistralClient);
    if (!readerResult.success || !readerResult.data) {
      throw new Error(`Reader agent failed: ${readerResult.error}`);
    }
    totalTokensIn += readerResult.tokensInput;
    totalTokensOut += readerResult.tokensOutput;
    totalCost += estimateCost(readerResult.modelUsed, readerResult.tokensInput, readerResult.tokensOutput);
    structuredText = readerResult.data.texto_completo;
    structuredDoc = readerResult.data;

    await supabaseAdmin
      .from("documents")
      .update({
        raw_text: readerResult.data.texto_completo,
        structured_data: readerResult.data,
        title: readerResult.data.titulo,
        doc_type: readerResult.data.tipo_documento,
      })
      .eq("id", input.documentId);
  } else {
    // text_input — raw text already available
    const readerResult = await readFromText(input.content, mistralClient);
    if (!readerResult.success || !readerResult.data) {
      throw new Error(`Reader agent failed: ${readerResult.error}`);
    }
    totalTokensIn += readerResult.tokensInput;
    totalTokensOut += readerResult.tokensOutput;
    totalCost += estimateCost(readerResult.modelUsed, readerResult.tokensInput, readerResult.tokensOutput);
    structuredText = readerResult.data.texto_completo;
    structuredDoc = readerResult.data;

    await supabaseAdmin
      .from("documents")
      .update({
        structured_data: readerResult.data,
        title: readerResult.data.titulo,
        doc_type: readerResult.data.tipo_documento,
      })
      .eq("id", input.documentId);
  }

  // Step 2: Legal Triage (skip for scam — straightforward classification)
  let legalContext: LegalContext | undefined;
  let effectiveAnalysisType: AnalysisType = input.analysisType;

  if (input.analysisType !== "scam") {
    const triage = await triageDocument(structuredText, mistralClient);
    if (triage.success && triage.data) {
      legalContext = triage.data;
      effectiveAnalysisType = triage.data.analysis_type_override;
      totalTokensIn += triage.tokensInput;
      totalTokensOut += triage.tokensOutput;
      totalCost += estimateCost(triage.modelUsed, triage.tokensInput, triage.tokensOutput);
    }
    // If triage fails → graceful degradation, use frontend-provided type
  }

  // Step 3: Simplifier Agent → summary + abuse_score
  const simplifierResult = await simplifyDocument(
    structuredText,
    effectiveAnalysisType,
    input.simplificationLevel,
    mistralClient,
    legalContext
  );

  if (!simplifierResult.success || !simplifierResult.data) {
    throw new Error(`Simplifier agent failed: ${simplifierResult.error}`);
  }

  totalTokensIn += simplifierResult.tokensInput;
  totalTokensOut += simplifierResult.tokensOutput;
  totalCost += estimateCost(simplifierResult.modelUsed, simplifierResult.tokensInput, simplifierResult.tokensOutput);

  // Extract abuse score (only for ToS analysis)
  const abuseScore =
    effectiveAnalysisType === "tos" && "abusividade" in simplifierResult.data
      ? (simplifierResult.data as { abusividade: number }).abusividade
      : null;

  // Step 4: Save analysis record
  const { data: analysis, error: analysisError } = await supabaseAdmin
    .from("analyses")
    .insert({
      document_id: input.documentId,
      user_id: input.userId,
      analysis_type: effectiveAnalysisType,
      simplification_level: input.simplificationLevel,
      abuse_score: abuseScore,
      summary: simplifierResult.data,
      tokens_input: totalTokensIn,
      tokens_output: totalTokensOut,
      cost_usd: totalCost,
      duration_ms: Date.now() - startTime,
      model_used: simplifierResult.modelUsed,
    })
    .select("id")
    .single();

  if (analysisError || !analysis) {
    throw new Error("Failed to save analysis record");
  }

  // Step 5: Increment user's analyses_this_month
  const { error: rpcError } = await supabaseAdmin.rpc("increment_analyses_count", {
    user_id: input.userId,
  });
  if (rpcError) {
    console.error("Failed to increment analyses count for user:", input.userId, rpcError.message);
  }

  // Step 6: Upsert company ranking (ToS analyses only)
  if (effectiveAnalysisType === "tos" && abuseScore !== null && structuredDoc?.orgao_emissor) {
    const companyName = structuredDoc.orgao_emissor;

    // Extract top issues from abusive clauses
    const topIssues =
      "clausulas_abusivas" in simplifierResult.data
        ? (simplifierResult.data as { clausulas_abusivas: Array<{ explicacao_simples: string; gravidade: string }> })
            .clausulas_abusivas.slice(0, 5)
            .map((cl) => ({ issue: cl.explicacao_simples, gravidade: cl.gravidade }))
        : [];

    // Try to fetch existing ranking
    const { data: existing } = await supabaseAdmin
      .from("company_rankings")
      .select("id, avg_abuse_score, total_analyses")
      .eq("company_name", companyName)
      .single();

    if (existing) {
      // Update running average
      const newTotal = existing.total_analyses + 1;
      const newAvg =
        (existing.avg_abuse_score * existing.total_analyses + abuseScore) / newTotal;

      await supabaseAdmin
        .from("company_rankings")
        .update({
          avg_abuse_score: Math.round(newAvg * 10) / 10,
          total_analyses: newTotal,
          top_issues: topIssues,
          last_analysis_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("company_rankings").insert({
        company_name: companyName,
        avg_abuse_score: abuseScore,
        total_analyses: 1,
        top_issues: topIssues,
        last_analysis_at: new Date().toISOString(),
      });
    }
  }

  return {
    analysisId: analysis.id,
    summary: simplifierResult.data,
    abuseScore,
    tokensUsed: { input: totalTokensIn, output: totalTokensOut },
    costUsd: totalCost,
    durationMs: Date.now() - startTime,
  };
}
