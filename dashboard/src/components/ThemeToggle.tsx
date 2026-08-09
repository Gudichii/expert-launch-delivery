"use client";

import { Moon, Sun } from "lucide-react";

function toggle() {
  const next = !document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", next);
  localStorage.setItem("theme", next ? "dark" : "light");
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Promijeni temu"
      className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
    >
      <Sun size={15} className="hidden dark:block" />
      <Moon size={15} className="dark:hidden" />
    </button>
  );
}
