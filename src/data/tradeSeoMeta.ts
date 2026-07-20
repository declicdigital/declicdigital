import type { TradeData } from "./trades";

// Coupe une chaîne à la dernière limite de mot avant maxLen, jamais en plein mot.
function truncateAtWord(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str.trim();
  const cut = str.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
}

export interface TradeSeoMeta {
  title: string;
  description: string;
}

// Title volontairement court ("Site web" plutôt que "Création site internet")
// pour rester sous ~55 caractères même avec les métiers aux noms longs
// (Community manager, Expert-comptable, Agent immobilier...).
export function getTradeSeoMeta(trade: TradeData): TradeSeoMeta {
  const title = `Site web ${trade.nameShort} | Déclic Digital Paris`;

  const prefix = `Site web professionnel pour ${trade.name.toLowerCase()}. `;
  const suffix = "Devis gratuit en 24h.";
  const budget = 155 - prefix.length - suffix.length - 2; // -2 pour ". "
  const hook = truncateAtWord(trade.whyWebsite, budget);

  const description = `${prefix}${hook}. ${suffix}`;

  return { title, description };
}
