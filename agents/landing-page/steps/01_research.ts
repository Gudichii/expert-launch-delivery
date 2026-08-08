import { runStep } from "@shared/llm-client.ts";

export interface LandingResearchInput {
  klijentIme: string;
  nisa: string;
  webUrl: string;
  socialUrl: string;
  ponuda: string;
  callNotes?: string;
}

export interface LandingResearchOutput {
  sazetakNise: string;
  ton: string;
  sazetakPonude: string;
}

/** Korak 1: kao content-strategija research, plus specifično koja se usluga/ponuda prodaje. */
export async function research(input: LandingResearchInput): Promise<LandingResearchOutput> {
  const raw = await runStep({
    systemPrompt: "TODO: učitati agents/landing-page/prompt.md kontekst za research korak",
    userMessage: JSON.stringify(input),
  });

  // TODO: parsirati raw output u strukturirani LandingResearchOutput
  return { sazetakNise: raw, ton: "", sazetakPonude: "" };
}
