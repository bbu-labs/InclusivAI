import { runAgent, type AgentResult } from "./base";
import {
  buildLegalTriagePrompt,
  buildLegalTriageUserPrompt,
  type LegalContext,
} from "../prompts/legal-triage";
import { MINISTRAL_8B, type MistralClient } from "../services/mistral";
import { truncateToTokens } from "../lib/token-utils";
import type { SupportedCountry } from "../types";

const INPUT_TOKEN_LIMIT = 2000;
const OUTPUT_TOKEN_LIMIT = 512;

export function triageDocument(
  documentText: string,
  mistralClient: MistralClient,
  country: SupportedCountry = "BR"
): Promise<AgentResult<LegalContext>> {
  const truncated = truncateToTokens(documentText, INPUT_TOKEN_LIMIT);

  return runAgent<LegalContext>(MINISTRAL_8B, () =>
    mistralClient.chatJSON<LegalContext>(
      MINISTRAL_8B,
      [
        { role: "system", content: buildLegalTriagePrompt(country) },
        { role: "user", content: buildLegalTriageUserPrompt(truncated, country) },
      ],
      OUTPUT_TOKEN_LIMIT
    )
  );
}
