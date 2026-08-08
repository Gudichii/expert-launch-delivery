import { runStep } from "@shared/llm-client.ts";
import type { ContentPillar } from "./03_struktura.ts";

/** Korak 4: piše finalne hookove + content strategiju u punom obliku (output.md). */
export async function fullCopy(pillars: ContentPillar[]): Promise<string> {
  // TODO: prompt mora eksplicitno referencirati golden_examples/ za standard tona i specifičnosti
  return runStep({
    systemPrompt: "TODO: učitati agents/content-strategija/prompt.md + golden_examples/ referencu",
    userMessage: JSON.stringify(pillars),
    maxTokens: 8192,
  });
}
