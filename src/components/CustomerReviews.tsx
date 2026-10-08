import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  MapPin, 
  ThumbsUp, 
  Camera, 
  Sparkles, 
  Plus, 
  X, 
  ZoomIn, 
  MessageSquare, 
  Calendar, 
  Edit3,
  ShieldCheck,
  Upload
} from 'lucide-react';

export interface CustomerReviewItem {
  id: string;
  clientName: string;
  clientRole: string; // ex: "Propriétaire de Villa", "Directrice Générale", "Hôte Airbnb"
  location: string;   // ex: "Kipé, Conakry", "Kaloum", "Simbaya Gare"
  avatarUrl?: string;
  rating: number;     // 1 to 5
  date: string;
  serviceTag: string; // ex: "Grand Nettoyage Approfondi", "Entretien Bureaux", "Shampouinage Canapé"
  category: 'all' | 'villas' | 'bureaux' | 'canapes' | 'vitrerie' | 'airbnb';
  comment: string;
  explanatoryImage: string;
  explanatoryCaption: string; // "Explication détaillée de la photo"
  interventionDetails: {
    duree: string;
    materiel: string;
    resultat: string;
  };
  likes: number;
}

export const INITIAL_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'rev-1',
    clientName: 'Mamadou Bailo Barry',
    clientRole: 'Propriétaire Résidence Privée',
    location: 'Kipé Centre, Conakry',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 3 jours',
    serviceTag: 'Shampouinage Canapé & Tapis',
    category: 'canapes',
    comment: "Mon salon en velours beige avait plusieurs taches incrustées après une réception de mariage. L'équipe de Fatou's Cleaner est intervenue avec leur machine d'injection-extraction. En 2h30, le canapé a retrouvé sa couleur d'origine sans aucune odeur d'humidité. Ponctualité exemplaire à Conakry !",
    explanatoryImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    explanatoryCaption: "📸 Rénovation en profondeur du velours : élimination totale des auréoles et poussières incrustées par injection-extraction haute pression.",
    interventionDetails: {
      duree: '2h30',
      materiel: 'Injecteur-extracteur professionnel & shampoing textile neutre',
      resultat: 'Tissu 100% assaini, fibres ravivées et séchage rapide'
    },
    likes: 19
  },
  {
    id: 'rev-2',
    clientName: 'Aïssatou Diallo',
    clientRole: 'Gérante de Société d\'Import-Export',
    location: 'Kaloum (Centre d\'Affaires), Conakry',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 1 semaine',
    serviceTag: 'Nettoyage Bureaux & Locaux Pro',
    category: 'bureaux',
    comment: "Nous avons confié l'entretien régulier de nos bureaux de 250 m² à Kaloum à Fatou's Cleaner. Le contrat est respecté au millimètre près : désinfection des claviers et bureaux, sols éclatants et vitres transparentes. Le devis en GNF était très clair et sans surprise. Je recommande les yeux fermés.",
    explanatoryImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    explanatoryCaption: "📸 Espace open-space et salles de réunion : lustrage des revêtements de sol, désinfection vapeur des postes et dépoussiérage des climatiseurs.",
    interventionDetails: {
      duree: 'Intervention hebdomadaire (3h)',
      materiel: 'Monobrosse, microfibres codées couleur & désinfectant norme EN',
      resultat: 'Environnement de travail sain pour 25 collaborateurs'
    },
    likes: 34
  },
  {
    id: 'rev-3',
    clientName: 'Dr. Ibrahima Sory Camara',
    clientRole: 'Chirurgien-Dentiste',
    location: 'Simbaya Gare (près Pharmacie LE SION), Conakry',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 2 semaines',
    serviceTag: 'Grand Nettoyage Approfondi',
    category: 'villas',
    comment: "Étant voisin direct du siège à Simbaya Gare, j'ai sollicité Fatou's Cleaner pour une grande concession familiale après des travaux de réaménagement. La faïence des cuisines, les hottes et les sanitaires ont été décapés avec une précision chirurgicale. Une équipe polie et très respectueuse des lieux.",
    explanatoryImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    explanatoryCaption: "📸 Dégraissage chirurgical de la cuisine : décapage des plaques, intérieur du four, crédence et polissage du plan de travail en granit.",
    interventionDetails: {
      duree: '5h d\'intervention continue (équipe de 3)',
      materiel: 'Générateur vapeur 140°C & dégraissant alcalin éco-certifié',
      resultat: 'Zéro résidu gras, hygiène bactérienne totale'
    },
    likes: 27
  },
  {
    id: 'rev-4',
    clientName: 'Nathalie Gomez & Thierno',
    clientRole: 'Superhosts Airbnb (4 appartements)',
    location: 'Camayenne & Dixinn, Conakry',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 3 semaines',
    serviceTag: 'Conciergerie & Rotations Airbnb',
    category: 'airbnb',
    comment: "La gestion du ménage entre deux voyageurs Airbnb était notre plus grand stress. Fatou's Cleaner gère désormais les rotations clés en main : blanchisserie du linge de lit, pliage hôtel 5 étoiles, nettoyage des salles d'eau et réapprovisionnement. Nos notes sur Airbnb sont passées à 4.98 étoiles !",
    explanatoryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    explanatoryCaption: "📸 Préparation VIP de suite résidentielle : literie blanche repassée, miroirs anti-traces et mise en place des consommables d'accueil.",
    interventionDetails: {
      duree: 'Rotation express 2h30',
      materiel: 'Kit hôtelier complet, aspirateur HEPA & vapeur assainissante',
      resultat: 'Validation conforme aux standards Superhost Airbnb'
    },
    likes: 42
  },
  {
    id: 'rev-5',
    clientName: 'Sekou Oumar Keita',
    clientRole: 'Architecte d\'Intérieur',
    location: 'Lambanyi & Nongo, Conakry',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 1 mois',
    serviceTag: 'Vitrerie & Baies Vitrées',
    category: 'vitrerie',
    comment: "Sur mes chantiers de rénovation de villas à Lambanyi, les grandes baies vitrées de 4 mètres de haut nécessitent un savoir-faire spécifique. Leurs agents utilisent la raclette professionnelle et des produits déperlants qui résistent à la poussière de Conakry. Résultat d'une clarté bluffante.",
    explanatoryImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    explanatoryCaption: "📸 Lavage des baies vitrées et châssis aluminium : suppression des traces de calcaire et film protecteur anti-poussière durable.",
    interventionDetails: {
      duree: '3h pour 45 m² de surface vitrée',
      materiel: 'Perches télescopiques, mouilleurs microfibres & raclettes Unger',
      resultat: 'Transparence absolue sans micro-rayures'
    },
    likes: 21
  },
  {
    id: 'rev-6',
    clientName: 'Fatoumata Binta Soumah',
    clientRole: 'Résidente Particulière',
    location: 'Ratoma, Conakry',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 1 mois',
    serviceTag: 'Détartrage & Salles d\'Eau Marbre',
    category: 'villas',
    comment: "La douche à l'italienne et la vasque en marbre avaient des traces blanches de calcaire tenaces. Le technicien a utilisé un traitement non agressif qui a fait briller la pierre naturelle sans l'abîmer. Le suivi sur WhatsApp avec le devis préalable est super pratique.",
    explanatoryImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    explanatoryCaption: "📸 Restauration de salle de bain haut de gamme : élimination du tartre sur la robinetterie chromée et polissage doux de la faïence.",
    interventionDetails: {
      duree: '2h',
      materiel: 'Détartrant acide citrique bio & pads micro-abrasifs non rayants',
      resultat: 'Brillance miroir et protection hydrofuge'
    },
    likes: 18
  }
];

interface CustomerReviewsProps {
  onOpenBooking: () => void;
  currency: 'EUR' | 'GNF';
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ onOpenBooking, currency }) => {
  const [reviews, setReviews] = useState<CustomerReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('fatous_cleaner_customer_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_REVIEWS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeImageZoom, setActiveImageZoom] = useState<CustomerReviewItem | null>(null);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Review submission form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('Résident Particulier');
  const [newLocation, setNewLocation] = useState('Kipé, Conakry');
  const [newRating, setNewRating] = useState(5);
  const [newServiceTag, setNewServiceTag] = useState('Grand Nettoyage Approfondi');
  const [newCategory, setNewCategory] = useState<'villas' | 'bureaux' | 'canapes' | 'vitrerie' | 'airbnb'>('villas');
  const [newComment, setNewComment] = useState('');
  const [newExplanatoryImage, setNewExplanatoryImage] = useState(
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
  );
  const [newExplanatoryCaption, setNewExplanatoryCaption] = useState(
    '📸 Photo explicative : Remise à neuf et désinfection complète réalisée par Fatou\'s Cleaner.'
  );

  const handleLike = (id: string) => {
    if (likedReviews[id]) return;
    setLikedReviews(prev => ({ ...prev, [id]: true }));
    setReviews(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r);
      try {
        localStorage.setItem('fatous_cleaner_customer_reviews', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewExplanatoryImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newReview: CustomerReviewItem = {
      id: `rev-${Date.now()}`,
      clientName: newAuthor.trim(),
      clientRole: newRole.trim(),
      location: newLocation.trim(),
      rating: newRating,
      date: "Aujourd'hui",
      serviceTag: newServiceTag,
      category: newCategory,
      comment: newComment.trim(),
      explanatoryImage: newExplanatoryImage,
      explanatoryCaption: newExplanatoryCaption.trim(),
      interventionDetails: {
        duree: '3h',
        materiel: 'Équipement de pointe Fatou\'s Clean & produits certifiés',
        resultat: 'Propreté certifiée conforme aux normes d\'hygiène'
      },
      likes: 1
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    try {
      localStorage.setItem('fatous_cleaner_customer_reviews', JSON.stringify(updatedReviews));
    } catch (e) {}

    // Reset and close
    setNewAuthor('');
    setNewComment('');
    setIsAddReviewModalOpen(false);
  };

  const filteredReviews = activeCategory === 'all'
    ? reviews
    : reviews.filter(r => r.category === activeCategory);

  return (
    <section id="avis-clients" className="py-20 bg-white text-slate-900 relative border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[#064e3b] text-xs font-bold mb-3 border border-emerald-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Témoignages & Preuves en Images · Fatou's Clean</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#064e3b]">
            Avis Clients & Résultats en Images
          </h2>

          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Découvrez les retours authentiques de nos clients à Conakry, accompagnés des photos explicatives de chaque intervention réalisée par notre équipe.
          </p>

          {/* Trust Score Banner Vert & Blanc */}
          <div className="mt-7 p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#16a34a] text-white flex flex-col items-center justify-center font-black shadow-md shadow-emerald-600/20">
                <span className="text-xl leading-none">4.9</span>
                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-tighter">/ 5</span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-[#064e3b] ml-1.5">Note d'Excellence</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Basé sur <strong className="text-[#064e3b]">140+ interventions certifiées</strong> à Conakry 🇬🇳
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddReviewModalOpen(true)}
              className="px-4.5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Laisser un avis client</span>
            </button>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
            {[
              { id: 'all', label: 'Tous les avis (avec photos)' },
              { id: 'villas', label: 'Villas & Résidences' },
              { id: 'bureaux', label: 'Bureaux Kaloum' },
              { id: 'canapes', label: 'Canapés & Tapis' },
              { id: 'vitrerie', label: 'Vitrerie & Baies' },
              { id: 'airbnb', label: 'Conciergerie Airbnb' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#16a34a] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:text-[#064e3b] border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-emerald-300"
            >
              {/* Green Top Border */}
              <div className="h-1.5 w-full bg-[#16a34a]" />

              {/* Explanatory Image Header with Live Zoom Button */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900 select-none group/img">
                <img 
                  src={item.explanatoryImage} 
                  alt={item.explanatoryCaption}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Prestation tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#16a34a] text-white shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-200" />
                    <span>{item.serviceTag}</span>
                  </span>
                </div>

                {/* Zoom button on hover */}
                <button
                  type="button"
                  onClick={() => setActiveImageZoom(item)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-[#064e3b] shadow-md backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                  title="Agrandir la photo explicative"
                >
                  <ZoomIn className="w-4 h-4 text-[#16a34a]" />
                </button>

                {/* Overlay Caption (Explanatory text directly on the photo) */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] font-medium leading-snug line-clamp-2 bg-slate-950/75 backdrop-blur-md p-2 rounded-xl border border-white/10 text-emerald-100">
                    {item.explanatoryCaption}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Client Profile Header */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-3">
                      {item.avatarUrl ? (
                        <img 
                          src={item.avatarUrl} 
                          alt={item.clientName} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#16a34a] font-bold flex items-center justify-center text-sm">
                          {item.clientName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-[#064e3b] leading-tight">{item.clientName}</h4>
                          <span title="Client Vérifié" className="inline-flex">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{item.clientRole}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>

                  {/* Location & Rating */}
                  <div className="flex items-center justify-between py-1.5 mb-2 border-y border-slate-100 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#16a34a]" />
                      <span>{item.location}</span>
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Customer Review Quote */}
                  <div className="relative">
                    <Quote className="w-6 h-6 text-emerald-100 absolute -top-1.5 -left-1 opacity-70 pointer-events-none" />
                    <p className="text-xs text-slate-700 leading-relaxed italic relative pl-4">
                      "{item.comment}"
                    </p>
                  </div>
                </div>

                {/* Technical intervention summary box (Explication matériel & résultat) */}
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center text-[#064e3b] font-bold">
                    <span>⏱️ Durée du passage :</span>
                    <span className="font-semibold text-[#16a34a]">{item.interventionDetails.duree}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="truncate pr-1">🛠️ {item.interventionDetails.materiel}</span>
                  </div>
                </div>

                {/* Footer with Like & CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      likedReviews[item.id]
                        ? 'bg-emerald-100 text-[#16a34a]'
                        : 'text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Utile ({item.likes})</span>
                  </button>

                  <a 
                    href="#reservation"
                    className="text-[#16a34a] hover:text-[#15803d] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    Réserver ce service →
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with CTA to Book */}
        <div className="mt-14 p-6 sm:p-8 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#15803d] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Garantie 100% Satisfaction ou Repassage Gratuit</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Vous aussi, bénéficiez de l'excellence Fatou's Cleaner à Conakry
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Nos agents certifiés interviennent avec discrétion, rapidité et matériel haut de gamme dans toutes les communes de Conakry.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064e3b] font-black text-sm shadow-lg transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            Obtenir mon devis en direct →
          </button>
        </div>

      </div>

      {/* Lightbox Modal for Explanatory Image Zoom */}
      {activeImageZoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-200 flex flex-col">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#16a34a]" />
                <div>
                  <h4 className="text-sm font-extrabold text-[#064e3b]">
                    Photo d'intervention · {activeImageZoom.serviceTag}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Intervention réalisée pour {activeImageZoom.clientName} à {activeImageZoom.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveImageZoom(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Image View */}
            <div className="relative max-h-[60vh] overflow-hidden bg-slate-950 flex items-center justify-center">
              <img 
                src={activeImageZoom.explanatoryImage} 
                alt={activeImageZoom.explanatoryCaption}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {/* Explanation details below image */}
            <div className="p-6 bg-white space-y-3">
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-xs text-[#064e3b] font-semibold">
                {activeImageZoom.explanatoryCaption}
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-700">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Durée</span>
                  <span className="font-bold text-[#064e3b]">{activeImageZoom.interventionDetails.duree}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Matériel mobilisé</span>
                  <span className="font-semibold text-slate-800">{activeImageZoom.interventionDetails.materiel}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Résultat certifié</span>
                  <span className="font-semibold text-[#16a34a]">{activeImageZoom.interventionDetails.resultat}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveImageZoom(null)}
                  className="px-5 py-2 rounded-xl bg-[#16a34a] text-white text-xs font-bold hover:bg-[#15803d] transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal "Laisser un avis client avec photo explicative" */}
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-200 flex flex-col max-h-[90vh]">
            
            {/* Top Bar */}
            <div className="h-1.5 w-full bg-[#16a34a]" />
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-50/60 border-b border-emerald-100">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#16a34a]" />
                <div>
                  <h3 className="text-base font-black text-[#064e3b]">Partagez votre expérience client</h3>
                  <p className="text-xs text-slate-500">Ajoutez votre avis et votre photo explicative d'intervention</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddReviewModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateReview} className="p-6 space-y-4 overflow-y-auto">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Votre Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Thierno Barry"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Votre Statut / Titre
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Résident Particulier, Gérant, Hôte Airbnb"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Localisation à Conakry *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kipé, Simbaya Gare, Kaloum, Lambanyi"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prestation Réalisée *
                  </label>
                  <select
                    value={newServiceTag}
                    onChange={(e) => {
                      setNewServiceTag(e.target.value);
                      if (e.target.value.includes('Bureau')) setNewCategory('bureaux');
                      else if (e.target.value.includes('Airbnb')) setNewCategory('airbnb');
                      else if (e.target.value.includes('Canapé')) setNewCategory('canapes');
                      else if (e.target.value.includes('Vitres')) setNewCategory('vitrerie');
                      else setNewCategory('villas');
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                  >
                    <option value="Grand Nettoyage Approfondi">Grand Nettoyage Approfondi</option>
                    <option value="Entretien Régulier">Entretien Régulier</option>
                    <option value="Nettoyage Bureaux & Locaux Pro">Nettoyage Bureaux & Locaux Pro</option>
                    <option value="Conciergerie & Rotations Airbnb">Conciergerie & Rotations Airbnb</option>
                    <option value="Shampouinage Canapé & Tapis">Shampouinage Canapé & Tapis</option>
                    <option value="Vitrerie & Baies Vitrées">Vitrerie & Baies Vitrées</option>
                  </select>
                </div>
              </div>

              {/* Note / Étoiles */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Votre Note :
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#064e3b] ml-2">
                    {newRating} / 5 étoiles
                  </span>
                </div>
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Votre Avis Détaillé *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Décrivez le professionnalisme de l'équipe, la ponctualité, le résultat obtenu..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a] resize-none"
                />
              </div>

              {/* Explanatory Image & Caption */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#064e3b] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Photo Explicative de l'intervention</span>
                  </span>
                  <label className="text-[11px] font-bold text-[#16a34a] hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Importer fichier</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <input
                  type="url"
                  placeholder="Ou collez une URL d'image (https://...)"
                  value={newExplanatoryImage}
                  onChange={(e) => setNewExplanatoryImage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#16a34a]"
                />

                {newExplanatoryImage && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200">
                    <img 
                      src={newExplanatoryImage} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Explication de la photo (Légende descriptive) :
                  </label>
                  <input
                    type="text"
                    value={newExplanatoryCaption}
                    onChange={(e) => setNewExplanatoryCaption(e.target.value)}
                    placeholder="Ex: Dégraissage de la cuisine et polissage des carreaux..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all hover:scale-102 cursor-pointer"
                >
                  Publier mon avis avec photo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
