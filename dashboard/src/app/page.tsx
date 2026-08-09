import Link from "next/link";
import { Users } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { getClients } from "@/lib/clients";
import { ClientCard } from "@/components/ClientCard";

// Status klijenata se mijenja uživo dok agenti rade — ne smije se cachati kao statična stranica.
export const dynamic = "force-dynamic";

export default async function Home() {
  const clients = await getClients();
  const aktivniAgenti = AGENTS.filter((a) => a.aktivan);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pregled klijenata</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Svaka kartica = klijent, svaki red unutra = status jednog agenta.
          </p>
        </div>
        {clients.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {clients.length} {clients.length === 1 ? "klijent" : "klijenata"}
          </span>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Users size={20} className="text-muted-foreground" />
          <p className="max-w-sm text-sm text-muted-foreground">
            Nema klijenata u status bazi još. Dodaj redak u &quot;Status&quot; Google
            Sheet (
            <code className="rounded bg-muted px-1 py-0.5 text-xs">klijent_id</code>{" "}
            mora biti popunjen) i osvježi stranicu.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <ClientCard key={c.klijentId} client={c} agents={aktivniAgenti} />
          ))}
        </div>
      )}

      <h2 className="mt-12 text-lg font-semibold tracking-tight">Agenti</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a) => (
          <Link
            key={a.slug}
            href={`/agents/${a.slug}`}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-card-foreground">{a.naziv}</span>
              {!a.aktivan && (
                <span className="text-xs text-muted-foreground">skeleton</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
