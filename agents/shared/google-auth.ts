import { readFileSync } from "node:fs";

/**
 * Vraća service account credentials. Podržava dva izvora:
 * - GOOGLE_SERVICE_ACCOUNT_KEY_JSON: cijeli JSON ključ kao string (koristi se na Vercelu,
 *   gdje nema trajnog file sustava za service-account.json)
 * - GOOGLE_SERVICE_ACCOUNT_KEY_PATH: put do JSON fajla na disku (koristi se lokalno)
 */
export function getServiceAccountCredentials(): Record<string, unknown> {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (json) return JSON.parse(json);

  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  if (!keyPath) {
    throw new Error(
      "Postavi GOOGLE_SERVICE_ACCOUNT_KEY_JSON ili GOOGLE_SERVICE_ACCOUNT_KEY_PATH u .env.local"
    );
  }
  return JSON.parse(readFileSync(keyPath, "utf-8"));
}
