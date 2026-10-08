import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Key, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  MessageSquare
} from 'lucide-react';
import { ServiceType, BookingRecord } from '../types/booking';
import { SERVICES_CATALOG, PRICING_OPTIONS, calculateQuote } from '../lib/pricing';
import { COMPANY_INFO } from '../lib/companyInfo';
import { generateWhatsAppDirectUrl } from '../lib/whatsapp';

interface BookingFormProps {
  selectedService: ServiceType;
  setSelectedService: (s: ServiceType) => void;
  surface: number;
  setSurface: (m: number) => void;
  selectedOptions: string[];
  frequency: string;
  currency: 'EUR' | 'GNF';
  selectedCity?: string;
  onBookingSuccess: (booking: BookingRecord, whatsappUrl?: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedService,
  setSelectedService,
  surface,
  setSurface,
  selectedOptions,
  frequency,
  currency,
  selectedCity = 'Conakry',
  onBookingSuccess
}) => {
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(selectedCity);
  const [postalCode, setPostalCode] = useState('Simbaya Gare');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09h00 - 13h00');
  const [accessInstructions, setAccessInstructions] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedCity) {
      setCity(selectedCity);
      if (selectedCity.toLowerCase().includes('kindia')) {
        setPostalCode('Foulayah');
      } else if (selectedCity.toLowerCase().includes('mamou')) {
        setPostalCode('Gare Voiture');
      } else {
        setPostalCode('Simbaya Gare');
      }
    }
  }, [selectedCity]);

  // Submission & UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [minDateString, setMinDateString] = useState('');

  // Calcul du prix en direct
  const quote = calculateQuote(selectedService, surface, selectedOptions, frequency);

  const GNF_RATE = 9500;
  const formatPrice = (priceEur: number) => {
    if (currency === 'GNF') {
      const gnf = Math.round(priceEur * GNF_RATE);
      return `${gnf.toLocaleString('fr-FR')} GNF`;
    }
    return `${priceEur.toFixed(2)} €`;
  };

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    setMinDateString(minDate);
    if (!date) setDate(minDate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    const clientErrors: string[] = [];
    if (!fullName.trim() || fullName.trim().length < 2) {
      clientErrors.push('Veuillez renseigner votre nom complet.');
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailPattern.test(email.trim())) {
      clientErrors.push('Une adresse email valide est indispensable pour la confirmation.');
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 8) {
      clientErrors.push('Veuillez fournir un numéro de téléphone joignable (ex: +224 623 07 82 50).');
    }
    if (!address.trim() || address.trim().length < 4) {
      clientErrors.push("L'adresse de l'intervention à Conakry est obligatoire.");
    }
    if (!date) {
      clientErrors.push('Veuillez sélectionner une date de rendez-vous.');
    }
    if (!timeSlot) {
      clientErrors.push('Veuillez sélectionner un créneau horaire.');
    }

    if (clientErrors.length > 0) {
      setErrorMessages(clientErrors);
      return;
    }

    setIsLoading(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim() || 'Conakry',
      postalCode: postalCode.trim() || 'Simbaya Gare',
      serviceType: selectedService,
      surface: surface,
      frequency: frequency as 'one_time' | 'weekly' | 'biweekly' | 'monthly',
      selectedOptions: selectedOptions,
      date: date,
      timeSlot: timeSlot,
      accessInstructions: accessInstructions.trim(),
      notes: notes.trim(),
      calculatedPrice: quote.finalPrice
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errs = data.errors || [data.message || 'Une erreur est survenue lors de la réservation.'];
        setErrorMessages(errs);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      const waUrl = data.whatsappDirectUrl || generateWhatsAppDirectUrl({
        ...payload,
        reference: data.reference
      });

      // Redirection automatique vers WhatsApp pour démarrer l'échange directement
      try {
        const opened = window.open(waUrl, '_blank');
        if (!opened) {
          window.location.href = waUrl;
        }
      } catch (e) {
        // En cas de restriction
      }

      onBookingSuccess(data.booking, waUrl);

    } catch (err) {
      console.warn('Erreur AJAX fetch, fallback direct WhatsApp :', err);
      setIsLoading(false);
      const fallbackWaUrl = generateWhatsAppDirectUrl({
        ...payload,
        reference: `FC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      });
      window.open(fallbackWaUrl, '_blank');
    }
  };

  const timeSlots = [
    { label: 'Matinée (08h00 - 12h00)', value: '08h00 - 12h00', badge: 'Populaire' },
    { label: 'Milieu de journée (11h00 - 15h00)', value: '11h00 - 15h00', badge: 'Flexible' },
    { label: 'Après-midi (14h00 - 18h00)', value: '14h00 - 18h00', badge: 'Recommandé' },
    { label: 'Soirée VIP (18h00 - 21h00)', value: '18h00 - 21h00', badge: 'Bureaux' }
  ];

  return (
    <section id="reservation" className="py-20 bg-white text-slate-900 relative border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#064e3b] text-xs font-bold mb-3">
            <Lock className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Réservation Sécurisée · Fatou's Clean</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#064e3b]">
            Planifier Votre Intervention
          </h2>

          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Renseignez votre adresse à Conakry et votre créneau. Confirmation instantanée par e-mail et coordination directe sur WhatsApp.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessages.length > 0 && (
          <div id="bookingAlert" className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm">
            <div className="flex items-center gap-2 font-bold mb-1 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span>Veuillez vérifier les champs suivants :</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-red-600">
              {errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form id="bookingForm" onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Inputs (8 Cols) */}
          <div className="lg:col-span-8 bg-emerald-50/40 rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-8 shadow-sm">
            
            {/* 1. Date & Créneau */}
            <div>
              <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2 mb-4">
                <CalendarIcon className="w-4 h-4 text-[#16a34a]" />
                <span>1. Date et créneau d'intervention</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date du passage *
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={minDateString}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Interventions assurées 7j/7</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Créneau horaire d'arrivée *
                  </label>
                  <select
                    name="timeSlot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-500 mt-1 block">Créneaux de 4 heures garantis</span>
                </div>
              </div>
            </div>

            {/* 2. Coordonnées du contact */}
            <div>
              <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-[#16a34a]" />
                <span>2. Vos Coordonnées</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nom et Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Ex: Fatoumata Camara"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Numéro de Téléphone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#16a34a] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Ex: +224 623 07 82 50"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Adresse Email (pour confirmation & facture) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      name="email"
                      placeholder="votre-email@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Adresse de l'intervention à Conakry */}
            <div>
              <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#16a34a]" />
                <span>3. Lieu de l'intervention</span>
              </h3>

              <div className="space-y-4">
                {/* Choix rapide de l'agence / ville */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Sélectionnez votre ville / Agence de rattachement *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Conakry', label: 'Conakry', sub: 'Simbaya Gare', repere: 'Simbaya Gare' },
                      { id: 'Kindia', label: 'Kindia', sub: 'Foulayah', repere: 'Foulayah' },
                      { id: 'Mamou', label: 'Mamou', sub: 'Gare Voiture', repere: 'Gare Voiture' }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCity(c.id);
                          setPostalCode(c.repere);
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          city.toLowerCase().includes(c.id.toLowerCase())
                            ? 'bg-[#16a34a] text-white border-[#16a34a] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{c.label}</div>
                        <div className={`text-[10px] font-medium truncate ${
                          city.toLowerCase().includes(c.id.toLowerCase()) ? 'text-emerald-100' : 'text-slate-500'
                        }`}>
                          {c.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Adresse complète / Repère ({city}) *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder={`Ex: ${
                      city.toLowerCase().includes('kindia')
                        ? 'Foulayah, près du carrefour...'
                        : city.toLowerCase().includes('mamou')
                        ? 'Près de la Gare Voiture, centre-ville...'
                        : 'Simbaya Gare, Kipé, Camayenne...'
                    }`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Quartier / Repère précis
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Simbaya Gare, Foulayah, Gare Voiture..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Consignes d'accès au logement / locaux</span>
                  </label>
                  <input
                    type="text"
                    name="accessInstructions"
                    placeholder="Ex: Gardien à l'entrée, portail vert, signaler Fatou's Clean..."
                    value={accessInstructions}
                    onChange={(e) => setAccessInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Remarques particulières
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Ex: Insister sur la cuisine, le marbre ou les baies vitrées..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#16a34a] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Hidden fields */}
            <input type="hidden" name="serviceType" value={selectedService} />
            <input type="hidden" name="surface" value={surface} id="bookingSurface" />
            <input type="hidden" name="frequency" value={frequency} />
            <input type="hidden" name="calculatedPrice" value={quote.finalPrice} id="bookingCalculatedPrice" />

          </div>

          {/* Sticky Recap Summary & Confirm Button (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xl relative overflow-hidden">
              
              {/* Green Header Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#16a34a]" />

              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block">
                  Récapitulatif Devis
                </span>
                <h3 className="text-xl font-black text-[#064e3b]">Votre Réservation</h3>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 py-4 text-xs sm:text-sm border-b border-slate-100">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Prestation :</span>
                  <span className="font-semibold text-[#064e3b]">{SERVICES_CATALOG[selectedService].title}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>Surface :</span>
                  <span className="font-semibold text-[#064e3b]">{surface} m²</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>Date :</span>
                  <span className="font-semibold text-[#16a34a]">{date || 'À choisir'}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>Créneau :</span>
                  <span className="font-semibold text-[#16a34a]">{timeSlot}</span>
                </div>

                {selectedOptions.length > 0 && (
                  <div className="pt-2 text-xs">
                    <div className="text-slate-500 mb-1">Options incluses ({selectedOptions.length}) :</div>
                    <div className="space-y-0.5 text-slate-700 font-medium pl-1">
                      {selectedOptions.map((optId) => {
                        const opt = PRICING_OPTIONS.find((o) => o.id === optId);
                        return (
                          <div key={optId} className="flex justify-between text-[11px]">
                            <span>• {opt?.name}</span>
                            <span className="text-[#16a34a] font-bold">+{formatPrice(opt?.price || 0)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Price */}
              <div className="py-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold block">Montant garanti</span>
                    <span className="text-[11px] text-[#16a34a] font-semibold">Matériel & produits inclus</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-[#064e3b]">
                      {formatPrice(quote.finalPrice)}
                    </div>
                    {currency === 'GNF' && (
                      <div className="text-[10px] text-slate-400">
                        (~ {quote.finalPrice.toFixed(2)} €)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submission button in Vert & Blanc */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-75 disabled:cursor-not-allowed text-white font-black text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Envoi et redirection WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Confirmer la réservation</span>
                  </>
                )}
              </button>

              {/* Security reassurance with Contact info */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-center gap-1.5 text-[#16a34a] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Assistance téléphonique : {COMPANY_INFO.phone}</span>
                </div>
                <p>Annulation flexible sans frais jusqu'à 24h avant.</p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </section>
  );
};
