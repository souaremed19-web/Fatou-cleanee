import React, { useState } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, Clock, Star, ArrowRight, Camera, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../lib/companyInfo';

interface HeroProps {
  onOpenImageModifier: () => void;
  currency: 'EUR' | 'GNF';
}

export const Hero: React.FC<HeroProps> = ({ onOpenImageModifier, currency }) => {
  const [heroBg, setHeroBg] = useState<string>(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white text-slate-900 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-emerald-100">
      
      {/* Emerald Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[450px] bg-emerald-200/25 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-green-200/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge in Vert & Blanc Branding Guinée */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-[#064e3b] text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse" />
              <span>Fatou's Clean</span>
              <span className="text-emerald-300">|</span>
              <span className="text-[#16a34a]">Simbaya Gare, Conakry 🇬🇳</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#064e3b] leading-[1.12]">
              L'excellence du nettoyage professionnel & conciergerie{' '}
              <span className="text-[#16a34a] underline decoration-emerald-200 decoration-wavy decoration-2">
                au standard 5 étoiles.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Résidences privées, grandes concessions, villas, bureaux d'affaires et appartements Airbnb. 
              Des produits certifiés neutres, du matériel d'injection-extraction de pointe et une équipe formée à la rigueur absolue.
            </p>

            {/* Trust bullet points */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-700">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#16a34a] shrink-0" />
                <span>Personnel qualifié, discret et vérifié</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#16a34a] shrink-0" />
                <span>Interventions 7j/7 dans tout Conakry</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#16a34a] shrink-0" />
                <span>Matériel professionnel & produits fournis</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#16a34a] shrink-0" />
                <span>Garantie 100% Propreté Éclatante</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
              <a
                href="#calculateur"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Calculer mon tarif ({currency})</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064e3b] border border-emerald-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xs transition-all"
              >
                <Phone className="w-4 h-4 text-[#16a34a]" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
            </div>

            {/* Address Banner */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span className="font-medium text-[#064e3b]">{COMPANY_INFO.address}</span>
            </div>
          </div>

          {/* Right Column: Visual Card with Image Customization Button */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white border border-emerald-100 rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden group">
              
              {/* Vert Header Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#064e3b] via-[#16a34a] to-[#22c55e]" />

              {/* Image banner preview with quick change button */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-5 border border-slate-100 shadow-xs">
                <img
                  src={heroBg}
                  alt="Prestation Fatou's Clean"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/80 via-transparent to-transparent" />
                
                {/* Floating "Modifier images" button */}
                <button
                  type="button"
                  onClick={onOpenImageModifier}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#064e3b] border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
                  title="Modifier les photos de la galerie ou du site"
                >
                  <Camera className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Modifier images</span>
                </button>

                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs font-bold text-emerald-200 flex items-center gap-1">
                    <span>✨ Standard Élite Conakry</span>
                  </div>
                  <div className="text-base font-black text-white">
                    Fatou's Clean - Simbaya Gare
                  </div>
                </div>
              </div>

              {/* Logo Presentation in Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" showText={false} />
                <div className="text-right">
                  <h3 className="font-extrabold text-[#064e3b] text-base">Fatou's Clean</h3>
                  <p className="text-xs text-[#16a34a] font-bold">Siège : Simbaya Gare</p>
                </div>
              </div>

              <div className="space-y-3 py-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#064e3b] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#064e3b]">Service Rapide & Réservation Directe</h4>
                    <p className="text-slate-500 mt-0.5">Équipe joignable au {COMPANY_INFO.phone} 7j/7.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#064e3b] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#064e3b]">Emplacement Accessible</h4>
                    <p className="text-slate-500 mt-0.5">À côté de la Pharmacie LE SION en face de la Cantine.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#064e3b] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#064e3b]">Confirmation par Email & WhatsApp</h4>
                    <p className="text-slate-500 mt-0.5">Notification instantanée à {COMPANY_INFO.email}.</p>
                  </div>
                </div>
              </div>

              {/* Fast highlight box */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#16a34a] font-semibold">Disponibilité à Conakry</div>
                  <div className="text-xs font-bold text-[#064e3b] flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Créneaux sous 24h</span>
                  </div>
                </div>
                <a
                  href="#reservation"
                  className="px-3.5 py-1.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Réserver →
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
