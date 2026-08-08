import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
import { getCurrentPrompt } from "@/lib/prompts";

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const prompt = await getCurrentPrompt(slug);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Svi agenti
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{agent.naziv}</h1>
        <Link
          href={`/agents/${slug}/history`}
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Povijest verzija
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">prompt.md</h2>
        <button
          type="button"
          disabled
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-400 dark:border-zinc-700"
          title="TODO: implementirati upload novog prompta (sprema staru verziju u prompt_history/)"
        >
          Upload novi prompt
        </button>
      </div>
      <pre className="mt-2 max-h-[28rem] overflow-auto rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        {prompt ?? "TODO: povezati na agents/" + slug + "/prompt.md"}
      </pre>

      <h2 className="mt-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">Ručno pokretanje</h2>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          disabled
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-400 dark:border-zinc-700"
          title="TODO: pokreće run.ts za odabranog klijenta (CLAUDE.md sekcija 8)"
        >
          Pokreni
        </button>
        <span className="text-xs text-zinc-500">Bez auto-triggera u ovoj fazi — vidi CLAUDE.md sekcija 8.</span>
      </div>

      <h2 className="mt-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">Output za odobrenje</h2>
      <div className="mt-2 rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        TODO: prikaz zadnjeg outputa po klijentu + gumb &quot;Odobreno&quot; (CLAUDE.md sekcija 3.5).
      </div>
    </div>
  );
}
