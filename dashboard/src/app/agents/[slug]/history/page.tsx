import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
import { getPromptHistory } from "@/lib/prompts";

export default async function AgentHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const history = await getPromptHistory(slug);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href={`/agents/${slug}`} className="text-sm text-zinc-500 hover:underline">
        ← {agent.naziv}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Povijest prompta</h1>

      {history.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Nema zabilježenih verzija još. TODO: povezati na{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">
            agents/{slug}/prompt_history/
          </code>
          .
        </div>
      ) : (
        <div className="mt-8 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {history.map((v) => (
            <div key={v.timestamp} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{v.timestamp}</p>
                {v.napomena && <p className="text-xs text-zinc-500">{v.napomena}</p>}
              </div>
              <button
                type="button"
                disabled
                className="rounded-md border border-zinc-300 px-3 py-1 text-xs text-zinc-400 dark:border-zinc-700"
                title="TODO: revert na ovu verziju"
              >
                Revert
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
