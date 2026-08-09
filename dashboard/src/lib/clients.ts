import { AGENTS, type AgentStatus } from "./agents";
import { getAllRows } from "../../../agents/shared/google-sheets-client";

export interface ClientRow {
  klijentId: string;
  ime: string;
  nisa: string;
  datumStarta: string;
  statusi: Record<string, AgentStatus>;
  overallStatus: string;
}

/** Čita klijente iz Google Sheets "Status" taba, shema u CLAUDE.md sekcija 4. */
export async function getClients(): Promise<ClientRow[]> {
  const rows = await getAllRows();
  const [header, ...dataRows] = rows;
  if (!header) return [];

  const colIndex = (name: string) => header.indexOf(name);
  const idIdx = colIndex("klijent_id");

  return dataRows
    .filter((row) => row[idIdx])
    .map((row) => {
      const statusi = Object.fromEntries(
        AGENTS.map((a) => {
          const i = colIndex(a.statusKolona);
          const val = i >= 0 ? row[i] : undefined;
          return [a.statusKolona, (val || "čeka") as AgentStatus];
        })
      );
      return {
        klijentId: row[idIdx],
        ime: row[colIndex("ime")] ?? "",
        nisa: row[colIndex("niša")] ?? "",
        datumStarta: row[colIndex("datum_starta")] ?? "",
        statusi,
        overallStatus: row[colIndex("overall_status")] ?? "",
      };
    });
}

export async function getClient(klijentId: string): Promise<ClientRow | undefined> {
  const clients = await getClients();
  return clients.find((c) => c.klijentId === klijentId);
}

export function emptyStatusi(): Record<string, AgentStatus> {
  return Object.fromEntries(AGENTS.map((a) => [a.statusKolona, "čeka" as AgentStatus]));
}
