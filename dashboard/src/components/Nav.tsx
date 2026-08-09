import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Expert Launch Delivery
          </Link>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Klijenti
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
