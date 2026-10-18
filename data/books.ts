export type BookCategory = "automne" | "noel" | "classique";

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  category: "automne" | "noel" | "classique";
  badge?: string;
  features: string[];
  amazonUrl: string;
  coverImage: string;
  interiorPreview: string[];
  accentColor: string; // Teinte d'ambiance pour le glow / backdrop
}

export const BOOKS: Book[] = [
  // --- COLLECTION AUTOMNE (PRIORITAIRE) ---
  {
    id: "automne-cozy",
    title: "Coloriages d'Automne Cozy",
    subtitle: "Motifs chaleureux, dessins simples et relaxants contre le stress",
    category: "automne",
    badge: "Coup de Cœur Cozy",
    features: ["Bold & Easy", "Anti-stress & Détente", "Crayons & Feutres"],
    amazonUrl: "https://amzn.eu/d/0aqGtST4",
    coverImage: "/books/automne-cozy.jpg",
    interiorPreview: ["/books/automne-cozy-1.jpg", "/books/automne-cozy-2.jpg"],
    accentColor: "#D97736",
  },
  {
    id: "automne-gourmand",
    title: "Automne Gourmand",
    subtitle:
      "30 illustrations cozy de pâtisseries d'automne & gâteaux citrouille",
    category: "automne",
    badge: "Gourmand & Réconfortant",
    features: [
      "30 Recettes & Pâtisseries illustrées",
      "Gros traits faciles",
      "Ambiance Hygge",
    ],
    amazonUrl: "https://amzn.eu/d/00X36baW",
    coverImage: "/books/automne-gourmand.jpg",
    interiorPreview: [
      "/books/automne-gourmand-1.jpg",
      "/books/automne-gourmand-2.jpg",
    ],
    accentColor: "#C86D3B",
  },
  {
    id: "petits-animaux-automne",
    title: "Les Petits Animaux en Automne",
    subtitle: "30 Coloriages mignons dans la forêt d'automne",
    category: "automne",
    badge: "Mignonnerie Absolue",
    features: [
      "Animaux de la forêt",
      "30 Coloriages inédits",
      "Adultes, Ados & Enfants",
    ],
    amazonUrl: "https://amzn.eu/d/0gaDYGOc",
    coverImage: "/books/petits-animaux-automne.jpg",
    interiorPreview: [
      "/books/petits-animaux-automne-1.jpg",
      "/books/petits-animaux-automne-2.jpg",
    ],
    accentColor: "#9C6644",
  },

  // --- COLLECTION NOËL (PRIORITAIRE) ---
  {
    id: "noel-capybaras",
    title: "Noël Magique des Capybaras",
    subtitle: "30 Coloriages Bold & Easy – Le Noël mignon et relaxant",
    category: "noel",
    badge: "Édition Spéciale Fêtes",
    features: [
      "Tendance Capybaras",
      "30 Illustrations Bold & Easy",
      "Esprit de fête cocooning",
    ],
    amazonUrl: "https://amzn.eu/d/05MJCUEj",
    coverImage: "/books/noel-capybaras.jpg",
    interiorPreview: [
      "/books/noel-capybaras-1.jpg",
      "/books/noel-capybaras-2.jpg",
    ],
    accentColor: "#C0392B",
  },
  {
    id: "noel-axolotls",
    title: "Le Noël Magique des Axolotls",
    subtitle:
      "Gros traits simples & épurés – Axolotls sous le sapin (Format carré 8,5x8,5 po)",
    category: "noel",
    badge: "Format Carré Idéal",
    features: [
      "Format Carré 8,5x8,5",
      "Traits épurés sans bavure",
      "Univers marin féérique",
    ],
    amazonUrl: "https://amzn.eu/d/00ZccZkD",
    coverImage: "/books/noel-axolotls.jpg",
    interiorPreview: [
      "/books/noel-axolotls-1.jpg",
      "/books/noel-axolotls-2.jpg",
    ],
    accentColor: "#E06D8C",
  },
  {
    id: "noel-dinosaures",
    title: "Noël Chez les Dinosaures",
    subtitle: "30 Coloriages jurassiques sous la neige et les guirlandes",
    category: "noel",
    badge: "Fun & Festif",
    features: [
      "30 Planches dynamiques",
      "Dinos en pulls de Noël",
      "Idéal cadeau enfant & famille",
    ],
    amazonUrl: "https://amzn.eu/d/0jk43TwB",
    coverImage: "/books/noel-dinosaures.jpg",
    interiorPreview: [
      "/books/noel-dinosaures-1.jpg",
      "/books/noel-dinosaures-2.jpg",
    ],
    accentColor: "#277455",
  },

  // --- COLLECTION INTEMPORELLE ---
  {
    id: "lolo-et-lili",
    title: "Lolo & Lili",
    subtitle: "Des animaux marins mignons à colorier",
    category: "classique",
    badge: "Douceur Océane",
    features: [
      "Animaux marins kawaii",
      "Débutants & Passionnés",
      "Détente aquatique",
    ],
    amazonUrl: "https://amzn.eu/d/04ixJGgE",
    coverImage: "/books/lolo-et-lili.jpg",
    interiorPreview: ["/books/lolo-et-lili-1.jpg", "/books/lolo-et-lili-2.jpg"],
    accentColor: "#2B7A78",
  },
];

// Enrichissement éditorial par livre (notes créatrices, palettes feutres à alcool, légendes des planches)
export const BOOK_EDITORIAL_META: Record<
  string,
  {
    editionNumber: string;
    formatLabel: string;
    paperSpec: string;
    creatorNote: string;
    palette: string[];
    pageCaptions: [string, string];
  }
> = {
  "automne-cozy": {
    editionNumber: "ÉD. 01 — SAISON DORÉE",
    formatLabel: "Format Carré 21,6 × 21,6 cm",
    paperSpec: "30 Coloriages Bold & Easy • Par CaroTine",
    creatorNote:
      "Plongez au cœur de l'Automne avec 30 coloriages chaleureux et réconfortants : chocolats chauds aux guimauves, brioches roulées à la cannelle et pancakes dorés.",
    palette: ["#D97736", "#E9A96B", "#7F4F24", "#588157", "#FFF3E0"],
    pageCaptions: [
      "Extrait Intérieur Officiel — Chocolat Chaud aux Guimauves & Bâton de Cannelle",
      "Quatrième de Couverture Officielle — Aperçu des 30 Coloriages par CaroTine",
    ],
  },
  "automne-gourmand": {
    editionNumber: "ÉD. 02 — ÉDITION CAKE DESIGN",
    formatLabel: "Format Carré 21,6 × 21,6 cm",
    paperSpec: "30 Coloriages de Cake Design • Bold & Easy",
    creatorNote:
      "30 illustrations gourmandes de cake design d'automne : layer cakes fleuris, glaçages fondants, noix dorées et baies d'hiver par CaroTine.",
    palette: ["#C86D3B", "#F4A261", "#E76F51", "#FFE6A7", "#6F4E37"],
    pageCaptions: [
      "Extrait Intérieur Officiel — Drip Cake Fleuri d'Automne",
      "Quatrième de Couverture Officielle — Les 4 Pâtisseries & Conseils Feutres",
    ],
  },
  "petits-animaux-automne": {
    editionNumber: "ÉD. 03 — FORÊT D'AUTOMNE",
    formatLabel: "Format Grand Confort • Dès 4 ans",
    paperSpec: "30 Coloriages inédits • Par CaroTine",
    creatorNote:
      "Bienvenue dans la forêt d'automne ! Pars à la rencontre du petit renard, du lapin, du hérisson, de l'écureuil et de la chouette au fil de la saison.",
    palette: ["#9C6644", "#DDA15E", "#BC6C25", "#606C38", "#FEFAE0"],
    pageCaptions: [
      "Extrait Intérieur Officiel — La Petite Chouette sous la Lune d'Automne",
      "Quatrième de Couverture Officielle — Bienvenue dans la Forêt d'Automne",
    ],
  },
  "noel-capybaras": {
    editionNumber: "ÉD. 04 — ÉDITION SPÉCIALE FÊTES",
    formatLabel: "Format Carré 21,6 × 21,6 cm",
    paperSpec: "30 Coloriages Bold & Easy • Par CaroTine",
    creatorNote:
      "Le Noël mignon et relaxant des Capybaras : sapin étoilé, capybaras en pulls tricotés, cadeaux enrubannés et chocolats chauds d'hiver.",
    palette: ["#C0392B", "#277455", "#D4A373", "#F4D35E", "#FFFDF7"],
    pageCaptions: [
      "Extrait Intérieur Officiel — Capybara Père Noël & Hotte de Jouets",
      "Quatrième de Couverture Officielle — 4 Planches de Noël & Astuce Anti-Transfert",
    ],
  },
  "noel-axolotls": {
    editionNumber: "ÉD. 05 — FÉÉRIE SOUS LE SAPIN",
    formatLabel: "Format Carré 8,5 × 8,5 po (21,6 cm)",
    paperSpec: "Gros traits simples & épurés • Par CaroTine",
    creatorNote:
      "Retrouvez d'adorables axolotls de Noël coiffés de bonnets rouges, glissant en luge coquillage ou cachés dans des boîtes cadeaux surprises.",
    palette: ["#E06D8C", "#FFB5C2", "#277455", "#70C1B3", "#FFE66D"],
    pageCaptions: [
      "Extrait Intérieur Officiel — Axolotl d'Hiver & Chocolat Viennois",
      "Quatrième de Couverture Officielle — Aperçu des 4 Planches par CaroTine",
    ],
  },
  "noel-dinosaures": {
    editionNumber: "ÉD. 06 — DINOSAURES DE NOËL",
    formatLabel: "Format Carré 21,6 × 21,6 cm",
    paperSpec: "30 Coloriages Bold & Easy • Par CaroTine",
    creatorNote:
      "30 dessins uniques et faciles à colorier : petits dinosaures coiffés d'un bonnet de Père Noël et illuminés de guirlandes sous la neige.",
    palette: ["#277455", "#C0392B", "#F4A261", "#52B788", "#E9C46A"],
    pageCaptions: [
      "Extrait Intérieur Officiel — Petit Dinosaure Sapin de Noël Étoilé",
      "Quatrième de Couverture Officielle — 30 Dessins Uniques & Faciles à Colorier",
    ],
  },
  "lolo-et-lili": {
    editionNumber: "ÉD. 07 — ÉDITION SPÉCIALE OCÉAN",
    formatLabel: "Format Grand Confort (24 × 31 cm)",
    paperSpec: "30 Coloriages • Trait épais, facile et amusant",
    creatorNote:
      "Laisse-toi guider par Lolo & Lili dans une folle aventure marine ! Mets ton masque, ton tuba et tes palmes et découvre les animaux de l'océan.",
    palette: ["#2B7A78", "#3AAFA9", "#DEF2F1", "#FF8FAB", "#FFD166"],
    pageCaptions: [
      "Extrait Intérieur Officiel — La Raie Manta Souriante & Bulles Marines",
      "Quatrième de Couverture Officielle — Les Aventures de Lolo & Lili par CaroTine",
    ],
  },
};

export const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjZGMkVDIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTQiIGZpbGw9IiNFQURFQ0YiLz48L3N2Zz4=";
