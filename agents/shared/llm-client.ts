import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY nije postavljen u .env.local");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export type LlmModel = "claude-sonnet-4-5" | "claude-haiku-4-5";

/** Jedan poziv Claude API-ju za jedan step. Sonnet je default (vidi CLAUDE.md sekcija 2). */
export async function runStep(params: {
  systemPrompt: string;
  userMessage: string;
  model?: LlmModel;
  maxTokens?: number;
}): Promise<string> {
  const { systemPrompt, userMessage, model = "claude-sonnet-4-5", maxTokens = 4096 } = params;

  const response = await getClient().messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}
