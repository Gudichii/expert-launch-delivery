import { notFound } from "next/navigation";
import Link from "next/link";
import { AGENTS } from "@/lib/agents";
import { getClient } from "@/lib/clients";
import { StatusBadge } from "@/components/StatusBadge";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Svi klijenti
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{client.ime}</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {client.nisa} · start {client.datumStarta}
      </p>

      <h2 className="mt-8 text-lg font-semibold tracking-tight">Status po agentu</h2>
      <div className="mt-4 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {AGENTS.map((a) => (
          <div key={a.slug} className="flex items-center justify-between px-4 py-3">
            <div>
              <Link href={`/agents/${a.slug}`} className="font-medium hover:underline">
                {a.naziv}
              </Link>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Upitnik · outputi:{" "}
                <span className="text-zinc-400">TODO poveznica na Drive folder</span>
              </p>
            </div>
            <StatusBadge status={client.statusi[a.statusKolona] ?? "čeka"} />
          </div>
        ))}
      </div>
    </div>
  );
}
