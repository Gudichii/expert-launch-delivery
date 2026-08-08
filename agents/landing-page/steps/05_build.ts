export type BuildFormat = "html" | "lovable_prompt" | "ghl_custom_code";

/**
 * Korak 5: pretvara copy u finalni format. ČEKA Karlovu odluku o default formatu
 * (vidi CLAUDE.md sekcija 6.2, otvoreno pitanje). Placeholder default: "html".
 */
export async function build(copy: string, format: BuildFormat = "html"): Promise<string> {
  // TODO: implementirati generiranje HTML/CSS (ili odabrani format) na temelju copyja po sekcijama
  void format;
  return copy;
}
