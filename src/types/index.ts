export type InputMethod = "url" | "camera" | "file";

export type DocumentType =
  | "contrato"
  | "termo_de_uso"
  | "politica_privacidade"
  | "regulamento"
  | "outro";

export type RiskLevel = "baixo" | "medio" | "alto";

export interface Clause {
  id: string;
  title: string;
  originalText: string;
  simplifiedText: string;
  riskLevel: RiskLevel;
  explanation: string;
  cdcReference?: string;
  impact: string;
}

export interface AnalysisResult {
  documentType: DocumentType;
  documentTitle: string;
  overallScore: number;
  riskLevel: RiskLevel;
  summary: string;
  clauses: Clause[];
  recommendations: string[];
  cdcViolations: string[];
}

export interface AppState {
  inputMethod: InputMethod | null;
  rawInput: string | null;
  fileName: string | null;
  extractedText: string | null;
  documentType: DocumentType | null;
  isConfirmed: boolean;
  analysisResult: AnalysisResult | null;
}
