import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Camera, 
  ZoomIn, 
  Upload, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { OFFICE_LOCATIONS, OfficeLocation } from '../lib/companyInfo';

interface AgenciesSectionProps {
  onSelectOfficeForBooking: (city: string) => void;
}

export const AgenciesSection: React.FC<AgenciesSectionProps> = ({ onSelectOfficeForBooking }) => {
  const [offices, setOffices] = useState<OfficeLocation[]>(() => {
    try {
      const saved = localStorage.getItem('fatous_cleaner_office_locations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return OFFICE_LOCATIONS;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'conakry' | 'kindia' | 'mamou'>('all');
  const [zoomedOffice, setZoomedOffice] = useState<OfficeLocation | null>(null);
  const [editingOffice, setEditingOffice] = useState<OfficeLocation | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const handleStartEditImage = (office: OfficeLocation) => {
    setEditingOffice(office);
    setCustomImageUrl(office.internalOfficeImage);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveOfficeImage = () => {
    if (!editingOffice || !customImageUrl) return;

    const updated = offices.map(o => 
      o.id === editingOffice.id 
        ? { ...o, internalOfficeImage: customImageUrl } 
        : o
    );

    setOffices(updated);
    try {
      localStorage.setItem('fatous_cleaner_office_locations', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    setEditingOffice(null);
  };

  const filteredOffices = activeTab === 'all' 
    ? offices 
    : offices.filter(o => o.id === activeTab);

  return (
    <section id="nos-bureaux" className="py-20 bg-emerald-50/30 text-slate-900 relative border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-[#064e3b] text-xs font-bold mb-3 border border-emerald-200">
            <Building2 className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Implantation Nationale · Guinée 🇬🇳</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#064e3b]">
            Nos Sièges & Agences Régionales
          </h2>

          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Retrouvez nos équipes et locaux professionnels aménagés selon nos standards d'excellence à 
            <strong className="text-[#064e3b]"> Conakry</strong>, 
            <strong className="text-[#064e3b]"> Kindia (Foulayah)</strong> et 
            <strong className="text-[#064e3b]"> Mamou (près de la Gare Voiture)</strong>.
          </p>

          {/* Quick city filter buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-[#064e3b] border border-slate-200'
              }`}
            >
              Tous nos bureaux (3 sites)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('conakry')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'conakry'
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-[#064e3b] border border-slate-200'
              }`}
            >
              🏛️ Conakry (Siège National)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kindia')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kindia'
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-[#064e3b] border border-slate-200'
              }`}
            >
              🌿 Kindia (Foulayah)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mamou')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'mamou'
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-[#064e3b] border border-slate-200'
              }`}
            >
              🚗 Mamou (Gare Voiture)
            </button>
          </div>
        </div>

        {/* 3 Offices Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredOffices.map((office) => {
            const isHQ = office.isHQ;

            return (
              <div
                key={office.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl group ${
                  isHQ
                    ? 'border-[#16a34a] ring-2 ring-emerald-500/15'
                    : 'border-emerald-100 hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Top Header Strip */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#064e3b] via-[#16a34a] to-[#22c55e]" />

                  {/* Internal Office Image Showcase */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900 group/img select-none">
                    <img
                      src={office.internalOfficeImage}
                      alt={`Bureau interne Fatou's Clean - ${office.name}`}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Badge Bureau Interne */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#16a34a] text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>{office.type}</span>
                      </span>
                      {isHQ && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 shadow-sm">
                          Siège National
                        </span>
                      )}
                    </div>

                    {/* Action buttons on Image: Zoom & Edit Image */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEditImage(office)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#064e3b] text-[11px] font-bold shadow-md backdrop-blur-sm flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer"
                        title="Modifier la photo de ce bureau"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span className="hidden sm:inline">Changer photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setZoomedOffice(office)}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white shadow-md backdrop-blur-sm transition-transform hover:scale-105 cursor-pointer"
                        title="Agrandir la vue du bureau"
                      >
                        <ZoomIn className="w-4 h-4 text-emerald-300" />
                      </button>
                    </div>

                    {/* Internal office caption */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] font-semibold text-emerald-100 flex items-center gap-1 mb-0.5">
                        <span>🏢 Vue intérieure du bureau</span>
                      </div>
                      <div className="text-sm font-black text-white leading-tight">
                        {office.name}
                      </div>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-6 space-y-4">
                    {/* Landmark / Repère exact */}
                    <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1">
                      <div className="flex items-start gap-2 text-xs">
                        <MapPin className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-[#064e3b] block">Adresse & Emplacement précis :</span>
                          <span className="text-slate-700 font-semibold">{office.address}</span>
                          <span className="block text-[11px] text-[#16a34a] font-bold mt-0.5">
                            📍 Repère : {office.landmark}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {office.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {office.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hours & Phone */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span>{office.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-[#064e3b]">
                        <Phone className="w-3.5 h-3.5 text-[#16a34a]" />
                        <a href={`tel:${office.phoneRaw}`} className="hover:underline">
                          {office.phone}
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={office.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => onSelectOfficeForBooking(office.city)}
                      className="py-2.5 px-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
                    >
                      <span>Prendre RDV</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal for Internal Office Zoom */}
      {zoomedOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-200 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#16a34a]" />
                <div>
                  <h3 className="text-base font-extrabold text-[#064e3b]">
                    Vue Intérieure du Bureau · {zoomedOffice.name}
                  </h3>
                  <p className="text-xs text-slate-500">{zoomedOffice.landmark}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setZoomedOffice(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[65vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={zoomedOffice.internalOfficeImage}
                alt={zoomedOffice.name}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            <div className="p-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                <strong className="text-[#064e3b] block">{zoomedOffice.address}</strong>
                <span>Horaires : {zoomedOffice.hours} · Tél : {zoomedOffice.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={zoomedOffice.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] text-white text-xs font-bold hover:bg-[#15803d] transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contacter ce bureau</span>
                </a>

                <button
                  type="button"
                  onClick={() => setZoomedOffice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Modification de la photo du bureau interne */}
      {editingOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-200 flex flex-col">
            <div className="h-1.5 w-full bg-[#16a34a]" />

            <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#16a34a]" />
                <div>
                  <h3 className="text-sm font-black text-[#064e3b]">
                    Modifier la photo du bureau : {editingOffice.city}
                  </h3>
                  <p className="text-[11px] text-slate-500">{editingOffice.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingOffice(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Aperçu de la photo interne :
                </label>
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                  <img
                    src={customImageUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Importer depuis votre appareil :
                  </label>
                  <label className="text-xs font-bold text-[#16a34a] hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir fichier</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ou renseigner l'URL de l'image (https://...) :
                </label>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingOffice(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveOfficeImage}
                  className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all hover:scale-102 cursor-pointer"
                >
                  Enregistrer cette photo
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
