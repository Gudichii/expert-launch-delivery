import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AgentDef } from "@/lib/agents";
import type { ClientRow } from "@/lib/clients";
import { StatusBadge } from "@/components/StatusBadge";

export function ClientCard({ client, agents }: { client: ClientRow; agents: AgentDef[] }) {
  return (
    <Link
      href={`/clients/${client.klijentId}`}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-card-foreground">{client.ime}</h3>
          {client.nisa && (
            <p className="mt-0.5 text-sm text-muted-foreground">{client.nisa}</p>
          )}
        </div>
        <ArrowUpRight
          size={16}
          className="mt-1 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        {agents.map((a) => (
          <div key={a.slug} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{a.naziv}</span>
            <StatusBadge status={client.statusi[a.statusKolona] ?? "čeka"} />
          </div>
        ))}
      </div>
    </Link>
  );
}
