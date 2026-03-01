import { runAgent, type AgentResult } from "./base";
import {
  LEGAL_TRIAGE_SYSTEM_PROMPT,
  LEGAL_TRIAGE_USER_PROMPT,
  type LegalContext,
} from "../prompts/legal-triage";
import { MINISTRAL_8B, type MistralClient } from "../services/mistral";
import { truncateToTokens } from "../lib/token-utils";

const INPUT_TOKEN_LIMIT = 2000;
const OUTPUT_TOKEN_LIMIT = 512;

export function triageDocument(
  documentText: string,
  mistralClient: MistralClient
): Promise<AgentResult<LegalContext>> {
  const truncated = truncateToTokens(documentText, INPUT_TOKEN_LIMIT);

  return runAgent<LegalContext>(MINISTRAL_8B, () =>
    mistralClient.chatJSON<LegalContext>(
      MINISTRAL_8B,
      [
        { role: "system", content: LEGAL_TRIAGE_SYSTEM_PROMPT },
        { role: "user", content: LEGAL_TRIAGE_USER_PROMPT(truncated) },
      ],
      OUTPUT_TOKEN_LIMIT
    )
  );
}
