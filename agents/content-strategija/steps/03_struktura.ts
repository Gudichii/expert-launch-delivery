import { runStep } from "@shared/llm-client.ts";
import type { AvatarProfile } from "./02_avatar.ts";

export interface ContentPillar {
  naziv: string;
  brojHookova: number;
  tipHookova: string;
}

/** Korak 3: definira content pillars/kategorije i broj/tip hookova po kategoriji. */
export async function struktura(avatar: AvatarProfile): Promise<ContentPillar[]> {
  const raw = await runStep({
    systemPrompt: "TODO: učitati agents/content-strategija/prompt.md kontekst za struktura korak",
    userMessage: JSON.stringify(avatar),
  });

  // TODO: parsirati raw output u listu ContentPillar
  void raw;
  return [];
}
