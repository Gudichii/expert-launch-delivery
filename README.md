# Expert Launch Delivery Sustav

Sustav AI agenata koji automatizira build-time isporuku "Expert Launch" ponude klijentima. Puni kontekst i pravila rada su u [`CLAUDE.md`](./CLAUDE.md) — pročitaj to prvo.

## Struktura

- `agents/` — jedan folder po agentu (`prompt.md`, `steps/`, `golden_examples/`, `run.ts`), plus `agents/shared/` sa zajedničkim Drive/Sheets/LLM klijentima
- `dashboard/` — Next.js app za pregled klijenata, status po agentu, prompt manager
- `docs/` — referentni dokumenti (npr. `Restrukturiranje_Delivery_Sustava.pdf`)

## Setup

1. Kopiraj `.env.local.example` u `.env.local` (root) i popuni vrijednosti — vidi checklist u `CLAUDE.md` sekcija 2
2. `service-account.json` (Google service account ključ) stavi u root, nikad ga ne commitaj
3. `cd dashboard && npm install && npm run dev`

## Trenutni fokus

Vidi `CLAUDE.md` sekciju 6 — content-strategija i landing-page agenti su prioritet.
