import type { AgentStatus } from "@/lib/agents";

const DOT_COLORS: Record<AgentStatus, string> = {
  čeka: "bg-zinc-400 dark:bg-zinc-600",
  "u tijeku": "bg-amber-500",
  gotovo: "bg-blue-500",
  provjereno: "bg-emerald-500",
  greška: "bg-red-500",
};

export function StatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className={`size-1.5 shrink-0 rounded-full ${DOT_COLORS[status]}`} />
      {status}
    </span>
  );
}
