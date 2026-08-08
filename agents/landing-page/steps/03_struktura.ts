import { runStep } from "@shared/llm-client.ts";
import type { AvatarProfile } from "./02_avatar.ts";

export interface LandingSekcija {
  naziv: "hero" | "problem_agitate" | "ponuda" | "dokazi" | "cta" | "faq" | string;
  opis: string;
}

/** Korak 3: definira sekcije stranice prije pisanja punog copyja. */
export async function struktura(avatar: AvatarProfile): Promise<LandingSekcija[]> {
  const raw = await runStep({
    systemPrompt: "TODO: učitati agents/landing-page/prompt.md kontekst za struktura korak",
    userMessage: JSON.stringify(avatar),
  });

  // TODO: parsirati raw output u listu LandingSekcija
  void raw;
  return [];
}
