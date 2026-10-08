import React from 'react';
import { Phone, Mail, MessageSquare, Code2, Calendar, Image as ImageIcon } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../lib/companyInfo';

interface NavbarProps {
  onOpenInspector: () => void;
  onOpenImageModifier: () => void;
  bookingCount: number;
  currency: 'EUR' | 'GNF';
  setCurrency: (c: 'EUR' | 'GNF') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenInspector, 
  onOpenImageModifier,
  bookingCount,
  currency,
  setCurrency
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 text-slate-800 shadow-xs">
      {/* Top Banner Notice with Official Contact Info - Vert & Blanc Branding Guinée */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#15803d] text-white text-xs py-2 px-4 font-semibold">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Contact Details from User Brief */}
          <div className="flex flex-wrap items-center gap-4 text-emerald-100 text-[11px] sm:text-xs">
            <a 
              href={`tel:${COMPANY_INFO.phoneRaw}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-bold text-white">{COMPANY_INFO.phone}</span>
            </a>

            <span className="text-emerald-400/50 hidden sm:inline">|</span>

            <a 
              href={`mailto:${COMPANY_INFO.email}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors hidden md:flex"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              <span>{COMPANY_INFO.email}</span>
            </a>

            <span className="text-emerald-400/50 hidden lg:inline">|</span>

            <span className="text-emerald-100 hidden lg:inline truncate max-w-sm">
              📍 {COMPANY_INFO.address}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Devise Toggle: GNF / EUR */}
            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/20 text-[11px]">
              <span className="text-emerald-200 px-1 font-medium hidden sm:inline">Devise :</span>
              <button
                type="button"
                onClick={() => setCurrency('GNF')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  currency === 'GNF'
                    ? 'bg-white text-[#064e3b] shadow-xs'
                    : 'text-white hover:text-emerald-200'
                }`}
              >
                GNF
              </button>
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  currency === 'EUR'
                    ? 'bg-white text-[#064e3b] shadow-xs'
                    : 'text-white hover:text-emerald-200'
                }`}
              >
                EUR (€)
              </button>
            </div>

            <span className="hidden xl:inline text-[11px] px-2 py-0.5 rounded bg-white/15 text-white font-medium border border-white/20">
              Conakry · Kindia · Mamou 🇬🇳
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Official Logo Brand */}
        <a href="#" className="flex items-center group">
          <Logo size="md" />
        </a>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-bold text-slate-700">
          <a href="#services" className="hover:text-[#16a34a] transition-colors">Services</a>
          <a href="#calculateur" className="hover:text-[#16a34a] transition-colors">Calculateur Tarif</a>
          <a href="#avant-apres" className="hover:text-[#16a34a] transition-colors">Avant / Après</a>
          <a href="#nos-bureaux" className="hover:text-[#16a34a] transition-colors">Nos Bureaux</a>
          <a href="#avis-clients" className="hover:text-[#16a34a] transition-colors">Avis Clients</a>
          <a href="#reservation" className="hover:text-[#16a34a] transition-colors">Prendre RDV</a>
          <a href="#contact" className="hover:text-[#16a34a] transition-colors">Contact</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Bouton Studio de modification d'image */}
          <button
            onClick={onOpenImageModifier}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-200 shadow-2xs transition-all hover:scale-102 cursor-pointer"
            title="Modifier ou téléverser les photos du site"
          >
            <ImageIcon className="w-4 h-4 text-[#16a34a]" />
            <span className="hidden sm:inline">Modifier Images</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#16a34a] text-white font-extrabold">Studio</span>
          </button>

          {/* Dev / Admin button */}
          <button
            onClick={onOpenInspector}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Consulter le code backend et les réservations"
          >
            <Code2 className="w-3.5 h-3.5 text-[#16a34a]" />
            <span className="hidden lg:inline">API & Dossiers</span>
            {bookingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#16a34a] text-white font-black">
                {bookingCount}
              </span>
            )}
          </button>

          {/* WhatsApp Direct avec le vrai numéro +224 623 07 82 50 */}
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 text-[#064e3b] hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>WhatsApp Direct</span>
          </a>

          {/* Primary CTA Vert & Blanc */}
          <a
            href="#reservation"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4.5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-102"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Réserver en ligne</span>
          </a>
        </div>
      </div>
    </header>
  );
};
