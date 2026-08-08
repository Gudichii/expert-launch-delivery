import { readTextFile } from "@shared/google-drive-client.ts";
import { runStep } from "@shared/llm-client.ts";
import type { LandingResearchOutput } from "./01_research.ts";

export interface AvatarProfile {
  boli: string[];
  zelje: string[];
  jezik: string;
}

/**
 * Korak 2: ponovno koristi avatar iz content-strategija agenta ako već postoji za ovog klijenta
 * (provjeriti Drive prije generiranja — izbjeći dupliciranje rada, vidi CLAUDE.md sekcija 6.2).
 */
export async function avatar(
  research: LandingResearchOutput,
  postojeciAvatarDriveFileId?: string
): Promise<AvatarProfile> {
  if (postojeciAvatarDriveFileId) {
    const raw = await readTextFile(postojeciAvatarDriveFileId);
    // TODO: parsirati postojeći avatar iz content-strategija outputa
    return { boli: [], zelje: [], jezik: raw };
  }

  const raw = await runStep({
    systemPrompt: "TODO: učitati agents/landing-page/prompt.md kontekst za avatar korak",
    userMessage: JSON.stringify(research),
  });

  return { boli: [], zelje: [], jezik: raw };
}
