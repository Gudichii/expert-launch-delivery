import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Repo ima i root-level package-lock.json (za agents/ workspace). dashboard/lib
  // importa agents/shared/* direktno (zajednički Google/Claude klijenti, CLAUDE.md
  // sekcija 1), pa root mora ostati repo root, ne dashboard/, da Turbopack može
  // razriješiti te importove.
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
