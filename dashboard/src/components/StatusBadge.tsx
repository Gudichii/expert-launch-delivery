import type { AgentStatus } from "@/lib/agents";

const COLORS: Record<AgentStatus, string> = {
  čeka: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "u tijeku": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  gotovo: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  provjereno: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  greška: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function StatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[status]}`}>
      {status}
    </span>
  );
}
