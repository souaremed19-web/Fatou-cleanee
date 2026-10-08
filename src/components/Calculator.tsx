import React, { useId } from 'react';
import { 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Flame, 
  ThermometerSnowflake, 
  Shirt, 
  Armchair, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { ServiceType } from '../types/booking';
import { SERVICES_CATALOG, PRICING_OPTIONS, FREQUENCY_DISCOUNTS, calculateQuote } from '../lib/pricing';

interface CalculatorProps {
  selectedService: ServiceType;
  setSelectedService: (s: ServiceType) => void;
  surface: number;
  setSurface: (m2: number) => void;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  frequency: string;
  setFrequency: (f: string) => void;
  currency: 'EUR' | 'GNF';
  setCurrency: (c: 'EUR' | 'GNF') => void;
  onApplyToBooking: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  selectedService,
  setSelectedService,
  surface,
  setSurface,
  selectedOptions,
  setSelectedOptions,
  frequency,
  setFrequency,
  currency,
  setCurrency,
  onApplyToBooking
}) => {
  const surfaceInputId = useId();
  const calculation = calculateQuote(selectedService, surface, selectedOptions, frequency);

  const GNF_RATE = 9500;
  const formatPrice = (priceEur: number) => {
    if (currency === 'GNF') {
      const gnf = Math.round(priceEur * GNF_RATE);
      return `${gnf.toLocaleString('fr-FR')} GNF`;
    }
    return `${priceEur.toFixed(2)} €`;
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  return (
    <section id="calculateur" className="py-20 bg-white text-slate-900 relative border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#064e3b] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Tarification Transparente en Direct · Fatou's Clean</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#064e3b]">
            Calculateur de Devis en Direct
          </h2>

          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Estimez immédiatement le coût exact de votre prestation selon la surface et les options de votre choix.
          </p>

          {/* Currency Toggle */}
          <div className="mt-4 inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold">
            <span className="text-slate-500 px-2">Devise :</span>
            <button
              type="button"
              onClick={() => setCurrency('GNF')}
              className={`px-3 py-1 rounded-lg transition-all ${
                currency === 'GNF'
                  ? 'bg-[#16a34a] text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              GNF (Franc Guinéen)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('EUR')}
              className={`px-3 py-1 rounded-lg transition-all ${
                currency === 'EUR'
                  ? 'bg-[#16a34a] text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              EUR (€)
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-8 bg-emerald-50/40 p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
            
            {/* 1. Choix du service */}
            <div>
              <label className="block text-sm font-bold text-[#064e3b] mb-3">
                1. Type de prestation souhaitée
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(Object.keys(SERVICES_CATALOG) as ServiceType[]).map((type) => {
                  const s = SERVICES_CATALOG[type];
                  const isSelected = selectedService === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedService(type)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#16a34a] text-[#064e3b] shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{s.title}</div>
                      <div className="text-[11px] text-[#16a34a] mt-1 font-semibold">
                        {formatPrice(s.basePricePerM2)}/m²
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Surface en m² */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor={surfaceInputId} className="text-sm font-bold text-[#064e3b]">
                  2. Surface totale du lieu
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={surfaceInputId}
                    type="number"
                    min="15"
                    max="400"
                    value={surface}
                    onChange={(e) => setSurface(Math.max(15, Number(e.target.value) || 15))}
                    className="w-20 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[#16a34a] font-bold text-right text-sm focus:outline-none focus:border-[#16a34a] shadow-2xs"
                  />
                  <span className="text-sm text-slate-500 font-semibold">m²</span>
                </div>
              </div>

              {/* Range Slider in Vert */}
              <input
                type="range"
                min="15"
                max="300"
                step="5"
                value={surface}
                onChange={(e) => setSurface(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#16a34a] focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-1.5">
                <span>Studio (25 m²)</span>
                <span>Appartement T3 (65 m²)</span>
                <span>Grande Villa (150 m²)</span>
                <span>Siège Pro (250+ m²)</span>
              </div>
            </div>

            {/* 3. Fréquence d'intervention */}
            <div>
              <label className="block text-sm font-bold text-[#064e3b] mb-2.5">
                3. Fréquence d'intervention
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(FREQUENCY_DISCOUNTS).map(([key, config]) => {
                  const isCurrent = frequency === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFrequency(key)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#16a34a] text-white font-bold border-[#16a34a] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Options supplémentaires */}
            <div>
              <label className="block text-sm font-bold text-[#064e3b] mb-3">
                4. Options & prestations complémentaires
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {PRICING_OPTIONS.map((opt) => {
                  const isChecked = selectedOptions.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50 border-[#16a34a] text-[#064e3b] shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#064e3b] truncate">{opt.name}</span>
                          <span className="text-xs font-black text-[#16a34a] ml-1">
                            +{formatPrice(opt.price)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{opt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Breakdown & Summary Card (Right 5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-200 shadow-xl space-y-6 relative overflow-hidden">
              
              {/* Vert Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#064e3b] via-[#16a34a] to-[#22c55e]" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-[#064e3b]">Estimation Détaillée</h3>
                  <p className="text-xs text-[#16a34a] font-semibold">Devis instantané garanti</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-[#064e3b]">
                  <Clock className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>~{calculation.estimatedHours}h estimées</span>
                </div>
              </div>

              {/* Price Rows */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Prestation : <strong>{SERVICES_CATALOG[selectedService].title}</strong></span>
                  <span className="font-semibold text-[#064e3b]">{formatPrice(calculation.basePrice)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-500 text-xs pl-2">
                  <span>Base surface : {surface} m² × {formatPrice(SERVICES_CATALOG[selectedService].basePricePerM2)}</span>
                  <span>(min. {formatPrice(SERVICES_CATALOG[selectedService].minimumPrice)})</span>
                </div>

                {calculation.optionsTotal > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Options choisies ({selectedOptions.length}) :</span>
                    <span className="font-semibold text-[#16a34a]">+{formatPrice(calculation.optionsTotal)}</span>
                  </div>
                )}

                {calculation.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[#16a34a] font-medium">
                    <span>Remise récurrence ({calculation.discountPercent}%) :</span>
                    <span>-{formatPrice(calculation.discountAmount)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                      Total Garanti
                    </span>
                    <span className="text-[11px] text-[#16a34a] font-semibold">Matériel & produits inclus</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#064e3b]">
                      {formatPrice(calculation.finalPrice)}
                    </span>
                    {currency === 'GNF' && (
                      <div className="text-[11px] text-slate-400">
                        (~ {calculation.finalPrice.toFixed(2)} €)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust checklist */}
              <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-100 space-y-1.5 text-xs text-[#064e3b]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Équipe salariée et assurée avec matériel de pointe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Siège à Simbaya Gare, Conakry</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Facture formelle transmise par email</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onApplyToBooking}
                className="w-full py-4 px-6 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                <span>Valider ce devis & Réserver</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
