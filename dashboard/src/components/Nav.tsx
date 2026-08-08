import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Expert Launch Delivery
        </Link>
        <nav className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Klijenti
          </Link>
        </nav>
      </div>
    </header>
  );
}
