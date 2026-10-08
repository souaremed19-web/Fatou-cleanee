/**
 * Informations Officielles de Contact et Réseau d'Agences - Fatou's Clean
 * Sièges & Bureaux : Conakry (Siège Principal), Kindia (Foulayah) et Mamou (Gare Voiture)
 */

export interface OfficeLocation {
  id: 'conakry' | 'kindia' | 'mamou';
  city: string;
  name: string;
  type: 'Siège Principal' | 'Siège Régional' | 'Agence Régionale';
  isHQ: boolean;
  address: string;
  landmark: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsappUrl: string;
  hours: string;
  internalOfficeImage: string;
  description: string;
  features: string[];
}

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: 'conakry',
    city: 'Conakry',
    name: "Siège Principal National · Conakry",
    type: 'Siège Principal',
    isHQ: true,
    address: 'Simbaya Gare, Commune de Ratoma',
    landmark: 'À côté de la Pharmacie LE SION en face de la Cantine',
    phone: '+224 623 07 82 50',
    phoneRaw: '+224623078250',
    email: 'info@fatous-cleaner.net',
    whatsappUrl: 'https://wa.me/224623078250?text=Bonjour%20Fatou%27s%20Clean%20Conakry,%20je%20souhaite%20r%C3%A9server%20une%20prestation',
    hours: 'Lun - Dim : 07h30 - 21h00 (7j/7)',
    internalOfficeImage: '/src/assets/images/bureau_conakry_interne_1791377318655.jpg',
    description: "Direction générale, centre d'appel VIP, accueil clientèle et base technique principale pour tout le Grand Conakry (Kaloum, Dixinn, Ratoma, Matam).",
    features: [
      'Accueil clientèle & devis instantanés',
      'Plateforme logistique matériel lourd (injecteurs-extracteurs, monobrosses)',
      'Équipes d\'intervention rapide 7j/7'
    ]
  },
  {
    id: 'kindia',
    city: 'Kindia',
    name: "Siège Régional Kindia · Foulayah",
    type: 'Siège Régional',
    isHQ: false,
    address: 'Foulayah, Kindia',
    landmark: 'Précisément à Foulayah, axe principal',
    phone: '+224 623 07 82 50',
    phoneRaw: '+224623078250',
    email: 'kindia@fatous-cleaner.net',
    whatsappUrl: 'https://wa.me/224623078250?text=Bonjour%20Fatou%27s%20Clean%20Kindia%20(Foulayah),%20je%20souhaite%20r%C3%A9server%20une%20prestation',
    hours: 'Lun - Sam : 08h00 - 19h00',
    internalOfficeImage: '/src/assets/images/bureau_kindia_interne_1791377335624.jpg',
    description: "Centre régional stratégique situé précisément à Foulayah pour la couverture de Kindia-ville, des concessions agricoles, complexes hôteliers et résidences privées.",
    features: [
      'Bureau de coordination et réception clients Foulayah',
      'Stock permanent de produits éco-responsables certifiés',
      'Interventions résidentielles et bureaux sur toute la région de Kindia'
    ]
  },
  {
    id: 'mamou',
    city: 'Mamou',
    name: "Agence Régionale Mamou · Gare Voiture",
    type: 'Agence Régionale',
    isHQ: false,
    address: 'Près de la Gare Voiture, Mamou',
    landmark: 'Auprès de la gare voiture (gare routière de Mamou)',
    phone: '+224 623 07 82 50',
    phoneRaw: '+224623078250',
    email: 'mamou@fatous-cleaner.net',
    whatsappUrl: 'https://wa.me/224623078250?text=Bonjour%20Fatou%27s%20Clean%20Mamou%20(Gare%20Voiture),%20je%20souhaite%20r%C3%A9server%20une%20prestation',
    hours: 'Lun - Sam : 08h00 - 18h30',
    internalOfficeImage: '/src/assets/images/bureau_mamou_interne_1791377349637.jpg',
    description: "Agence carrefour idéalement implantée auprès de la gare voiture pour une disponibilité maximale, la gestion des commerces, hôtels et résidences de Mamou.",
    features: [
      'Guichet d\'accueil usagers & réservations directes à la gare voiture',
      'Équipes mobiles pour interventions en ville et périphérie',
      'Service express décontamination et fin de chantier'
    ]
  }
];

export const COMPANY_INFO = {
  name: "Fatou's Clean",
  tagline: "Nettoyage Professionnel & Conciergerie de Standing",
  phone: "+224 623 07 82 50",
  phoneRaw: "+224623078250",
  email: "info@fatous-cleaner.net",
  address: "Simbaya Gare à côté de la Pharmacie LE SION en face de la Cantine",
  city: "Conakry",
  country: "Guinée 🇬🇳",
  fullAddress: "Simbaya Gare à côté de la Pharmacie LE SION en face de la Cantine, Conakry, Guinée",
  whatsappUrl: "https://wa.me/224623078250?text=Bonjour%20Fatou%27s%20Clean,%20je%20souhaite%20r%C3%A9server%20une%20prestation%20de%20nettoyage",
  offices: OFFICE_LOCATIONS
};
