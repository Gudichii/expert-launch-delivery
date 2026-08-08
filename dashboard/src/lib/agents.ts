export interface AgentDef {
  slug: string;
  naziv: string;
  statusKolona: string;
  aktivan: boolean;
}

// Vidi CLAUDE.md sekcija 5 — puna lista build-time agenata.
export const AGENTS: AgentDef[] = [
  { slug: "content-strategija", naziv: "Content strategija + hookovi", statusKolona: "content_strategija", aktivan: true },
  { slug: "landing-page", naziv: "Landing page copy/build", statusKolona: "landing_page", aktivan: true },
  { slug: "upitnik-generator", naziv: "Upitnik generator", statusKolona: "upitnik_generator", aktivan: false },
  { slug: "prodajne-skripte", naziv: "Prodajne skripte", statusKolona: "skripte", aktivan: false },
  { slug: "ads-copy", naziv: "Ad copy", statusKolona: "ads_copy", aktivan: false },
  { slug: "crm-snapshot", naziv: "CRM snapshot", statusKolona: "crm", aktivan: false },
  { slug: "email-sekvenca", naziv: "Email sekvenca", statusKolona: "email", aktivan: false },
  { slug: "social-media", naziv: "Social media optimizacija", statusKolona: "social", aktivan: false },
  { slug: "aplikacijska-forma", naziv: "Aplikacijska forma", statusKolona: "aplikacijska_forma", aktivan: false },
  { slug: "offer-stack", naziv: "Offer stack", statusKolona: "offer_stack", aktivan: false },
  { slug: "edu-punjenje", naziv: "Strategija punjenja edu programa", statusKolona: "edu_punjenje", aktivan: false },
];

export type AgentStatus = "čeka" | "u tijeku" | "gotovo" | "provjereno" | "greška";

export function getAgent(slug: string): AgentDef | undefined {
  return AGENTS.find((a) => a.slug === slug);
}
