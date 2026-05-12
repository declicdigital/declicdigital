import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const cities = [
  { slug: "paris-1er", nameShort: "Paris 1er", description: "au coeur de Paris, dans le 1er arrondissement (Louvre, Châtelet, Les Halles)" },
  { slug: "paris-2eme", nameShort: "Paris 2ème", description: "dans le 2ème arrondissement de Paris (Bourse, Sentier)" },
  { slug: "paris-3eme", nameShort: "Paris 3ème", description: "dans le 3ème arrondissement de Paris (Marais, Temple)" },
  { slug: "paris-4eme", nameShort: "Paris 4ème", description: "dans le 4ème arrondissement de Paris (Marais, Hôtel de Ville, Île de la Cité)" },
  { slug: "paris-5eme", nameShort: "Paris 5ème", description: "dans le 5ème arrondissement de Paris (Quartier Latin, Panthéon)" },
  { slug: "paris-6eme", nameShort: "Paris 6ème", description: "dans le 6ème arrondissement de Paris (Saint-Germain-des-Prés, Luxembourg)" },
  { slug: "paris-7eme", nameShort: "Paris 7ème", description: "dans le 7ème arrondissement de Paris (Tour Eiffel, Invalides)" },
  { slug: "paris-8eme", nameShort: "Paris 8ème", description: "dans le 8ème arrondissement de Paris (Champs-Élysées, Madeleine)" },
  { slug: "paris-9eme", nameShort: "Paris 9ème", description: "dans le 9ème arrondissement de Paris (Opéra, Grands Boulevards)" },
  { slug: "paris-10eme", nameShort: "Paris 10ème", description: "dans le 10ème arrondissement de Paris (Gare du Nord, Canal Saint-Martin)" },
  { slug: "paris-11eme", nameShort: "Paris 11ème", description: "dans le 11ème arrondissement de Paris (Bastille, Oberkampf, République)" },
  { slug: "paris-12eme", nameShort: "Paris 12ème", description: "dans le 12ème arrondissement de Paris (Bercy, Nation, Gare de Lyon)" },
  { slug: "paris-13eme", nameShort: "Paris 13ème", description: "dans le 13ème arrondissement de Paris (Place d'Italie, Bibliothèque)" },
  { slug: "paris-14eme", nameShort: "Paris 14ème", description: "dans le 14ème arrondissement de Paris (Montparnasse, Denfert-Rochereau)" },
  { slug: "paris-15eme", nameShort: "Paris 15ème", description: "dans le 15ème arrondissement de Paris (Vaugirard, Convention)" },
  { slug: "paris-16eme", nameShort: "Paris 16ème", description: "dans le 16ème arrondissement de Paris (Trocadéro, Passy, Auteuil)" },
  { slug: "paris-17eme", nameShort: "Paris 17ème", description: "dans le 17ème arrondissement de Paris (Batignolles, Ternes)" },
  { slug: "paris-18eme", nameShort: "Paris 18ème", description: "dans le 18ème arrondissement de Paris (Montmartre, Barbès)" },
  { slug: "paris-19eme", nameShort: "Paris 19ème", description: "dans le 19ème arrondissement de Paris (Buttes-Chaumont, Villette)" },
  { slug: "paris-20eme", nameShort: "Paris 20ème", description: "dans le 20ème arrondissement de Paris (Belleville, Ménilmontant)" },
  { slug: "antony", nameShort: "Antony", description: "à Antony (92)" },
  { slug: "asnieres-sur-seine", nameShort: "Asnières-sur-Seine", description: "à Asnières-sur-Seine (92), aux portes de Paris" },
  { slug: "bagneux", nameShort: "Bagneux", description: "à Bagneux (92)" },
  { slug: "bois-colombes", nameShort: "Bois-Colombes", description: "à Bois-Colombes (92)" },
  { slug: "boulogne-billancourt", nameShort: "Boulogne-Billancourt", description: "à Boulogne-Billancourt (92), première ville des Hauts-de-Seine" },
  { slug: "bourg-la-reine", nameShort: "Bourg-la-Reine", description: "à Bourg-la-Reine (92)" },
  { slug: "chatillon", nameShort: "Châtillon", description: "à Châtillon (92)" },
  { slug: "chatenay-malabry", nameShort: "Châtenay-Malabry", description: "à Châtenay-Malabry (92)" },
  { slug: "chaville", nameShort: "Chaville", description: "à Chaville (92)" },
  { slug: "clamart", nameShort: "Clamart", description: "à Clamart (92)" },
  { slug: "clichy", nameShort: "Clichy", description: "à Clichy (92)" },
  { slug: "colombes", nameShort: "Colombes", description: "à Colombes (92)" },
  { slug: "courbevoie", nameShort: "Courbevoie", description: "à Courbevoie (92), au pied de La Défense" },
  { slug: "fontenay-aux-roses", nameShort: "Fontenay-aux-Roses", description: "à Fontenay-aux-Roses (92)" },
  { slug: "garches", nameShort: "Garches", description: "à Garches (92)" },
  { slug: "gennevilliers", nameShort: "Gennevilliers", description: "à Gennevilliers (92)" },
  { slug: "issy-les-moulineaux", nameShort: "Issy-les-Moulineaux", description: "à Issy-les-Moulineaux (92)" },
  { slug: "la-garenne-colombes", nameShort: "La Garenne-Colombes", description: "à La Garenne-Colombes (92)" },
  { slug: "le-plessis-robinson", nameShort: "Le Plessis-Robinson", description: "au Plessis-Robinson (92)" },
  { slug: "levallois-perret", nameShort: "Levallois-Perret", description: "à Levallois-Perret (92)" },
  { slug: "malakoff", nameShort: "Malakoff", description: "à Malakoff (92)" },
  { slug: "marnes-la-coquette", nameShort: "Marnes-la-Coquette", description: "à Marnes-la-Coquette (92)" },
  { slug: "meudon", nameShort: "Meudon", description: "à Meudon (92)" },
  { slug: "montrouge", nameShort: "Montrouge", description: "à Montrouge (92)" },
  { slug: "nanterre", nameShort: "Nanterre", description: "à Nanterre (92), préfecture des Hauts-de-Seine" },
  { slug: "neuilly-sur-seine", nameShort: "Neuilly-sur-Seine", description: "à Neuilly-sur-Seine (92)" },
  { slug: "puteaux", nameShort: "Puteaux", description: "à Puteaux (92), au coeur de La Défense" },
  { slug: "rueil-malmaison", nameShort: "Rueil-Malmaison", description: "à Rueil-Malmaison (92)" },
  { slug: "saint-cloud", nameShort: "Saint-Cloud", description: "à Saint-Cloud (92)" },
  { slug: "sceaux", nameShort: "Sceaux", description: "à Sceaux (92)" },
  { slug: "sevres", nameShort: "Sèvres", description: "à Sèvres (92)" },
  { slug: "suresnes", nameShort: "Suresnes", description: "à Suresnes (92)" },
  { slug: "vanves", nameShort: "Vanves", description: "à Vanves (92)" },
  { slug: "vaucresson", nameShort: "Vaucresson", description: "à Vaucresson (92)" },
  { slug: "ville-d-avray", nameShort: "Ville-d'Avray", description: "à Ville-d'Avray (92)" },
  { slug: "villeneuve-la-garenne", nameShort: "Villeneuve-la-Garenne", description: "à Villeneuve-la-Garenne (92)" },
];

const trades = [
  { slug: "plombier", name: "Plombier", nameShort: "Plombier", whyWebsite: "Un plombier visible sur Google capte les urgences et les demandes de devis. Vos clients cherchent \"plombier près de chez moi\" : sans site, ils appellent vos concurrents." },
  { slug: "electricien", name: "Électricien", nameShort: "Électricien", whyWebsite: "Les particuliers et entreprises recherchent un électricien de confiance en ligne. Un site professionnel avec vos certifications rassure et génère des contacts qualifiés." },
  { slug: "peintre-en-batiment", name: "Peintre en bâtiment", nameShort: "Peintre", whyWebsite: "Vos réalisations parlent pour vous. Un site avec un portfolio photos de vos chantiers est le meilleur argument commercial pour un peintre en bâtiment." },
  { slug: "menuisier", name: "Menuisier", nameShort: "Menuisier", whyWebsite: "Le savoir-faire artisanal mérite d'être montré. Un site web avec vos créations sur-mesure attire une clientèle prête à investir dans la qualité." },
  { slug: "serrurier", name: "Serrurier", nameShort: "Serrurier", whyWebsite: "La serrurerie est un secteur d'urgence : vos clients cherchent sur Google en situation de stress. Être en première page, c'est capter ces demandes immédiates." },
  { slug: "carreleur", name: "Carreleur", nameShort: "Carreleur", whyWebsite: "Les photos de vos chantiers sont votre meilleur commercial. Un site avec un portfolio visuel de vos poses de carrelage convainc plus qu'un simple bouche-à-oreille." },
  { slug: "maconnerie", name: "Maçon", nameShort: "Maçon", whyWebsite: "Les projets de maçonnerie représentent des budgets importants. Vos clients comparent plusieurs artisans en ligne : un site professionnel vous positionne comme un acteur sérieux." },
  { slug: "couvreur", name: "Couvreur", nameShort: "Couvreur", whyWebsite: "Les travaux de toiture sont recherchés en urgence ou par anticipation. Un site optimisé SEO local vous positionne sur ces deux types de demandes." },
  { slug: "jardinier-paysagiste", name: "Jardinier paysagiste", nameShort: "Paysagiste", whyWebsite: "Un portfolio de jardins aménagés est irrésistible. Votre site peut montrer des avant/après qui donnent envie aux propriétaires de vous contacter immédiatement." },
  { slug: "climaticien", name: "Climaticien", nameShort: "Climaticien", whyWebsite: "La demande en climatisation explose chaque été. Un site bien référencé vous permet de capter ce pic saisonnier et de remplir votre carnet de commandes." },
  { slug: "coiffeur", name: "Coiffeur", nameShort: "Coiffeur", whyWebsite: "Vos clients veulent voir vos réalisations avant de prendre rendez-vous. Un site avec galerie photos, tarifs et réservation en ligne augmente votre taux de remplissage." },
  { slug: "estheticienne", name: "Esthéticienne", nameShort: "Esthéticienne", whyWebsite: "Le secteur de la beauté est ultra-concurrentiel. Un site élégant avec vos soins, tarifs et avis clients vous démarque des instituts voisins." },
  { slug: "photographe", name: "Photographe", nameShort: "Photographe", whyWebsite: "Pour un photographe, le site web EST le portfolio. C'est l'outil indispensable pour montrer votre style, vos spécialités et convaincre les clients potentiels." },
  { slug: "traiteur", name: "Traiteur", nameShort: "Traiteur", whyWebsite: "Les clients organisent leurs événements en ligne. Un site avec vos menus, photos de prestations et formulaire de devis capte les mariages, séminaires et fêtes." },
  { slug: "coach-sportif", name: "Coach sportif", nameShort: "Coach sportif", whyWebsite: "Vos futurs clients cherchent un coach sur Google. Un site professionnel avec vos spécialités, témoignages et réservation en ligne professionnalise votre activité." },
  { slug: "wedding-planner", name: "Wedding planner", nameShort: "Wedding planner", whyWebsite: "Les futurs mariés passent des heures à comparer les prestataires en ligne. Un site inspirant avec vos mariages réalisés est votre premier argument de vente." },
  { slug: "professeur-particulier", name: "Professeur particulier", nameShort: "Prof particulier", whyWebsite: "Les parents cherchent des professeurs de confiance en ligne. Un site avec votre parcours, vos matières et les avis de parents rassure et génère des inscriptions." },
  { slug: "osteopathe", name: "Ostéopathe", nameShort: "Ostéopathe", whyWebsite: "Les patients recherchent un ostéopathe proche de chez eux sur Google. Un site avec vos spécialités, horaires et prise de rendez-vous en ligne remplit votre agenda." },
  { slug: "psychologue", name: "Psychologue", nameShort: "Psychologue", whyWebsite: "Le premier contact avec un psychologue se fait souvent en ligne. Un site rassurant avec votre approche thérapeutique lève les freins." },
  { slug: "dieteticien", name: "Diététicien", nameShort: "Diététicien", whyWebsite: "La nutrition est un sujet de recherche très populaire en ligne. Un site avec des conseils, votre méthode et des témoignages de patients attire naturellement des consultations." },
  { slug: "sophrologue", name: "Sophrologue", nameShort: "Sophrologue", whyWebsite: "La sophrologie gagne en popularité. Un site clair expliquant vos séances, tarifs et bienfaits aide les personnes curieuses à franchir le pas." },
  { slug: "naturopathe", name: "Naturopathe", nameShort: "Naturopathe", whyWebsite: "Les patients de médecines douces font beaucoup de recherches avant de choisir un praticien. Un site détaillant votre approche et vos formations inspire confiance." },
  { slug: "boulanger-patissier", name: "Boulanger-pâtissier", nameShort: "Boulanger", whyWebsite: "Un site avec vos créations, horaires et adresse attire les clients du quartier. La commande en ligne ouvre un nouveau canal de vente." },
  { slug: "fleuriste", name: "Fleuriste", nameShort: "Fleuriste", whyWebsite: "Les achats de fleurs se font de plus en plus en ligne. Un site e-commerce avec livraison locale vous permet de toucher une clientèle bien au-delà de votre vitrine." },
  { slug: "restaurateur", name: "Restaurateur", nameShort: "Restaurateur", whyWebsite: "Vos clients consultent votre menu en ligne avant de réserver. Un site avec carte, photos des plats et réservation en ligne augmente votre taux de remplissage." },
  { slug: "consultant", name: "Consultant", nameShort: "Consultant", whyWebsite: "Votre expertise doit être visible. Un site avec vos domaines d'intervention, études de cas et témoignages clients positionne votre crédibilité dès le premier contact." },
  { slug: "expert-comptable", name: "Expert-comptable", nameShort: "Expert-comptable", whyWebsite: "Les créateurs d'entreprise cherchent un expert-comptable en ligne. Un site clair avec vos services, tarifs et avis Google vous différencie des grands cabinets." },
  { slug: "avocat", name: "Avocat", nameShort: "Avocat", whyWebsite: "Les justiciables cherchent un avocat spécialisé sur Google. Un site présentant vos domaines de compétence inspire confiance et génère des consultations." },
  { slug: "architecte", name: "Architecte", nameShort: "Architecte", whyWebsite: "Votre portfolio est votre carte de visite. Un site avec vos projets réalisés séduit les futurs maîtres d'ouvrage." },
  { slug: "decorateur-interieur", name: "Décorateur d'intérieur", nameShort: "Décorateur", whyWebsite: "L'inspiration visuelle est clé dans votre métier. Un site avec des photos avant/après de vos projets transforme les curieux en clients." },
  { slug: "graphiste", name: "Graphiste", nameShort: "Graphiste", whyWebsite: "Un graphiste sans site web, c'est un cordonnier mal chaussé. Votre portfolio en ligne est la preuve directe de vos compétences créatives." },
  { slug: "developpeur-web", name: "Développeur web", nameShort: "Développeur", whyWebsite: "Votre site est votre vitrine technique. Il démontre vos compétences, présente vos projets et génère des demandes de missions freelance." },
  { slug: "community-manager", name: "Community manager", nameShort: "Community manager", whyWebsite: "Un CM qui n'a pas de site web perd en crédibilité. Votre site présente vos résultats chiffrés, vos clients et vos offres de manière professionnelle." },
  { slug: "agent-immobilier", name: "Agent immobilier", nameShort: "Agent immobilier", whyWebsite: "Un site personnel avec vos biens et vos avis clients vous différencie des grandes agences et crée une relation de proximité." },
  { slug: "diagnostiqueur-immobilier", name: "Diagnostiqueur immobilier", nameShort: "Diagnostiqueur", whyWebsite: "Les propriétaires cherchent un diagnostiqueur rapidement en ligne. Un site avec vos certifications, tarifs et disponibilités capte les demandes urgentes." },
  { slug: "chauffeur-vtc", name: "Chauffeur VTC", nameShort: "Chauffeur VTC", whyWebsite: "Un site avec réservation en ligne et tarifs vous permet de fidéliser votre clientèle sans passer par les plateformes qui prennent 25% de commission." },
  { slug: "demenageur", name: "Déménageur", nameShort: "Déménageur", whyWebsite: "Les devis de déménagement se demandent en ligne. Un site avec un formulaire de devis rapide, vos tarifs et avis clients vous place devant la concurrence." },
];

function getCreationMeta(slug, nameShort) {
  const map = {
    "paris-1er": { title: "Création site web Paris 1er - Louvre & Les Halles", description: "Agence web Paris 1er (Louvre, Châtelet, Les Halles). Site pro pour TPE et artisans. SEO local inclus. Devis gratuit.", h1: "Création de site web Paris 1er - Louvre, Châtelet, Les Halles" },
    "paris-2eme": { title: "Création site web Paris 2ème - Sentier & Bourse", description: "Agence web Paris 2ème (Sentier, Bourse, Grands Boulevards). Site pro pour startups et TPE. SEO local inclus. Devis gratuit.", h1: "Création de site web Paris 2ème - Sentier, Bourse, Grands Boulevards" },
    "paris-3eme": { title: "Création site web Paris 3ème - Le Marais & Temple", description: "Agence web Paris 3ème (Marais, Temple). Site élégant pour artisans et TPE. SEO local inclus. Devis gratuit.", h1: "Création de site web Paris 3ème - Marais, Temple" },
    "paris-4eme": { title: "Création site web Paris 4ème - Hôtel de Ville", description: "Agence web Paris 4ème (Hôtel de Ville, Île de la Cité). Site pro pour TPE. Devis gratuit.", h1: "Création de site web Paris 4ème - Hôtel de Ville, Île de la Cité" },
    "paris-5eme": { title: "Création site web Paris 5ème - Quartier Latin", description: "Agence web Paris 5ème (Quartier Latin, Panthéon). Site pro pour TPE. SEO local inclus. Devis gratuit.", h1: "Création de site web Paris 5ème - Quartier Latin, Panthéon" },
    "paris-6eme": { title: "Création site web Paris 6ème - Saint-Germain", description: "Agence web Paris 6ème (Saint-Germain, Odéon, Luxembourg). Site haut de gamme. Devis gratuit.", h1: "Création de site web Paris 6ème - Saint-Germain-des-Prés, Odéon" },
    "paris-7eme": { title: "Création site web Paris 7ème - Tour Eiffel", description: "Agence web Paris 7ème (Tour Eiffel, Invalides). Site premium pour TPE. Devis gratuit.", h1: "Création de site web Paris 7ème - Tour Eiffel, Invalides" },
    "paris-8eme": { title: "Création site web Paris 8ème - Champs-Élysées", description: "Agence web Paris 8ème (Champs-Élysées, Madeleine). Site premium pour TPE. Devis gratuit.", h1: "Création de site web Paris 8ème - Champs-Élysées, Madeleine" },
    "paris-9eme": { title: "Création site web Paris 9ème - Opéra & Grands Boulevards", description: "Agence web Paris 9ème (Opéra, Grands Boulevards, Trinité). Site pro pour TPE. SEO local inclus. Devis gratuit.", h1: "Création de site web Paris 9ème - Opéra, Grands Boulevards, Trinité" },
    "paris-10eme": { title: "Création site web Paris 10ème - Canal Saint-Martin", description: "Agence web Paris 10ème (Canal Saint-Martin, Gare du Nord). Site moderne pour TPE. Devis gratuit.", h1: "Création de site web Paris 10ème - Canal Saint-Martin, Gare du Nord" },
    "paris-11eme": { title: "Création site web Paris 11ème - Bastille & Oberkampf", description: "Agence web Paris 11ème (Bastille, Oberkampf). Site percutant pour commerces et TPE. Devis gratuit.", h1: "Création de site web Paris 11ème - Bastille, Oberkampf, Charonne" },
    "paris-12eme": { title: "Création site web Paris 12ème - Bercy & Nation", description: "Agence web Paris 12ème (Bercy, Nation, Gare de Lyon). Site pro pour TPE. Devis gratuit.", h1: "Création de site web Paris 12ème - Bercy, Nation, Gare de Lyon" },
    "paris-13eme": { title: "Création site web Paris 13ème - Place d'Italie", description: "Agence web Paris 13ème (Place d'Italie, Bibliothèque). Site moderne pour TPE. Devis gratuit.", h1: "Création de site web Paris 13ème - Place d'Italie, Bibliothèque" },
    "paris-14eme": { title: "Création site web Paris 14ème - Montparnasse", description: "Agence web Paris 14ème (Montparnasse, Alésia). Site pro pour TPE. Devis gratuit.", h1: "Création de site web Paris 14ème - Montparnasse, Alésia, Denfert" },
    "paris-15eme": { title: "Création site web Paris 15ème - Convention & Vaugirard", description: "Agence web Paris 15ème. 230 000 habitants. SEO local inclus. Devis gratuit.", h1: "Création de site web Paris 15ème - Convention, Vaugirard, Cambronne" },
    "paris-16eme": { title: "Création site web Paris 16ème - Trocadéro & Passy", description: "Agence web Paris 16ème (Trocadéro, Passy, Auteuil). Site haut de gamme. Devis gratuit.", h1: "Création de site web Paris 16ème - Trocadéro, Passy, Auteuil" },
    "paris-17eme": { title: "Création site web Paris 17ème - Batignolles & Ternes", description: "Agence web Paris 17ème (Batignolles, Ternes). Site moderne pour TPE. Devis gratuit.", h1: "Création de site web Paris 17ème - Batignolles, Ternes, Monceau" },
    "paris-18eme": { title: "Création site web Paris 18ème - Montmartre", description: "Agence web Paris 18ème (Montmartre, Abbesses). Site pro pour TPE. Devis gratuit.", h1: "Création de site web Paris 18ème - Montmartre, Abbesses" },
    "paris-19eme": { title: "Création site web Paris 19ème - Buttes-Chaumont", description: "Agence web Paris 19ème (Buttes-Chaumont, Villette). Site pro pour TPE. Devis gratuit.", h1: "Création de site web Paris 19ème - Buttes-Chaumont, Villette" },
    "paris-20eme": { title: "Création site web Paris 20ème - Belleville", description: "Agence web Paris 20ème (Belleville, Ménilmontant). Site créatif pour TPE. Devis gratuit.", h1: "Création de site web Paris 20ème - Belleville, Ménilmontant" },
    "boulogne-billancourt": { title: "Création site web Boulogne-Billancourt | Déclic", description: "Agence web Boulogne-Billancourt (92100). 1ère ville du 92. SEO local inclus. Devis gratuit.", h1: "Création de site web Boulogne-Billancourt - 1ère ville des Hauts-de-Seine" },
    "nanterre": { title: "Création site web Nanterre - Porte de La Défense", description: "Agence web Nanterre (92000). Préfecture du 92. SEO local inclus. Devis gratuit.", h1: "Création de site web Nanterre - Préfecture du 92, porte de La Défense" },
    "asnieres-sur-seine": { title: "Création site web Asnières-sur-Seine | Déclic", description: "Agence web Asnières-sur-Seine (92600). Ligne 13, 10 min de Paris. SEO et GEO inclus. Devis gratuit.", h1: "Création de site web Asnières-sur-Seine - Hauts-de-Seine (92)" },
    "levallois-perret": { title: "Création site web Levallois-Perret | Déclic", description: "Agence web Levallois-Perret (92300). Ville la plus dense de France. Devis gratuit.", h1: "Création de site web Levallois-Perret - Ville la plus dense de France" },
    "neuilly-sur-seine": { title: "Création site web Neuilly-sur-Seine | Déclic", description: "Agence web Neuilly-sur-Seine (92200). Site haut de gamme pour TPE. Devis gratuit.", h1: "Création de site web Neuilly-sur-Seine - Site premium pour le 92" },
    "issy-les-moulineaux": { title: "Création site web Issy-les-Moulineaux | Déclic", description: "Agence web Issy-les-Moulineaux (92130). Ville la plus connectée de France. Devis gratuit.", h1: "Création de site web Issy-les-Moulineaux - Ville digitale du 92" },
    "courbevoie": { title: "Création site web Courbevoie - La Défense", description: "Agence web Courbevoie (92400). Au pied de La Défense. SEO local inclus. Devis gratuit.", h1: "Création de site web Courbevoie - Au pied de La Défense" },
    "colombes": { title: "Création site web Colombes | Déclic Digital 92", description: "Agence web Colombes (92700). 1ère ville du nord du 92. SEO local inclus. Devis gratuit.", h1: "Création de site web Colombes - 1ère ville du nord du 92" },
    "rueil-malmaison": { title: "Création site web Rueil-Malmaison | Déclic", description: "Agence web Rueil-Malmaison (92500). Ville verte du 92. Devis gratuit.", h1: "Création de site web Rueil-Malmaison - Ville verte du 92" },
  };
  return map[slug] ?? {
    title: `Création site web ${nameShort} | Déclic Digital`,
    description: `Agence web ${nameShort}. Site professionnel pour TPE et artisans. SEO local inclus. Devis gratuit.`,
    h1: `Création de site web à ${nameShort} - TPE et artisans`,
  };
}

function getSeoMeta(slug, nameShort) {
  const map = {
    "paris-9eme": { title: "SEO local Paris 9ème - Opéra & Grands Boulevards", description: "Référencement naturel Paris 9ème (Opéra, Grands Boulevards, Trinité). Audit SEO offert.", h1: "Référencement SEO local Paris 9ème - Opéra, Grands Boulevards, Trinité" },
    "boulogne-billancourt": { title: "SEO local Boulogne-Billancourt | Déclic 92", description: "Référencement Google Boulogne-Billancourt (92100). 120 000 habitants. Audit gratuit.", h1: "Référencement SEO local Boulogne-Billancourt - 1ère ville des Hauts-de-Seine" },
    "nanterre": { title: "SEO local Nanterre - Préfecture du 92 | Déclic", description: "Référencement Google Nanterre (92000). Aux portes de La Défense. Audit SEO gratuit.", h1: "Référencement SEO local Nanterre - Préfecture du 92, porte de La Défense" },
    "asnieres-sur-seine": { title: "Agence SEO Asnières-sur-Seine | Déclic Digital", description: "Référencement naturel et GEO à Asnières-sur-Seine (92600). Résultats en 3 à 6 mois. Audit SEO offert.", h1: "Référencement SEO et GEO Asnières-sur-Seine - Hauts-de-Seine (92)" },
    "levallois-perret": { title: "SEO local Levallois-Perret | Déclic Digital 92", description: "Référencement Google Levallois-Perret (92300). Ville la plus dense de France. Audit SEO gratuit.", h1: "Référencement SEO local Levallois-Perret" },
    "neuilly-sur-seine": { title: "SEO local Neuilly-sur-Seine | Déclic Digital", description: "Référencement Google Neuilly-sur-Seine (92200). Clientèle premium. Audit gratuit.", h1: "Référencement SEO local Neuilly-sur-Seine" },
    "issy-les-moulineaux": { title: "SEO local Issy-les-Moulineaux | Déclic Digital", description: "Référencement Google Issy-les-Moulineaux (92130). Ville digitale du 92. Audit SEO gratuit.", h1: "Référencement SEO local Issy-les-Moulineaux" },
  };
  return map[slug] ?? {
    title: `SEO local ${nameShort} | Déclic Digital`,
    description: `Référencement Google ${nameShort}. Déclic Digital booste la visibilité des TPE et artisans. Audit SEO gratuit.`,
    h1: `Référencement SEO local ${nameShort} - Hauts-de-Seine`,
  };
}

async function seed() {
  const rows = [];

  for (const city of cities) {
    const { slug, nameShort, description } = city;
    const cm = getCreationMeta(slug, nameShort);
    rows.push({
      page_key: `creation/${slug}`,
      page_type: "ville_creation",
      page_label: nameShort,
      page_url: `/creation-site-web/${slug}`,
      seo_title: cm.title,
      seo_description: cm.description,
      seo_h1: cm.h1,
      hero_intro: `Déclic Digital crée votre site web professionnel ${description}. Design soigné, SEO local inclus, livré en 2 à 3 semaines.`,
      sections: [],
      is_published: true,
    });

    const sm = getSeoMeta(slug, nameShort);
    rows.push({
      page_key: `seo/${slug}`,
      page_type: "ville_seo",
      page_label: nameShort,
      page_url: `/referencement-seo/${slug}`,
      seo_title: sm.title,
      seo_description: sm.description,
      seo_h1: sm.h1,
      hero_intro: `Déclic Digital optimise le référencement naturel des TPE et indépendants ${description}. Audit SEO gratuit, résultats mesurables en 3 à 6 mois.`,
      sections: [],
      is_published: true,
    });
  }

  for (const trade of trades) {
    rows.push({
      page_key: `metier/${trade.slug}`,
      page_type: "metier",
      page_label: trade.nameShort,
      page_url: `/creation-site-web/metier/${trade.slug}`,
      seo_title: `Création site internet ${trade.nameShort} | Déclic Digital Paris`,
      seo_description: `Création de site web pro pour ${trade.name.toLowerCase()}. ${trade.whyWebsite.slice(0, 100)}. Devis gratuit en 24h.`,
      seo_h1: `Création de site internet pour ${trade.name.toLowerCase()} : attirez plus de clients`,
      hero_intro: trade.whyWebsite,
      sections: [],
      is_published: true,
    });
  }

  console.log(`\n📋 ${rows.length} pages à insérer...\n`);
  let success = 0;

  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase.from("page_overrides").upsert(batch, { onConflict: "page_key" });
    if (error) {
      console.error(`❌ Erreur batch ${i + 1}-${i + batch.length}:`, error.message);
    } else {
      success += batch.length;
      console.log(`✅ Batch ${i + 1}-${i + batch.length} OK`);
    }
  }

  console.log(`\n🎉 ${success}/${rows.length} pages insérées. Va sur /admin/pages pour vérifier.`);
}

seed();
