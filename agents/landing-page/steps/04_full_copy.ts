import { runStep } from "@shared/llm-client.ts";
import type { LandingSekcija } from "./03_struktura.ts";

/** Korak 4: piše copy po sekcijama definiranim u koraku 3. */
export async function fullCopy(sekcije: LandingSekcija[]): Promise<string> {
  return runStep({
    systemPrompt: "TODO: učitati agents/landing-page/prompt.md + golden_examples/ referencu",
    userMessage: JSON.stringify(sekcije),
    maxTokens: 8192,
  });
}
