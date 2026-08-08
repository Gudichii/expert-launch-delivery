export interface QaResult {
  flagirajZaReview: boolean;
  napomene: string[];
}

/**
 * Korak 5: provjerava output naspram golden examplea (format, ton, kompletnost).
 * U ovoj fazi UVIJEK flagira za ljudski review — ne auto-odobrava (vidi CLAUDE.md sekcija 6.1).
 */
export async function qaCheck(output: string): Promise<QaResult> {
  // TODO: usporedba s golden_examples/, provjera formata/tona/kompletnosti
  void output;
  return { flagirajZaReview: true, napomene: ["Ljudski review obavezan u ovoj fazi."] };
}
