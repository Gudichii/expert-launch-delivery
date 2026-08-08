import { AGENTS, type AgentStatus } from "./agents";

export interface ClientRow {
  klijentId: string;
  ime: string;
  nisa: string;
  datumStarta: string;
  statusi: Record<string, AgentStatus>;
  overallStatus: string;
}

/**
 * TODO: zamijeniti stvarnim čitanjem iz Google Sheets "Status" taba
 * (shema u CLAUDE.md sekcija 4) preko agents/shared/google-sheets-client.ts.
 * Za sada vraća prazan niz — nema mock/fake klijenata u produkcijskom kodu.
 */
export async function getClients(): Promise<ClientRow[]> {
  return [];
}

export async function getClient(klijentId: string): Promise<ClientRow | undefined> {
  const clients = await getClients();
  return clients.find((c) => c.klijentId === klijentId);
}

export function emptyStatusi(): Record<string, AgentStatus> {
  return Object.fromEntries(AGENTS.map((a) => [a.statusKolona, "čeka" as AgentStatus]));
}
