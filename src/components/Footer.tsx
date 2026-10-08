import React from 'react';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../lib/companyInfo';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#064e3b] text-emerald-100 text-xs border-t border-emerald-800 relative overflow-hidden">
      {/* Emerald Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#16a34a]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="md" showText={false} />
              <div>
                <span className="text-xl font-black text-white tracking-tight">Fatou's Clean</span>
                <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">Conakry, Guinée 🇬🇳</p>
              </div>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Entreprise de référence en République de Guinée pour l'entretien résidentiel haut de gamme, 
              le nettoyage de bureaux d'affaires, le décapage de fin de chantier et la conciergerie VIP.
            </p>
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Assurance RC Pro & Personnel Agréé</span>
            </div>
          </div>

          {/* Services Col */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Nos Formules</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-white transition-colors">Entretien Résidentiel Régulier</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Grand Nettoyage en Profondeur</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Nettoyage Bureaux & Locaux Pro</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Conciergerie & Rotations Airbnb</a></li>
              <li><a href="#calculateur" className="hover:text-white transition-colors">Shampouinage Canapé & Tapis</a></li>
              <li><a href="#calculateur" className="hover:text-white transition-colors">Lavage Vitres & Baies Vitrées</a></li>
              <li className="pt-1"><a href="#avis-clients" className="text-emerald-300 hover:text-white font-bold transition-colors">⭐ Avis Clients Conakry (★ 4.9)</a></li>
            </ul>
          </div>

          {/* Nos 3 Bureaux en Guinée */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Nos 3 Bureaux en Guinée 🇬🇳</h4>
            <ul className="space-y-2 text-emerald-200/90">
              <li>
                <strong className="text-white block font-bold">🏛️ Conakry (Siège National) :</strong>
                <span className="text-[11px]">Simbaya Gare (face Cantine, à côté Pharmacie LE SION)</span>
              </li>
              <li>
                <strong className="text-white block font-bold">🌿 Kindia (Siège Régional) :</strong>
                <span className="text-[11px]">Précisément à Foulayah</span>
              </li>
              <li>
                <strong className="text-white block font-bold">🚗 Mamou (Agence Régionale) :</strong>
                <span className="text-[11px]">Auprès de la Gare Voiture</span>
              </li>
            </ul>
          </div>

          {/* Contact & Permanence 7j/7 */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Contact & Permanence 7j/7</h4>
            
            <div className="flex items-start gap-2.5 text-white">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-white">Accueil & Standard Unique :</span>
                <span className="text-emerald-200 text-xs leading-relaxed">
                  Interventions à Conakry, Kindia et Mamou
                </span>
                <span className="block text-emerald-300 text-[11px] font-semibold mt-0.5">7j/7 de 07h30 à 21h00</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white pt-1">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:text-emerald-300 transition-colors font-bold text-sm">
                {COMPANY_INFO.phone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-white">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-emerald-300 transition-colors">
                {COMPANY_INFO.email}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-300/60">
          <div>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Tous droits réservés.
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
            <span>{COMPANY_INFO.address}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
