import React from 'react';
import { Sparkles, Home, Building2, Key, Check, ArrowRight } from 'lucide-react';
import { SERVICES_CATALOG } from '../lib/pricing';
import { ServiceType } from '../types/booking';

interface ServicesSectionProps {
  onSelectService: (service: ServiceType) => void;
  currency: 'EUR' | 'GNF';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, currency }) => {
  const serviceIcons = {
    regular: Home,
    deep: Sparkles,
    office: Building2,
    airbnb: Key,
  };

  const GNF_RATE = 9500;
  const formatPrice = (priceEur: number) => {
    if (currency === 'GNF') {
      const gnf = Math.round(priceEur * GNF_RATE);
      return `${gnf.toLocaleString('fr-FR')} GNF`;
    }
    return `${priceEur.toFixed(2)} €`;
  };

  return (
    <section id="services" className="py-20 bg-emerald-50/30 text-slate-900 relative border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-[#064e3b] text-xs font-bold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Formules Clés en Main · Fatou's Clean</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#064e3b]">
            Nos Prestations de Nettoyage
          </h2>

          <p className="text-slate-600 mt-3 text-base">
            Résidences privées, concessions, appartements de standing, bureaux et conciergerie Airbnb. 
            Des protocoles chirurgicaux assurés par une équipe hautement qualifiée à Conakry.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(SERVICES_CATALOG).map((service) => {
            const IconComponent = serviceIcons[service.id];
            const isHighlight = service.id === 'deep';

            return (
              <div
                key={service.id}
                className={`flex flex-col justify-between rounded-3xl p-6.5 transition-all duration-300 border relative overflow-hidden bg-white ${
                  isHighlight
                    ? 'border-[#16a34a] shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 hover:shadow-lg'
                }`}
              >
                {/* Vert Highlight Top Strip */}
                {isHighlight && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#16a34a]" />
                )}

                <div>
                  {/* Top line with Icon & Rate */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#16a34a]">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">À partir de</div>
                      <div className="text-sm font-extrabold text-[#064e3b]">
                        {formatPrice(service.basePricePerM2)} / m²
                      </div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-[#064e3b] mb-1">{service.title}</h3>
                  <p className="text-xs text-[#16a34a] font-semibold mb-3">{service.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{service.description}</p>

                  {/* Feature checklist */}
                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-[#16a34a] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectService(service.id);
                    document.getElementById('calculateur')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isHighlight
                      ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md shadow-emerald-500/20'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-200'
                  }`}
                >
                  <span>Choisir ce service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
