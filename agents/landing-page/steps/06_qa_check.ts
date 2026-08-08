export interface QaResult {
  flagirajZaReview: boolean;
  napomene: string[];
}

/** Korak 6: ljudski review prije slanja/objave — uvijek flagira u ovoj fazi. */
export async function qaCheck(build: string): Promise<QaResult> {
  void build;
  return { flagirajZaReview: true, napomene: ["Ljudski review obavezan prije objave."] };
}
