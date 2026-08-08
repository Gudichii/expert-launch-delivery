import { runStep } from "@shared/llm-client.ts";

export interface ResearchInput {
  klijentIme: string;
  nisa: string;
  webUrl: string;
  socialUrl: string;
  callNotes?: string;
}

export interface ResearchOutput {
  sazetakNise: string;
  ton: string;
  postojeciContent: string;
}

/** Korak 1: čita web/social/call notes i sažima nišu, ton i postojeći content. */
export async function research(input: ResearchInput): Promise<ResearchOutput> {
  // TODO: implementirati dohvat sadržaja s webUrl/socialUrl prije poziva LLM-u.
  const raw = await runStep({
    systemPrompt: "TODO: učitati agents/content-strategija/prompt.md kontekst za research korak",
    userMessage: JSON.stringify(input),
  });

  // TODO: parsirati raw output u strukturirani ResearchOutput (format definiran u prompt.md)
  return { sazetakNise: raw, ton: "", postojeciContent: "" };
}
