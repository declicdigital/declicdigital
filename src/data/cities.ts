export interface CityData {
  slug: string;
  name: string;
  nameShort: string;
  description: string;
  postalCode: string;
  region: "paris" | "hauts-de-seine";
}

export const cities: CityData[] = [
  // Paris arrondissements
  { slug: "paris-1er", name: "Paris 1er arrondissement", nameShort: "Paris 1er", description: "au coeur de Paris, dans le 1er arrondissement (Louvre, Châtelet, Les Halles)", postalCode: "75001", region: "paris" },
  { slug: "paris-2eme", name: "Paris 2ème arrondissement", nameShort: "Paris 2ème", description: "dans le 2ème arrondissement de Paris (Bourse, Sentier)", postalCode: "75002", region: "paris" },
  { slug: "paris-3eme", name: "Paris 3ème arrondissement", nameShort: "Paris 3ème", description: "dans le 3ème arrondissement de Paris (Marais, Temple)", postalCode: "75003", region: "paris" },
  { slug: "paris-4eme", name: "Paris 4ème arrondissement", nameShort: "Paris 4ème", description: "dans le 4ème arrondissement de Paris (Marais, Hôtel de Ville, Île de la Cité)", postalCode: "75004", region: "paris" },
  { slug: "paris-8eme", name: "Paris 8ème arrondissement", nameShort: "Paris 8ème", description: "dans le 8ème arrondissement de Paris (Champs-Élysées, Madeleine)", postalCode: "75008", region: "paris" },
  { slug: "paris-9eme", name: "Paris 9ème arrondissement", nameShort: "Paris 9ème", description: "dans le 9ème arrondissement de Paris (Opéra, Grands Boulevards)", postalCode: "75009", region: "paris" },
  { slug: "paris-10eme", name: "Paris 10ème arrondissement", nameShort: "Paris 10ème", description: "dans le 10ème arrondissement de Paris (Gare du Nord, Canal Saint-Martin)", postalCode: "75010", region: "paris" },
  { slug: "paris-15eme", name: "Paris 15ème arrondissement", nameShort: "Paris 15ème", description: "dans le 15ème arrondissement de Paris (Vaugirard, Convention, Commerce)", postalCode: "75015", region: "paris" },
  { slug: "paris-16eme", name: "Paris 16ème arrondissement", nameShort: "Paris 16ème", description: "dans le 16ème arrondissement de Paris (Trocadéro, Passy, Auteuil)", postalCode: "75016", region: "paris" },
  { slug: "paris-17eme", name: "Paris 17ème arrondissement", nameShort: "Paris 17ème", description: "dans le 17ème arrondissement de Paris (Batignolles, Ternes, Monceau)", postalCode: "75017", region: "paris" },
  // Grandes villes du 92
  { slug: "boulogne-billancourt", name: "Boulogne-Billancourt", nameShort: "Boulogne-Billancourt", description: "à Boulogne-Billancourt (92), première ville des Hauts-de-Seine", postalCode: "92100", region: "hauts-de-seine" },
  { slug: "issy-les-moulineaux", name: "Issy-les-Moulineaux", nameShort: "Issy-les-Moulineaux", description: "à Issy-les-Moulineaux (92), pôle d'innovation aux portes de Paris", postalCode: "92130", region: "hauts-de-seine" },
  { slug: "nanterre", name: "Nanterre", nameShort: "Nanterre", description: "à Nanterre (92), préfecture des Hauts-de-Seine et pôle économique majeur", postalCode: "92000", region: "hauts-de-seine" },
  { slug: "courbevoie", name: "Courbevoie", nameShort: "Courbevoie", description: "à Courbevoie (92), ville dynamique au pied de La Défense", postalCode: "92400", region: "hauts-de-seine" },
  { slug: "levallois-perret", name: "Levallois-Perret", nameShort: "Levallois-Perret", description: "à Levallois-Perret (92), ville d'entreprises et de startups", postalCode: "92300", region: "hauts-de-seine" },
  { slug: "neuilly-sur-seine", name: "Neuilly-sur-Seine", nameShort: "Neuilly-sur-Seine", description: "à Neuilly-sur-Seine (92), ville résidentielle prestigieuse", postalCode: "92200", region: "hauts-de-seine" },
  { slug: "colombes", name: "Colombes", nameShort: "Colombes", description: "à Colombes (92), ville en plein renouveau économique", postalCode: "92700", region: "hauts-de-seine" },
  { slug: "asnieres-sur-seine", name: "Asnières-sur-Seine", nameShort: "Asnières-sur-Seine", description: "à Asnières-sur-Seine (92), aux portes de Paris", postalCode: "92600", region: "hauts-de-seine" },
  { slug: "rueil-malmaison", name: "Rueil-Malmaison", nameShort: "Rueil-Malmaison", description: "à Rueil-Malmaison (92), ville verte et dynamique des Hauts-de-Seine", postalCode: "92500", region: "hauts-de-seine" },
  { slug: "antony", name: "Antony", nameShort: "Antony", description: "à Antony (92), ville résidentielle et familiale du sud des Hauts-de-Seine", postalCode: "92160", region: "hauts-de-seine" },
  { slug: "clamart", name: "Clamart", nameShort: "Clamart", description: "à Clamart (92), ville verdoyante et bien connectée", postalCode: "92140", region: "hauts-de-seine" },
  // Petites villes du 92
  { slug: "meudon", name: "Meudon", nameShort: "Meudon", description: "à Meudon (92), entre nature et dynamisme économique", postalCode: "92190", region: "hauts-de-seine" },
  { slug: "sevres", name: "Sèvres", nameShort: "Sèvres", description: "à Sèvres (92), ville au patrimoine riche", postalCode: "92310", region: "hauts-de-seine" },
  { slug: "vanves", name: "Vanves", nameShort: "Vanves", description: "à Vanves (92), petite ville dynamique limitrophe de Paris 15ème", postalCode: "92170", region: "hauts-de-seine" },
  { slug: "malakoff", name: "Malakoff", nameShort: "Malakoff", description: "à Malakoff (92), ville active aux portes de Paris", postalCode: "92240", region: "hauts-de-seine" },
  { slug: "montrouge", name: "Montrouge", nameShort: "Montrouge", description: "à Montrouge (92), ville commerçante limitrophe de Paris", postalCode: "92120", region: "hauts-de-seine" },
  { slug: "chatillon", name: "Châtillon", nameShort: "Châtillon", description: "à Châtillon (92), ville bien desservie et en plein essor", postalCode: "92320", region: "hauts-de-seine" },
  { slug: "suresnes", name: "Suresnes", nameShort: "Suresnes", description: "à Suresnes (92), ville attractive entre La Défense et le Bois de Boulogne", postalCode: "92150", region: "hauts-de-seine" },
  { slug: "garches", name: "Garches", nameShort: "Garches", description: "à Garches (92), commune résidentielle des Hauts-de-Seine", postalCode: "92380", region: "hauts-de-seine" },
  { slug: "chaville", name: "Chaville", nameShort: "Chaville", description: "à Chaville (92), ville calme et verdoyante", postalCode: "92370", region: "hauts-de-seine" },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}
