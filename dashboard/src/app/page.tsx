import Link from "next/link";
import { AGENTS } from "@/lib/agents";
import { getClients } from "@/lib/clients";
import { StatusBadge } from "@/components/StatusBadge";

export default async function Home() {
  const clients = await getClients();
  const aktivniAgenti = AGENTS.filter((a) => a.aktivan);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Pregled klijenata</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Redak = klijent, stupac = agent, ćelija = status. Vidi CLAUDE.md sekcija 3.
      </p>

      {clients.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Nema klijenata u status bazi još. TODO: povezati na Google Sheets preko{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">
            agents/shared/google-sheets-client.ts
          </code>
          .
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Klijent</th>
                <th className="px-4 py-2 text-left font-medium">Niša</th>
                {aktivniAgenti.map((a) => (
                  <th key={a.slug} className="px-4 py-2 text-left font-medium">
                    {a.naziv}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {clients.map((c) => (
                <tr key={c.klijentId}>
                  <td className="px-4 py-2">
                    <Link href={`/clients/${c.klijentId}`} className="font-medium hover:underline">
                      {c.ime}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{c.nisa}</td>
                  {aktivniAgenti.map((a) => (
                    <td key={a.slug} className="px-4 py-2">
                      <StatusBadge status={c.statusi[a.statusKolona] ?? "čeka"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-12 text-lg font-semibold tracking-tight">Agenti</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a) => (
          <Link
            key={a.slug}
            href={`/agents/${a.slug}`}
            className="rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{a.naziv}</span>
              {!a.aktivan && (
                <span className="text-xs text-zinc-500 dark:text-zinc-500">skeleton</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
