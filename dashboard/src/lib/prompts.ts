export interface PromptVersion {
  timestamp: string;
  napomena?: string;
  sadrzaj: string;
}

/**
 * TODO: implementirati čitanje ../agents/{slug}/prompt.md (monorepo filesystem)
 * i ../agents/{slug}/prompt_history/ za listu verzija.
 * Upload/revert akcije (section 3.3) trebaju API rute koje pišu u prompt_history/
 * prije prepisivanja prompt.md — vidi CLAUDE.md napomena na kraju.
 */
export async function getCurrentPrompt(slug: string): Promise<string | null> {
  void slug;
  return null;
}

export async function getPromptHistory(slug: string): Promise<PromptVersion[]> {
  void slug;
  return [];
}
