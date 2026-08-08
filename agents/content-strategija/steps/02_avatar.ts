import { runStep } from "@shared/llm-client.ts";
import type { ResearchOutput } from "./01_research.ts";

export interface AvatarProfile {
  boli: string[];
  zelje: string[];
  jezik: string;
}

/** Korak 2: na temelju researcha definira avatar/target publiku specifičnu za klijenta. */
export async function avatar(research: ResearchOutput): Promise<AvatarProfile> {
  const raw = await runStep({
    systemPrompt: "TODO: učitati agents/content-strategija/prompt.md kontekst za avatar korak",
    userMessage: JSON.stringify(research),
  });

  // TODO: parsirati raw output u strukturirani AvatarProfile
  return { boli: [], zelje: [], jezik: raw };
}
