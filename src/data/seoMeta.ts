// ============================================================
// seoMeta.ts — Balises SEO uniques pour les 110 pages locales
// Utilisation :
//   import { getSeoMeta } from "@/data/seoMeta";
//   const { title, description, h1 } = getSeoMeta("creation", city.slug, city.nameShort);
// ============================================================

export interface SeoMeta {
  title: string;       // ≤ 60 caractères
  description: string; // ≤ 160 caractères
  h1: string;
}

type Service = "creation" | "seo";

// ============================================================
// CRÉATION DE SITE WEB — 55 pages
// ============================================================
const creationMeta: Record<string, SeoMeta> = {

  "paris-1er": {
    title: "Création site web Paris 1er - Louvre & Les Halles",
    description: "Agence web Paris 1er arrondissement (Louvre, Châtelet, Les Halles). Site professionnel pour TPE et artisans. Design soigné, SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 1er arrondissement - Louvre, Châtelet, Les Halles",
  },
  "paris-2eme": {
    title: "Création site web Paris 2ème - Sentier & Bourse",
    description: "Agence web Paris 2ème arrondissement (Sentier, Bourse, Grands Boulevards). Site pro pour startups et TPE. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 2ème arrondissement - Sentier, Bourse, Grands Boulevards",
  },
  "paris-3eme": {
    title: "Création site web Paris 3ème - Le Marais & Temple",
    description: "Agence web Paris 3ème arrondissement (Marais, Temple, Arts et Métiers). Site élégant pour artisans et TPE. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 3ème arrondissement - Marais, Temple, Arts et Métiers",
  },
  "paris-4eme": {
    title: "Création site web Paris 4ème - Hôtel de Ville & Marais",
    description: "Agence web Paris 4ème arrondissement (Hôtel de Ville, Île de la Cité, Centre Pompidou). Site pro pour TPE et artisans. Devis gratuit.",
    h1: "Création de site web Paris 4ème arrondissement - Hôtel de Ville, Île de la Cité",
  },
  "paris-5eme": {
    title: "Création site web Paris 5ème - Quartier Latin",
    description: "Agence web Paris 5ème arrondissement (Quartier Latin, Panthéon, Mouffetard). Site professionnel pour TPE et indépendants. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 5ème arrondissement - Quartier Latin, Panthéon, Mouffetard",
  },
  "paris-6eme": {
    title: "Création site web Paris 6ème - Saint-Germain-des-Prés",
    description: "Agence web Paris 6ème arrondissement (Saint-Germain, Odéon, Luxembourg). Site haut de gamme pour TPE et professions libérales. Devis gratuit.",
    h1: "Création de site web Paris 6ème arrondissement - Saint-Germain-des-Prés, Odéon",
  },
  "paris-7eme": {
    title: "Création site web Paris 7ème - Tour Eiffel & Invalides",
    description: "Agence web Paris 7ème arrondissement (Tour Eiffel, Invalides, rue du Bac). Site premium pour TPE et professions libérales. Devis gratuit.",
    h1: "Création de site web Paris 7ème arrondissement - Tour Eiffel, Invalides, Champ de Mars",
  },
  "paris-8eme": {
    title: "Création site web Paris 8ème - Champs-Élysées",
    description: "Agence web Paris 8ème arrondissement (Champs-Élysées, Madeleine, Miromesnil). Site premium pour TPE et entreprises. Devis gratuit.",
    h1: "Création de site web Paris 8ème arrondissement - Champs-Élysées, Madeleine",
  },
  "paris-9eme": {
    title: "Création site web Paris 9ème - Opéra & Grands Boulevards",
    description: "Agence web Paris 9ème arrondissement (Opéra, Grands Boulevards, Trinité). Site professionnel pour TPE et artisans. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 9ème arrondissement - Opéra, Grands Boulevards, Trinité",
  },
  "paris-10eme": {
    title: "Création site web Paris 10ème - Canal Saint-Martin",
    description: "Agence web Paris 10ème arrondissement (Canal Saint-Martin, Gare du Nord, République). Site moderne pour TPE et artisans. Devis gratuit.",
    h1: "Création de site web Paris 10ème arrondissement - Canal Saint-Martin, Gare du Nord",
  },
  "paris-11eme": {
    title: "Création site web Paris 11ème - Bastille & Oberkampf",
    description: "Agence web Paris 11ème arrondissement (Bastille, Oberkampf, République). Site percutant pour commerces et TPE. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 11ème arrondissement - Bastille, Oberkampf, Charonne",
  },
  "paris-12eme": {
    title: "Création site web Paris 12ème - Bercy & Nation",
    description: "Agence web Paris 12ème arrondissement (Bercy, Nation, Gare de Lyon). Site professionnel pour TPE et artisans. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 12ème arrondissement - Bercy, Nation, Gare de Lyon",
  },
  "paris-13eme": {
    title: "Création site web Paris 13ème - Place d'Italie",
    description: "Agence web Paris 13ème arrondissement (Place d'Italie, Bibliothèque, Tolbiac). Site moderne pour TPE et artisans. Devis gratuit.",
    h1: "Création de site web Paris 13ème arrondissement - Place d'Italie, Bibliothèque, Tolbiac",
  },
  "paris-14eme": {
    title: "Création site web Paris 14ème - Montparnasse & Alésia",
    description: "Agence web Paris 14ème arrondissement (Montparnasse, Alésia, Denfert-Rochereau). Site pro pour TPE et professions libérales. Devis gratuit.",
    h1: "Création de site web Paris 14ème arrondissement - Montparnasse, Alésia, Denfert",
  },
  "paris-15eme": {
    title: "Création site web Paris 15ème - Convention & Vaugirard",
    description: "Agence web Paris 15ème arrondissement (Convention, Vaugirard). 230 000 habitants - le plus grand marché de Paris. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 15ème arrondissement - Convention, Vaugirard, Cambronne",
  },
  "paris-16eme": {
    title: "Création site web Paris 16ème - Trocadéro & Passy",
    description: "Agence web Paris 16ème arrondissement (Trocadéro, Passy, Auteuil). Site haut de gamme pour TPE et professions libérales. Devis gratuit.",
    h1: "Création de site web Paris 16ème arrondissement - Trocadéro, Passy, Auteuil",
  },
  "paris-17eme": {
    title: "Création site web Paris 17ème - Batignolles & Ternes",
    description: "Agence web Paris 17ème arrondissement (Batignolles, Ternes, Monceau). Site moderne pour TPE et artisans en plein essor. Devis gratuit.",
    h1: "Création de site web Paris 17ème arrondissement - Batignolles, Ternes, Monceau",
  },
  "paris-18eme": {
    title: "Création site web Paris 18ème - Montmartre & Abbesses",
    description: "Agence web Paris 18ème arrondissement (Montmartre, Abbesses, Barbès). Site professionnel pour TPE et artisans. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 18ème arrondissement - Montmartre, Abbesses, Sacré-Coeur",
  },
  "paris-19eme": {
    title: "Création site web Paris 19ème - Buttes-Chaumont",
    description: "Agence web Paris 19ème arrondissement (Buttes-Chaumont, Villette, Stalingrad). Site pro pour TPE en pleine croissance. Devis gratuit.",
    h1: "Création de site web Paris 19ème arrondissement - Buttes-Chaumont, Villette, Stalingrad",
  },
  "paris-20eme": {
    title: "Création site web Paris 20ème - Belleville & Ménilmontant",
    description: "Agence web Paris 20ème arrondissement (Belleville, Ménilmontant, Gambetta). Site créatif pour TPE et artisans. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Paris 20ème arrondissement - Belleville, Ménilmontant, Gambetta",
  },
  "boulogne-billancourt": {
    title: "Création site web Boulogne-Billancourt | Déclic Digital",
    description: "Agence web Boulogne-Billancourt (92100). Site professionnel pour TPE et artisans. 1ère ville du 92 - SEO local inclus. Devis gratuit.",
    h1: "Création de site web Boulogne-Billancourt - 1ère ville des Hauts-de-Seine",
  },
  "nanterre": {
    title: "Création site web Nanterre - Porte de La Défense",
    description: "Agence web Nanterre (92000). Site professionnel pour TPE et artisans. Préfecture du 92, à deux pas de La Défense. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Nanterre - Préfecture du 92, porte de La Défense",
  },
  "asnieres-sur-seine": {
    title: "Création site web Asnières-sur-Seine | Déclic Digital",
    description: "Agence web Asnières-sur-Seine (92600). Site pro pour TPE et indépendants. Ligne 13 - 10 min de Paris. SEO local et GEO inclus. Devis gratuit.",
    h1: "Création de site web Asnières-sur-Seine - Hauts-de-Seine (92)",
  },
  "issy-les-moulineaux": {
    title: "Création site web Issy-les-Moulineaux | Déclic Digital",
    description: "Agence web Issy-les-Moulineaux (92130). Site pro pour TPE et artisans. Ville la plus connectée de France. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Issy-les-Moulineaux - Ville digitale du 92",
  },
  "levallois-perret": {
    title: "Création site web Levallois-Perret | Déclic Digital",
    description: "Agence web Levallois-Perret (92300). Site professionnel pour TPE. Ville la plus dense de France - marché de proximité exceptionnel. Devis gratuit.",
    h1: "Création de site web Levallois-Perret - Ville la plus dense de France",
  },
  "neuilly-sur-seine": {
    title: "Création site web Neuilly-sur-Seine | Déclic Digital",
    description: "Agence web Neuilly-sur-Seine (92200). Site haut de gamme pour TPE et professions libérales. Clientèle à fort pouvoir d'achat. Devis gratuit.",
    h1: "Création de site web Neuilly-sur-Seine - Site premium pour le 92",
  },
  "courbevoie": {
    title: "Création site web Courbevoie - La Défense & Bécon",
    description: "Agence web Courbevoie (92400). Site professionnel pour TPE et artisans. Au pied de La Défense, entre Bécon et Charras. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Courbevoie - Au pied de La Défense",
  },
  "colombes": {
    title: "Création site web Colombes | Déclic Digital 92",
    description: "Agence web Colombes (92700). Site pro pour TPE et artisans. 1ère ville du nord du 92 - 85 000 habitants. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Colombes - 1ère ville du nord du 92",
  },
  "rueil-malmaison": {
    title: "Création site web Rueil-Malmaison | Déclic Digital",
    description: "Agence web Rueil-Malmaison (92500). Site professionnel pour TPE et familles. Ville verte et résidentielle du 92. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Rueil-Malmaison - Ville verte du 92",
  },
  "antony": {
    title: "Création site web Antony | Déclic Digital 92",
    description: "Agence web Antony (92160). Site professionnel pour TPE et artisans. 2ème ville du sud du 92 - marché local fidèle. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Antony - Sud des Hauts-de-Seine (92)",
  },
  "bagneux": {
    title: "Création site web Bagneux - Métro ligne 4 | 92",
    description: "Agence web Bagneux (92220). Site pro pour TPE en plein essor. Nouvelle desserte métro ligne 4 - marché en expansion. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Bagneux - Ville en pleine expansion du 92",
  },
  "bois-colombes": {
    title: "Création site web Bois-Colombes | Déclic Digital",
    description: "Agence web Bois-Colombes (92270). Site pro pour TPE et artisans. Petite ville familiale proche de La Défense. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Bois-Colombes - Village urbain du 92",
  },
  "bourg-la-reine": {
    title: "Création site web Bourg-la-Reine | Déclic Digital",
    description: "Agence web Bourg-la-Reine (92340). Site pro pour TPE et commerçants. Ville résidentielle RER B - clientèle stable. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Bourg-la-Reine - Hauts-de-Seine (92)",
  },
  "chatillon": {
    title: "Création site web Châtillon - Tramway T6 | 92",
    description: "Agence web Châtillon (92320). Site pro pour TPE et artisans. Bien desservi par le T6 et bientôt le Grand Paris. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Châtillon - Entre Montrouge et Clamart",
  },
  "chatenay-malabry": {
    title: "Création site web Châtenay-Malabry | Déclic Digital",
    description: "Agence web Châtenay-Malabry (92290). Site pro pour TPE. Ville en mutation près du parc de Sceaux. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Châtenay-Malabry - Près du parc de Sceaux",
  },
  "chaville": {
    title: "Création site web Chaville | Déclic Digital 92",
    description: "Agence web Chaville (92370). Site pro pour TPE et artisans. Ville verdoyante entre deux forêts. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Chaville - Entre forêt de Fausses-Reposes et Meudon",
  },
  "clamart": {
    title: "Création site web Clamart - Tramway T6 | 92",
    description: "Agence web Clamart (92140). Site pro pour TPE et artisans. Ville verte en pleine croissance. 53 000 habitants. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Clamart - Ville verte du sud du 92",
  },
  "clichy": {
    title: "Création site web Clichy - Portes de Paris 17 | 92",
    description: "Agence web Clichy (92110). Site pro pour TPE et artisans. Limitrophe Paris 17ème - 63 000 habitants en pleine croissance. Devis gratuit.",
    h1: "Création de site web Clichy - Aux portes de Paris 17ème",
  },
  "fontenay-aux-roses": {
    title: "Création site web Fontenay-aux-Roses | Déclic Digital",
    description: "Agence web Fontenay-aux-Roses (92260). Site pro pour TPE et artisans. Ville fleurie du sud du 92. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Fontenay-aux-Roses - Hauts-de-Seine (92)",
  },
  "garches": {
    title: "Création site web Garches | Déclic Digital 92",
    description: "Agence web Garches (92380). Site pro pour TPE et professions libérales. Ville résidentielle proche Saint-Cloud. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Garches - Commune résidentielle du 92",
  },
  "gennevilliers": {
    title: "Création site web Gennevilliers - Port fluvial | 92",
    description: "Agence web Gennevilliers (92230). Site pro pour TPE et entreprises. 1er port fluvial d'Île-de-France - marché diversifié. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Gennevilliers - Pôle économique du nord du 92",
  },
  "la-garenne-colombes": {
    title: "Création site web La Garenne-Colombes | Déclic Digital",
    description: "Agence web La Garenne-Colombes (92250). Site pro pour TPE. Village urbain aux portes de La Défense. SEO local inclus. Devis gratuit.",
    h1: "Création de site web La Garenne-Colombes - Village aux portes de La Défense",
  },
  "le-plessis-robinson": {
    title: "Création site web Le Plessis-Robinson | Déclic Digital",
    description: "Agence web Le Plessis-Robinson (92350). Site pro pour TPE. Ville 4 fleurs - qualité de vie reconnue dans le 92. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Le Plessis-Robinson - Ville fleurie du 92",
  },
  "malakoff": {
    title: "Création site web Malakoff - Portes de Paris 14 | 92",
    description: "Agence web Malakoff (92240). Site pro pour TPE, artisans et commerçants. Ville populaire limitrophe Paris 14ème. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Malakoff - Aux portes de Paris 14ème",
  },
  "marnes-la-coquette": {
    title: "Création site web Marnes-la-Coquette | Déclic Digital",
    description: "Agence web Marnes-la-Coquette (92430). Site haut de gamme pour TPE. Plus petite commune du 92 - clientèle de prestige. Devis gratuit.",
    h1: "Création de site web Marnes-la-Coquette - Plus petite commune du 92",
  },
  "meudon": {
    title: "Création site web Meudon - Observatoire & Forêt | 92",
    description: "Agence web Meudon (92190). Site pro pour TPE et artisans. Ville résidentielle entre Seine et forêt. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Meudon - Entre Seine et forêt domaniale",
  },
  "montrouge": {
    title: "Création site web Montrouge - Métro ligne 4 | 92",
    description: "Agence web Montrouge (92120). Site pro pour TPE. Connectée à Paris par le métro ligne 4 - 50 000 habitants. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Montrouge - Aux portes de Paris par le métro",
  },
  "puteaux": {
    title: "Création site web Puteaux - Coeur de La Défense | 92",
    description: "Agence web Puteaux (92800). Site pro pour TPE et artisans. Au coeur de La Défense - 180 000 salariés à proximité. Devis gratuit.",
    h1: "Création de site web Puteaux - Au coeur de La Défense",
  },
  "saint-cloud": {
    title: "Création site web Saint-Cloud - Parc historique | 92",
    description: "Agence web Saint-Cloud (92210). Site haut de gamme pour TPE et professions libérales. Ville de prestige - 460 ha de parc. Devis gratuit.",
    h1: "Création de site web Saint-Cloud - Ville de prestige du 92",
  },
  "sceaux": {
    title: "Création site web Sceaux - Château & Parc Le Nôtre",
    description: "Agence web Sceaux (92330). Site élégant pour TPE et professions libérales. Ville raffinée autour du parc Le Nôtre. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Sceaux - Ville élégante autour du parc Le Nôtre",
  },
  "sevres": {
    title: "Création site web Sèvres - Manufacture de porcelaine",
    description: "Agence web Sèvres (92310). Site haut de gamme pour TPE. Ville d'exception - manufacture de porcelaine depuis 1740. Devis gratuit.",
    h1: "Création de site web Sèvres - Excellence et savoir-faire du 92",
  },
  "suresnes": {
    title: "Création site web Suresnes - La Défense & Bois | 92",
    description: "Agence web Suresnes (92150). Site pro pour TPE et artisans. Entre La Défense et le Bois de Boulogne. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Suresnes - Entre La Défense et le Bois de Boulogne",
  },
  "vanves": {
    title: "Création site web Vanves - Portes de Paris 15 | 92",
    description: "Agence web Vanves (92170). Site pro pour TPE. Petite ville dynamique limitrophe Paris 15ème. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Vanves - Aux portes de Paris 15ème",
  },
  "vaucresson": {
    title: "Création site web Vaucresson | Déclic Digital 92",
    description: "Agence web Vaucresson (92420). Site pro pour TPE et professions libérales. Commune boisée et résidentielle du 92. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Vaucresson - Commune boisée et résidentielle du 92",
  },
  "ville-d-avray": {
    title: "Création site web Ville-d'Avray - Étangs de Corot",
    description: "Agence web Ville-d'Avray (92410). Site pro pour TPE. Village pittoresque des étangs de Corot. SEO local inclus. Devis gratuit.",
    h1: "Création de site web Ville-d'Avray - Village pittoresque des étangs de Corot",
  },
  "villeneuve-la-garenne": {
    title: "Création site web Villeneuve-la-Garenne | Déclic Digital",
    description: "Agence web Villeneuve-la-Garenne (92390). Site pro pour TPE et commerçants. En bord de Seine - zones commerciales actives. Devis gratuit.",
    h1: "Création de site web Villeneuve-la-Garenne - En bord de Seine",
  },
};

// ============================================================
// RÉFÉRENCEMENT SEO — 55 pages
// ============================================================
const seoPageMeta: Record<string, SeoMeta> = {

  "paris-1er": {
    title: "SEO local Paris 1er - Louvre, Châtelet, Les Halles",
    description: "Référencement naturel Paris 1er arrondissement (Louvre, Châtelet, Les Halles). Déclic Digital booste votre visibilité Google locale. Audit SEO gratuit.",
    h1: "Référencement SEO local Paris 1er arrondissement - Louvre, Châtelet, Les Halles",
  },
  "paris-2eme": {
    title: "SEO local Paris 2ème - Sentier, Bourse, Grands Boulevards",
    description: "Référencement naturel Paris 2ème arrondissement (Sentier, Bourse). Déclic Digital optimise votre visibilité Google. Audit SEO offert.",
    h1: "Référencement SEO local Paris 2ème - Sentier, Bourse, Grands Boulevards",
  },
  "paris-3eme": {
    title: "SEO local Paris 3ème - Le Marais & Temple",
    description: "Référencement naturel Paris 3ème arrondissement (Marais, Temple, Arts et Métiers). Déclic Digital booste votre visibilité. Audit SEO offert.",
    h1: "Référencement SEO local Paris 3ème - Marais, Temple, Arts et Métiers",
  },
  "paris-4eme": {
    title: "SEO local Paris 4ème - Hôtel de Ville & Île de la Cité",
    description: "Référencement naturel Paris 4ème arrondissement (Hôtel de Ville, Île de la Cité, Pompidou). Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Paris 4ème - Hôtel de Ville, Île de la Cité",
  },
  "paris-5eme": {
    title: "SEO local Paris 5ème - Quartier Latin & Panthéon",
    description: "Référencement naturel Paris 5ème arrondissement (Quartier Latin, Panthéon, Mouffetard). Déclic Digital booste votre visibilité. Audit SEO offert.",
    h1: "Référencement SEO local Paris 5ème - Quartier Latin, Panthéon, Mouffetard",
  },
  "paris-6eme": {
    title: "SEO local Paris 6ème - Saint-Germain-des-Prés",
    description: "Référencement naturel Paris 6ème arrondissement (Saint-Germain, Odéon, Luxembourg). Clientèle premium. Déclic Digital. Audit gratuit.",
    h1: "Référencement SEO local Paris 6ème - Saint-Germain-des-Prés, Odéon, Luxembourg",
  },
  "paris-7eme": {
    title: "SEO local Paris 7ème - Tour Eiffel & Invalides",
    description: "Référencement naturel Paris 7ème arrondissement (Tour Eiffel, Invalides, rue du Bac). Déclic Digital booste votre visibilité. Audit SEO offert.",
    h1: "Référencement SEO local Paris 7ème - Tour Eiffel, Invalides, Champ de Mars",
  },
  "paris-8eme": {
    title: "SEO local Paris 8ème - Champs-Élysées & Madeleine",
    description: "Référencement naturel Paris 8ème arrondissement (Champs-Élysées, Madeleine). Clientèle premium. Déclic Digital optimise votre visibilité. Audit offert.",
    h1: "Référencement SEO local Paris 8ème - Champs-Élysées, Madeleine, Miromesnil",
  },
  "paris-9eme": {
    title: "SEO local Paris 9ème - Opéra & Grands Boulevards",
    description: "Référencement naturel Paris 9ème arrondissement (Opéra, Grands Boulevards, Trinité). Déclic Digital booste votre visibilité Google. Audit SEO offert.",
    h1: "Référencement SEO local Paris 9ème - Opéra, Grands Boulevards, Trinité",
  },
  "paris-10eme": {
    title: "SEO local Paris 10ème - Canal Saint-Martin & Gare du Nord",
    description: "Référencement naturel Paris 10ème arrondissement (Canal Saint-Martin, Gare du Nord). Déclic Digital booste votre visibilité. Audit SEO offert.",
    h1: "Référencement SEO local Paris 10ème - Canal Saint-Martin, Gare du Nord",
  },
  "paris-11eme": {
    title: "SEO local Paris 11ème - Bastille & Oberkampf",
    description: "Référencement naturel Paris 11ème arrondissement (Bastille, Oberkampf, République). Déclic Digital booste votre visibilité Google. Audit SEO offert.",
    h1: "Référencement SEO local Paris 11ème - Bastille, Oberkampf, Charonne",
  },
  "paris-12eme": {
    title: "SEO local Paris 12ème - Bercy & Nation",
    description: "Référencement naturel Paris 12ème arrondissement (Bercy, Nation, Gare de Lyon). Déclic Digital booste votre visibilité Google. Audit SEO offert.",
    h1: "Référencement SEO local Paris 12ème - Bercy, Nation, Gare de Lyon",
  },
  "paris-13eme": {
    title: "SEO local Paris 13ème - Place d'Italie & Bibliothèque",
    description: "Référencement naturel Paris 13ème arrondissement (Place d'Italie, Bibliothèque, Tolbiac). Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Paris 13ème - Place d'Italie, Bibliothèque, Tolbiac",
  },
  "paris-14eme": {
    title: "SEO local Paris 14ème - Montparnasse & Alésia",
    description: "Référencement naturel Paris 14ème arrondissement (Montparnasse, Alésia, Denfert). Déclic Digital booste votre visibilité Google. Audit SEO offert.",
    h1: "Référencement SEO local Paris 14ème - Montparnasse, Alésia, Denfert-Rochereau",
  },
  "paris-15eme": {
    title: "SEO local Paris 15ème - Convention & Vaugirard",
    description: "Référencement naturel Paris 15ème (Convention, Vaugirard). 230 000 habitants à capter. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Paris 15ème - Convention, Vaugirard, La Motte-Picquet",
  },
  "paris-16eme": {
    title: "SEO local Paris 16ème - Trocadéro, Passy & Auteuil",
    description: "Référencement naturel Paris 16ème (Trocadéro, Passy, Auteuil). Clientèle premium - revenu le plus élevé de Paris. Déclic Digital. Audit gratuit.",
    h1: "Référencement SEO local Paris 16ème - Trocadéro, Passy, Auteuil, Muette",
  },
  "paris-17eme": {
    title: "SEO local Paris 17ème - Batignolles & Ternes",
    description: "Référencement naturel Paris 17ème arrondissement (Batignolles, Ternes, Monceau). Déclic Digital booste votre visibilité Google. Audit SEO offert.",
    h1: "Référencement SEO local Paris 17ème - Batignolles, Ternes, Monceau, Épinettes",
  },
  "paris-18eme": {
    title: "SEO local Paris 18ème - Montmartre & Abbesses",
    description: "Référencement naturel Paris 18ème (Montmartre, Abbesses, Barbès). 10M visiteurs/an au Sacré-Coeur. Déclic Digital booste votre visibilité. Audit offert.",
    h1: "Référencement SEO local Paris 18ème - Montmartre, Abbesses, Sacré-Coeur, Barbès",
  },
  "paris-19eme": {
    title: "SEO local Paris 19ème - Buttes-Chaumont & Villette",
    description: "Référencement naturel Paris 19ème (Buttes-Chaumont, Villette, Stalingrad). Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Paris 19ème - Buttes-Chaumont, Villette, Stalingrad",
  },
  "paris-20eme": {
    title: "SEO local Paris 20ème - Belleville & Ménilmontant",
    description: "Référencement naturel Paris 20ème (Belleville, Ménilmontant, Gambetta). Déclic Digital booste votre visibilité Google. Audit SEO offert.",
    h1: "Référencement SEO local Paris 20ème - Belleville, Ménilmontant, Gambetta",
  },
  "boulogne-billancourt": {
    title: "SEO local Boulogne-Billancourt | Déclic Digital 92",
    description: "Référencement Google Boulogne-Billancourt (92100). 1ère ville du 92 - 120 000 habitants. Déclic Digital booste votre visibilité locale. Audit gratuit.",
    h1: "Référencement SEO local Boulogne-Billancourt - 1ère ville des Hauts-de-Seine",
  },
  "nanterre": {
    title: "SEO local Nanterre - Préfecture du 92 | Déclic Digital",
    description: "Référencement Google Nanterre (92000). Préfecture du 92 aux portes de La Défense. Déclic Digital booste votre visibilité locale. Audit SEO gratuit.",
    h1: "Référencement SEO local Nanterre - Préfecture du 92, porte de La Défense",
  },
  "asnieres-sur-seine": {
    title: "Agence SEO Asnières-sur-Seine | Déclic Digital 92",
    description: "Référencement naturel, GEO et netlinking à Asnières-sur-Seine (92600). Résultats mesurables en 3 à 6 mois. Audit SEO offert, sans engagement.",
    h1: "Référencement SEO et GEO Asnières-sur-Seine - Hauts-de-Seine (92)",
  },
  "issy-les-moulineaux": {
    title: "SEO local Issy-les-Moulineaux - Ville digitale | 92",
    description: "Référencement Google Issy-les-Moulineaux (92130). Ville la plus connectée de France - exigence digitale élevée. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Issy-les-Moulineaux - Ville la plus connectée de France",
  },
  "levallois-perret": {
    title: "SEO local Levallois-Perret - Ville la plus dense | 92",
    description: "Référencement Google Levallois-Perret (92300). Ville la plus dense de France - clients à portée de main. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Levallois-Perret - Ville la plus dense de France",
  },
  "neuilly-sur-seine": {
    title: "SEO local Neuilly-sur-Seine - Clientèle premium | 92",
    description: "Référencement Google Neuilly-sur-Seine (92200). Revenu médian le plus élevé d'Île-de-France. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Neuilly-sur-Seine - Clientèle à fort pouvoir d'achat",
  },
  "courbevoie": {
    title: "SEO local Courbevoie - La Défense & Bécon | 92",
    description: "Référencement Google Courbevoie (92400). Au pied de La Défense - double marché résidentiel et pro. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Courbevoie - Au pied de La Défense",
  },
  "colombes": {
    title: "SEO local Colombes - 1ère ville du nord du 92",
    description: "Référencement Google Colombes (92700). 85 000 habitants - 1ère ville du nord des Hauts-de-Seine. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Colombes - 1ère ville du nord du 92",
  },
  "rueil-malmaison": {
    title: "SEO local Rueil-Malmaison - Ville verte du 92",
    description: "Référencement Google Rueil-Malmaison (92500). Ville résidentielle prisée - 80 000 habitants. Déclic Digital booste votre visibilité locale. Audit gratuit.",
    h1: "Référencement SEO local Rueil-Malmaison - Ville résidentielle et verte du 92",
  },
  "antony": {
    title: "SEO local Antony - Sud des Hauts-de-Seine | 92",
    description: "Référencement Google Antony (92160). 2ème ville du sud du 92 - clientèle de proximité fidèle. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Antony - Sud des Hauts-de-Seine (92)",
  },
  "bagneux": {
    title: "SEO local Bagneux - Nouvelle desserte métro | 92",
    description: "Référencement Google Bagneux (92220). Métro ligne 4 - ville en expansion rapide. Déclic Digital booste votre visibilité locale. Audit SEO gratuit.",
    h1: "Référencement SEO local Bagneux - Ville en pleine expansion du 92",
  },
  "bois-colombes": {
    title: "SEO local Bois-Colombes | Déclic Digital 92",
    description: "Référencement Google Bois-Colombes (92270). Village urbain proche La Défense. Déclic Digital booste votre visibilité locale. Audit SEO gratuit.",
    h1: "Référencement SEO local Bois-Colombes - Village urbain du 92",
  },
  "bourg-la-reine": {
    title: "SEO local Bourg-la-Reine - RER B | Déclic Digital",
    description: "Référencement Google Bourg-la-Reine (92340). Ville résidentielle RER B - clientèle stable. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Bourg-la-Reine - Hauts-de-Seine (92)",
  },
  "chatillon": {
    title: "SEO local Châtillon - T6 & Grand Paris | 92",
    description: "Référencement Google Châtillon (92320). Tramway T6 et future ligne 15. Déclic Digital booste votre visibilité locale. Audit SEO gratuit.",
    h1: "Référencement SEO local Châtillon - Entre Montrouge et Clamart",
  },
  "chatenay-malabry": {
    title: "SEO local Châtenay-Malabry - Parc de Sceaux | 92",
    description: "Référencement Google Châtenay-Malabry (92290). Ville en mutation près du parc de Sceaux. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Châtenay-Malabry - Près du parc de Sceaux",
  },
  "chaville": {
    title: "SEO local Chaville - Entre deux forêts | 92",
    description: "Référencement Google Chaville (92370). Commune verdoyante entre deux forêts domaniales. Concurrence faible. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Chaville - Entre forêt de Fausses-Reposes et Meudon",
  },
  "clamart": {
    title: "SEO local Clamart - Ville verte du sud du 92",
    description: "Référencement Google Clamart (92140). Forêt domaniale, T6 - 53 000 habitants en croissance. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Clamart - Ville verte et connectée du 92",
  },
  "clichy": {
    title: "SEO local Clichy - Aux portes de Paris 17 | 92",
    description: "Référencement Google Clichy (92110). 63 000 habitants - limitrophe Paris 17ème. Déclic Digital booste votre visibilité locale. Audit SEO gratuit.",
    h1: "Référencement SEO local Clichy - Aux portes de Paris 17ème",
  },
  "fontenay-aux-roses": {
    title: "SEO local Fontenay-aux-Roses | Déclic Digital 92",
    description: "Référencement Google Fontenay-aux-Roses (92260). Ville fleurie et résidentielle du sud du 92. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Fontenay-aux-Roses - Hauts-de-Seine (92)",
  },
  "garches": {
    title: "SEO local Garches - Commune résidentielle | 92",
    description: "Référencement Google Garches (92380). Commune résidentielle proche Saint-Cloud. Concurrence faible - positionnement rapide. Déclic Digital. Audit gratuit.",
    h1: "Référencement SEO local Garches - Commune résidentielle du 92",
  },
  "gennevilliers": {
    title: "SEO local Gennevilliers - 1er port fluvial IDF | 92",
    description: "Référencement Google Gennevilliers (92230). 1er port fluvial d'Île-de-France - marché diversifié. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Gennevilliers - Pôle économique du nord du 92",
  },
  "la-garenne-colombes": {
    title: "SEO local La Garenne-Colombes | Déclic Digital 92",
    description: "Référencement Google La Garenne-Colombes (92250). Village urbain aux portes de La Défense. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local La Garenne-Colombes - Village aux portes de La Défense",
  },
  "le-plessis-robinson": {
    title: "SEO local Le Plessis-Robinson - 4 fleurs | 92",
    description: "Référencement Google Le Plessis-Robinson (92350). Ville 4 fleurs - clientèle exigeante. Déclic Digital booste votre visibilité locale. Audit gratuit.",
    h1: "Référencement SEO local Le Plessis-Robinson - Ville fleurie du 92",
  },
  "malakoff": {
    title: "SEO local Malakoff - Aux portes de Paris 14 | 92",
    description: "Référencement Google Malakoff (92240). Limitrophe Paris 14ème - tissu commercial actif. Déclic Digital booste votre visibilité. Audit SEO gratuit.",
    h1: "Référencement SEO local Malakoff - Aux portes de Paris 14ème",
  },
  "marnes-la-coquette": {
    title: "SEO local Marnes-la-Coquette | Déclic Digital 92",
    description: "Référencement Google Marnes-la-Coquette (92430). Plus petite commune du 92 - clientèle de prestige. Concurrence quasi nulle. Audit SEO gratuit.",
    h1: "Référencement SEO local Marnes-la-Coquette - Plus petite commune du 92",
  },
  "meudon": {
    title: "SEO local Meudon - Observatoire & Seine | 92",
    description: "Référencement Google Meudon (92190). Entre Seine et forêt domaniale - clientèle résidentielle de qualité. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Meudon - Entre Seine et forêt domaniale",
  },
  "montrouge": {
    title: "SEO local Montrouge - Métro ligne 4 | 92",
    description: "Référencement Google Montrouge (92120). Connecté à Paris par le métro - 50 000 habitants. Déclic Digital booste votre visibilité. Audit SEO gratuit.",
    h1: "Référencement SEO local Montrouge - Connecté à Paris par le métro ligne 4",
  },
  "puteaux": {
    title: "SEO local Puteaux - Coeur de La Défense | 92",
    description: "Référencement Google Puteaux (92800). Au coeur de La Défense - 180 000 salariés à proximité. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Puteaux - Au coeur de La Défense",
  },
  "saint-cloud": {
    title: "SEO local Saint-Cloud - Ville de prestige | 92",
    description: "Référencement Google Saint-Cloud (92210). Ville de prestige et parc historique - clientèle exigeante. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Saint-Cloud - Ville de prestige du 92",
  },
  "sceaux": {
    title: "SEO local Sceaux - Château & Parc Le Nôtre | 92",
    description: "Référencement Google Sceaux (92330). Ville raffinée autour du parc Le Nôtre. Déclic Digital booste votre visibilité locale. Audit SEO gratuit.",
    h1: "Référencement SEO local Sceaux - Ville élégante autour du parc Le Nôtre",
  },
  "sevres": {
    title: "SEO local Sèvres - Manufacture & excellence | 92",
    description: "Référencement Google Sèvres (92310). Ville d'exception - manufacture nationale depuis 1740. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Sèvres - Excellence et savoir-faire du 92",
  },
  "suresnes": {
    title: "SEO local Suresnes - La Défense & Bois | 92",
    description: "Référencement Google Suresnes (92150). Entre La Défense et le Bois de Boulogne - clientèle active. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Suresnes - Entre La Défense et le Bois de Boulogne",
  },
  "vanves": {
    title: "SEO local Vanves - Aux portes de Paris 15 | 92",
    description: "Référencement Google Vanves (92170). Limitrophe Paris 15ème - dynamisme commercial. Déclic Digital booste votre visibilité. Audit SEO gratuit.",
    h1: "Référencement SEO local Vanves - Aux portes de Paris 15ème",
  },
  "vaucresson": {
    title: "SEO local Vaucresson - Commune boisée | 92",
    description: "Référencement Google Vaucresson (92420). Commune boisée et résidentielle. Concurrence faible - positionnement rapide. Déclic Digital. Audit gratuit.",
    h1: "Référencement SEO local Vaucresson - Commune boisée et résidentielle du 92",
  },
  "ville-d-avray": {
    title: "SEO local Ville-d'Avray - Étangs de Corot | 92",
    description: "Référencement Google Ville-d'Avray (92410). Village pittoresque - étangs de Corot. Concurrence quasi nulle. Déclic Digital. Audit SEO gratuit.",
    h1: "Référencement SEO local Ville-d'Avray - Village des étangs de Corot",
  },
  "villeneuve-la-garenne": {
    title: "SEO local Villeneuve-la-Garenne | Déclic Digital 92",
    description: "Référencement Google Villeneuve-la-Garenne (92390). En bord de Seine - zones commerciales actives. Déclic Digital booste votre visibilité. Audit gratuit.",
    h1: "Référencement SEO local Villeneuve-la-Garenne - En bord de Seine",
  },
};

// ============================================================
// Fonction utilitaire principale
// ============================================================
export function getSeoMeta(service: Service, slug: string, nameShort: string): SeoMeta {
  if (service === "creation") {
    return creationMeta[slug] ?? {
      title: `Création site web ${nameShort} | Déclic Digital`,
      description: `Agence web ${nameShort}. Site professionnel pour TPE, artisans et indépendants. SEO local inclus. Devis gratuit.`,
      h1: `Création de site web à ${nameShort} - TPE et artisans`,
    };
  }
  return seoPageMeta[slug] ?? {
    title: `SEO local ${nameShort} | Déclic Digital`,
    description: `Référencement Google ${nameShort}. Déclic Digital booste la visibilité des TPE et artisans. Audit SEO gratuit.`,
    h1: `Référencement SEO local ${nameShort} - Hauts-de-Seine`,
  };
}
