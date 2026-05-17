export interface CityData {
  slug: string;
  name: string;
  nameShort: string;
  description: string;
  postalCode: string;
  region: "paris" | "hauts-de-seine";
}

export const cities: CityData[] = [
  // Paris - tous les arrondissements
  { slug: "paris-1er", name: "Paris 1er arrondissement", nameShort: "Paris 1er", description: "au coeur de Paris, dans le 1er arrondissement (Louvre, Châtelet, Les Halles)", postalCode: "75001", region: "paris" },
  { slug: "paris-2eme", name: "Paris 2ème arrondissement", nameShort: "Paris 2ème", description: "dans le 2ème arrondissement de Paris (Bourse, Sentier)", postalCode: "75002", region: "paris" },
  { slug: "paris-3eme", name: "Paris 3ème arrondissement", nameShort: "Paris 3ème", description: "dans le 3ème arrondissement de Paris (Marais, Temple)", postalCode: "75003", region: "paris" },
  { slug: "paris-4eme", name: "Paris 4ème arrondissement", nameShort: "Paris 4ème", description: "dans le 4ème arrondissement de Paris (Marais, Hôtel de Ville, Île de la Cité)", postalCode: "75004", region: "paris" },
  { slug: "paris-5eme", name: "Paris 5ème arrondissement", nameShort: "Paris 5ème", description: "dans le 5ème arrondissement de Paris (Quartier Latin, Panthéon, Jardin des Plantes)", postalCode: "75005", region: "paris" },
  { slug: "paris-6eme", name: "Paris 6ème arrondissement", nameShort: "Paris 6ème", description: "dans le 6ème arrondissement de Paris (Saint-Germain-des-Prés, Luxembourg, Odéon)", postalCode: "75006", region: "paris" },
  { slug: "paris-7eme", name: "Paris 7ème arrondissement", nameShort: "Paris 7ème", description: "dans le 7ème arrondissement de Paris (Tour Eiffel, Invalides, Champ de Mars)", postalCode: "75007", region: "paris" },
  { slug: "paris-8eme", name: "Paris 8ème arrondissement", nameShort: "Paris 8ème", description: "dans le 8ème arrondissement de Paris (Champs-Élysées, Madeleine)", postalCode: "75008", region: "paris" },
  { slug: "paris-9eme", name: "Paris 9ème arrondissement", nameShort: "Paris 9ème", description: "dans le 9ème arrondissement de Paris (Opéra, Grands Boulevards)", postalCode: "75009", region: "paris" },
  { slug: "paris-10eme", name: "Paris 10ème arrondissement", nameShort: "Paris 10ème", description: "dans le 10ème arrondissement de Paris (Gare du Nord, Canal Saint-Martin)", postalCode: "75010", region: "paris" },
  { slug: "paris-11eme", name: "Paris 11ème arrondissement", nameShort: "Paris 11ème", description: "dans le 11ème arrondissement de Paris (Bastille, Oberkampf, République)", postalCode: "75011", region: "paris" },
  { slug: "paris-12eme", name: "Paris 12ème arrondissement", nameShort: "Paris 12ème", description: "dans le 12ème arrondissement de Paris (Bastille, Bercy, Nation, Bois de Vincennes)", postalCode: "75012", region: "paris" },
  { slug: "paris-13eme", name: "Paris 13ème arrondissement", nameShort: "Paris 13ème", description: "dans le 13ème arrondissement de Paris (Place d'Italie, Bibliothèque, Chinatown)", postalCode: "75013", region: "paris" },
  { slug: "paris-14eme", name: "Paris 14ème arrondissement", nameShort: "Paris 14ème", description: "dans le 14ème arrondissement de Paris (Montparnasse, Denfert-Rochereau, Alésia)", postalCode: "75014", region: "paris" },
  { slug: "paris-15eme", name: "Paris 15ème arrondissement", nameShort: "Paris 15ème", description: "dans le 15ème arrondissement de Paris (Vaugirard, Convention, Commerce)", postalCode: "75015", region: "paris" },
  { slug: "paris-16eme", name: "Paris 16ème arrondissement", nameShort: "Paris 16ème", description: "dans le 16ème arrondissement de Paris (Trocadéro, Passy, Auteuil)", postalCode: "75016", region: "paris" },
  { slug: "paris-17eme", name: "Paris 17ème arrondissement", nameShort: "Paris 17ème", description: "dans le 17ème arrondissement de Paris (Batignolles, Ternes, Monceau)", postalCode: "75017", region: "paris" },
  { slug: "paris-18eme", name: "Paris 18ème arrondissement", nameShort: "Paris 18ème", description: "dans le 18ème arrondissement de Paris (Montmartre, Barbès, Jules Joffrin)", postalCode: "75018", region: "paris" },
  { slug: "paris-19eme", name: "Paris 19ème arrondissement", nameShort: "Paris 19ème", description: "dans le 19ème arrondissement de Paris (Buttes-Chaumont, Villette, Stalingrad)", postalCode: "75019", region: "paris" },
  { slug: "paris-20eme", name: "Paris 20ème arrondissement", nameShort: "Paris 20ème", description: "dans le 20ème arrondissement de Paris (Belleville, Ménilmontant, Père-Lachaise)", postalCode: "75020", region: "paris" },
  // Hauts-de-Seine (92) - toutes les villes
  { slug: "antony", name: "Antony", nameShort: "Antony", description: "à Antony (92), ville résidentielle et familiale du sud des Hauts-de-Seine", postalCode: "92160", region: "hauts-de-seine" },
  { slug: "asnieres-sur-seine", name: "Asnières-sur-Seine", nameShort: "Asnières-sur-Seine", description: "à Asnières-sur-Seine (92), aux portes de Paris", postalCode: "92600", region: "hauts-de-seine" },
  { slug: "bagneux", name: "Bagneux", nameShort: "Bagneux", description: "à Bagneux (92), ville en pleine transformation avec le métro ligne 4", postalCode: "92220", region: "hauts-de-seine" },
  { slug: "bois-colombes", name: "Bois-Colombes", nameShort: "Bois-Colombes", description: "à Bois-Colombes (92), petite ville résidentielle et familiale", postalCode: "92270", region: "hauts-de-seine" },
  { slug: "boulogne-billancourt", name: "Boulogne-Billancourt", nameShort: "Boulogne-Billancourt", description: "à Boulogne-Billancourt (92), première ville des Hauts-de-Seine", postalCode: "92100", region: "hauts-de-seine" },
  { slug: "bourg-la-reine", name: "Bourg-la-Reine", nameShort: "Bourg-la-Reine", description: "à Bourg-la-Reine (92), ville résidentielle du sud du 92", postalCode: "92340", region: "hauts-de-seine" },
  { slug: "chatillon", name: "Châtillon", nameShort: "Châtillon", description: "à Châtillon (92), ville bien desservie et en plein essor", postalCode: "92320", region: "hauts-de-seine" },
  { slug: "chatenay-malabry", name: "Châtenay-Malabry", nameShort: "Châtenay-Malabry", description: "à Châtenay-Malabry (92), ville verte aux portes du parc de Sceaux", postalCode: "92290", region: "hauts-de-seine" },
  { slug: "chaville", name: "Chaville", nameShort: "Chaville", description: "à Chaville (92), ville calme et verdoyante", postalCode: "92370", region: "hauts-de-seine" },
  { slug: "clamart", name: "Clamart", nameShort: "Clamart", description: "à Clamart (92), ville verdoyante et bien connectée", postalCode: "92140", region: "hauts-de-seine" },
  { slug: "clichy", name: "Clichy", nameShort: "Clichy", description: "à Clichy (92), ville dynamique aux portes de Paris 17ème", postalCode: "92110", region: "hauts-de-seine" },
  { slug: "colombes", name: "Colombes", nameShort: "Colombes", description: "à Colombes (92), ville en plein renouveau économique", postalCode: "92700", region: "hauts-de-seine" },
  { slug: "courbevoie", name: "Courbevoie", nameShort: "Courbevoie", description: "à Courbevoie (92), ville dynamique au pied de La Défense", postalCode: "92400", region: "hauts-de-seine" },
  { slug: "fontenay-aux-roses", name: "Fontenay-aux-Roses", nameShort: "Fontenay-aux-Roses", description: "à Fontenay-aux-Roses (92), charmante ville résidentielle du sud du 92", postalCode: "92260", region: "hauts-de-seine" },
  { slug: "garches", name: "Garches", nameShort: "Garches", description: "à Garches (92), commune résidentielle des Hauts-de-Seine", postalCode: "92380", region: "hauts-de-seine" },
  { slug: "gennevilliers", name: "Gennevilliers", nameShort: "Gennevilliers", description: "à Gennevilliers (92), pôle économique et culturel du nord du 92", postalCode: "92230", region: "hauts-de-seine" },
  { slug: "issy-les-moulineaux", name: "Issy-les-Moulineaux", nameShort: "Issy-les-Moulineaux", description: "à Issy-les-Moulineaux (92), pôle d'innovation aux portes de Paris", postalCode: "92130", region: "hauts-de-seine" },
  { slug: "la-garenne-colombes", name: "La Garenne-Colombes", nameShort: "La Garenne-Colombes", description: "à La Garenne-Colombes (92), ville résidentielle proche de La Défense", postalCode: "92250", region: "hauts-de-seine" },
  { slug: "le-plessis-robinson", name: "Le Plessis-Robinson", nameShort: "Le Plessis-Robinson", description: "au Plessis-Robinson (92), ville fleurie et résidentielle", postalCode: "92350", region: "hauts-de-seine" },
  { slug: "levallois-perret", name: "Levallois-Perret", nameShort: "Levallois-Perret", description: "à Levallois-Perret (92), ville d'entreprises et de startups", postalCode: "92300", region: "hauts-de-seine" },
  { slug: "malakoff", name: "Malakoff", nameShort: "Malakoff", description: "à Malakoff (92), ville active aux portes de Paris", postalCode: "92240", region: "hauts-de-seine" },
  { slug: "marnes-la-coquette", name: "Marnes-la-Coquette", nameShort: "Marnes-la-Coquette", description: "à Marnes-la-Coquette (92), village résidentiel au coeur de la nature", postalCode: "92430", region: "hauts-de-seine" },
  { slug: "meudon", name: "Meudon", nameShort: "Meudon", description: "à Meudon (92), entre nature et dynamisme économique", postalCode: "92190", region: "hauts-de-seine" },
  { slug: "montrouge", name: "Montrouge", nameShort: "Montrouge", description: "à Montrouge (92), ville commerçante limitrophe de Paris", postalCode: "92120", region: "hauts-de-seine" },
  { slug: "nanterre", name: "Nanterre", nameShort: "Nanterre", description: "à Nanterre (92), préfecture des Hauts-de-Seine et pôle économique majeur", postalCode: "92000", region: "hauts-de-seine" },
  { slug: "neuilly-sur-seine", name: "Neuilly-sur-Seine", nameShort: "Neuilly-sur-Seine", description: "à Neuilly-sur-Seine (92), ville résidentielle prestigieuse", postalCode: "92200", region: "hauts-de-seine" },
  { slug: "puteaux", name: "Puteaux", nameShort: "Puteaux", description: "à Puteaux (92), ville au coeur de La Défense", postalCode: "92800", region: "hauts-de-seine" },
  { slug: "rueil-malmaison", name: "Rueil-Malmaison", nameShort: "Rueil-Malmaison", description: "à Rueil-Malmaison (92), ville verte et dynamique des Hauts-de-Seine", postalCode: "92500", region: "hauts-de-seine" },
  { slug: "saint-cloud", name: "Saint-Cloud", nameShort: "Saint-Cloud", description: "à Saint-Cloud (92), ville résidentielle avec son parc historique", postalCode: "92210", region: "hauts-de-seine" },
  { slug: "sceaux", name: "Sceaux", nameShort: "Sceaux", description: "à Sceaux (92), ville élégante autour de son château et parc", postalCode: "92330", region: "hauts-de-seine" },
  { slug: "sevres", name: "Sèvres", nameShort: "Sèvres", description: "à Sèvres (92), ville au patrimoine riche", postalCode: "92310", region: "hauts-de-seine" },
  { slug: "suresnes", name: "Suresnes", nameShort: "Suresnes", description: "à Suresnes (92), ville attractive entre La Défense et le Bois de Boulogne", postalCode: "92150", region: "hauts-de-seine" },
  { slug: "vanves", name: "Vanves", nameShort: "Vanves", description: "à Vanves (92), petite ville dynamique limitrophe de Paris 15ème", postalCode: "92170", region: "hauts-de-seine" },
  { slug: "vaucresson", name: "Vaucresson", nameShort: "Vaucresson", description: "à Vaucresson (92), commune résidentielle et boisée", postalCode: "92420", region: "hauts-de-seine" },
  { slug: "ville-d-avray", name: "Ville-d'Avray", nameShort: "Ville-d'Avray", description: "à Ville-d'Avray (92), village pittoresque des Hauts-de-Seine", postalCode: "92410", region: "hauts-de-seine" },
  { slug: "villeneuve-la-garenne", name: "Villeneuve-la-Garenne", nameShort: "Villeneuve-la-Garenne", description: "à Villeneuve-la-Garenne (92), ville commerçante en bord de Seine", postalCode: "92390", region: "hauts-de-seine" },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}
