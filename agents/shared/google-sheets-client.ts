import { google } from "googleapis";
import { getServiceAccountCredentials } from "./google-auth.ts";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SHEET_NAME = "Status";

export type AgentStatus = "čeka" | "u tijeku" | "gotovo" | "provjereno" | "greška";

function getAuth() {
  return new google.auth.GoogleAuth({ credentials: getServiceAccountCredentials(), scopes: SCOPES });
}

function sheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

function statusSheetId(): string {
  const id = process.env.GOOGLE_SHEETS_STATUS_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_STATUS_SHEET_ID nije postavljen u .env.local");
  return id;
}

/** Vraća sve retke (uključujući header red) iz "Status" taba, shema u CLAUDE.md sekcija 4. */
export async function getAllRows(): Promise<string[][]> {
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: statusSheetId(),
    range: `${SHEET_NAME}!A:O`,
  });
  return res.data.values ?? [];
}

/** Postavlja status za jednog klijenta i jedan agent (kolonu). Pronalazi redak po klijent_id. */
export async function setAgentStatus(
  klijentId: string,
  agentColumn: string,
  status: AgentStatus
): Promise<void> {
  const rows = await getAllRows();
  const header = rows[0] ?? [];
  const colIndex = header.indexOf(agentColumn);
  const rowIndex = rows.findIndex((r) => r[0] === klijentId);

  if (colIndex === -1) throw new Error(`Kolona "${agentColumn}" ne postoji u Status sheetu`);
  if (rowIndex === -1) throw new Error(`Klijent "${klijentId}" nije pronađen u Status sheetu`);

  const sheets = sheetsClient();
  const colLetter = String.fromCharCode(65 + colIndex);
  await sheets.spreadsheets.values.update({
    spreadsheetId: statusSheetId(),
    range: `${SHEET_NAME}!${colLetter}${rowIndex + 1}`,
    valueInputOption: "RAW",
    requestBody: { values: [[status]] },
  });
}
