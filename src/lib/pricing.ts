/**
 * Moteur de calcul tarifaire pour Fatou's Cleaner
 * Calcule dynamiquement le montant en fonction de la surface, du type de prestation, des options et de la fréquence.
 */

import { ServiceDefinition, ServiceOption, ServiceType } from '../types/booking';

export const SERVICES_CATALOG: Record<ServiceType, ServiceDefinition> = {
  regular: {
    id: 'regular',
    title: 'Entretien Régulier',
    tagline: 'Maison & Appartement impeccable au quotidien',
    basePricePerM2: 1.6, // 1.60 € / m²
    minimumPrice: 65,
    description: 'Dépoussiérage méticuleux, aspiration, lavage des sols, désinfection sanitaires & cuisine.',
    features: [
      'Aspiration & lavage de tous les sols',
      'Dépoussiérage du mobilier et surfaces',
      'Nettoyage & désinfection cuisine et sanitaires',
      'Vidage des corbeilles et aération',
      'Produits éco-labellisés fournis'
    ]
  },
  deep: {
    id: 'deep',
    title: 'Grand Nettoyage Approfondi',
    tagline: 'Remise à neuf, après déménagement ou travaux',
    basePricePerM2: 2.8, // 2.80 € / m²
    minimumPrice: 120,
    description: 'Décrassage complet : plinthes, portes, intérieur de placards, faïence détartrée, vitres standards.',
    features: [
      'Tout le forfait régulier inclus',
      'Lessivage des portes, plinthes et encadrements',
      'Détartrage intensif calcaire & joints',
      'Nettoyage intérieur placards et tiroirs vides',
      'Dégraissage haute puissance cuisine'
    ]
  },
  office: {
    id: 'office',
    title: 'Bureaux & Locaux Pro',
    tagline: 'Espaces de travail sains, valorisants pour vos équipes',
    basePricePerM2: 1.9, // 1.90 € / m²
    minimumPrice: 90,
    description: 'Désinfection des postes de travail, claviers, open space, salles de réunion, sanitaires et cuisine commune.',
    features: [
      'Désinfection postes, écrans et poignées',
      'Nettoyage espace détente et machine à café',
      'Tri sélectif et évacuation des poubelles',
      'Sanitaires approvisionnés et javellisés',
      'Intervention en horaires décalés possible'
    ]
  },
  airbnb: {
    id: 'airbnb',
    title: 'Conciergerie & Airbnb',
    tagline: 'Rotation express entre voyageurs & standing 5 étoiles',
    basePricePerM2: 2.2, // 2.20 € / m²
    minimumPrice: 85,
    description: 'Nettoyage complet entre deux séjours, changement de literie, réapprovisionnement des consommables et rapport photo.',
    features: [
      'Nettoyage et désinfection express en 3h',
      'Changement draps & mise en place serviettes',
      'Contrôle de l’état général & signalement casse',
      'Vérification kit d’accueil (café, savon)',
      'Rapport d’inspection avec photos'
    ]
  }
};

export const PRICING_OPTIONS: ServiceOption[] = [
  {
    id: 'windows',
    name: 'Vitres & Baies vitrées (int/ext)',
    price: 35,
    description: 'Lavage deux faces, encadrements et rails de coulisses inclus',
    icon: 'Sparkles'
  },
  {
    id: 'oven',
    name: 'Décapage Four & Micro-ondes',
    price: 30,
    description: 'Dégraissage intensif avec produits écologiques actifs',
    icon: 'Flame'
  },
  {
    id: 'fridge',
    name: 'Intérieur Réfrigérateur & Congélateur',
    price: 25,
    description: 'Désinfection alimentaire intégrale et traitement anti-odeur',
    icon: 'ThermometerSnowflake'
  },
  {
    id: 'ironing',
    name: 'Repassage & Pliage du linge (1h)',
    price: 28,
    description: 'Chemises, draps et vêtements pliés avec soin professionnel',
    icon: 'Shirt'
  },
  {
    id: 'carpet_couch',
    name: 'Shampouinage Canapé ou Tapis',
    price: 49,
    description: 'Injection-extraction en profondeur contre acariens et taches tenaces',
    icon: 'Armchair'
  },
  {
    id: 'steam_sanitization',
    name: 'Désinfection Vapeur 140°C',
    price: 39,
    description: 'Élimination 99.9% des bactéries et virus sans produit chimique nocif',
    icon: 'ShieldCheck'
  }
];

export const FREQUENCY_DISCOUNTS: Record<string, { label: string; discountPercent: number }> = {
  one_time: { label: 'Ponctuel', discountPercent: 0 },
  weekly: { label: 'Hebdomadaire (-15%)', discountPercent: 15 },
  biweekly: { label: 'Tous les 15 jours (-10%)', discountPercent: 10 },
  monthly: { label: 'Mensuel (-5%)', discountPercent: 5 }
};

export interface PriceCalculationResult {
  basePrice: number;
  serviceRatePerM2: number;
  optionsTotal: number;
  discountAmount: number;
  discountPercent: number;
  finalPrice: number;
  estimatedHours: number;
  breakdown: {
    serviceName: string;
    surface: number;
    options: { name: string; price: number }[];
  };
}

/**
 * Calculateur officiel et strict du prix
 */
export function calculateQuote(
  serviceType: ServiceType,
  surface: number,
  selectedOptionIds: string[] = [],
  frequency: string = 'one_time'
): PriceCalculationResult {
  const service = SERVICES_CATALOG[serviceType] || SERVICES_CATALOG.regular;
  const safeSurface = Math.max(15, Number(surface) || 15);

  // Prix de base surfacique
  const rawBasePrice = safeSurface * service.basePricePerM2;
  const basePrice = Math.max(service.minimumPrice, Math.round(rawBasePrice * 10) / 10);

  // Options
  const matchedOptions = PRICING_OPTIONS.filter((opt) => selectedOptionIds.includes(opt.id));
  const optionsTotal = matchedOptions.reduce((acc, opt) => acc + opt.price, 0);

  // Durée estimée en heures
  let estimatedHours = 1.5;
  if (serviceType === 'deep') {
    estimatedHours = Math.max(2.5, Math.round((safeSurface / 25) * 10) / 10);
  } else if (serviceType === 'office') {
    estimatedHours = Math.max(2.0, Math.round((safeSurface / 40) * 10) / 10);
  } else {
    estimatedHours = Math.max(2.0, Math.round((safeSurface / 35) * 10) / 10);
  }
  estimatedHours += matchedOptions.length * 0.4;
  estimatedHours = Math.round(estimatedHours * 10) / 10;

  // Remise fréquence (sur la base)
  const discountConfig = FREQUENCY_DISCOUNTS[frequency] || FREQUENCY_DISCOUNTS.one_time;
  const discountAmount = Math.round(((basePrice * discountConfig.discountPercent) / 100) * 10) / 10;

  const finalPrice = Math.round((basePrice + optionsTotal - discountAmount) * 100) / 100;

  return {
    basePrice,
    serviceRatePerM2: service.basePricePerM2,
    optionsTotal,
    discountAmount,
    discountPercent: discountConfig.discountPercent,
    finalPrice,
    estimatedHours,
    breakdown: {
      serviceName: service.title,
      surface: safeSurface,
      options: matchedOptions.map((o) => ({ name: o.name, price: o.price }))
    }
  };
}
