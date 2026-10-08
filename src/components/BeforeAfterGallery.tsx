import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, ArrowLeftRight, Camera, Edit3 } from 'lucide-react';
import { BeforeAfterItemData } from './ImageModifierModal';

interface BeforeAfterGalleryProps {
  items: BeforeAfterItemData[];
  onOpenModifierWithItem: (item: BeforeAfterItemData) => void;
  onOpenModifierGeneral: () => void;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  items,
  onOpenModifierWithItem,
  onOpenModifierGeneral
}) => {
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSliderChange = (id: string, value: number) => {
    setSliderPositions(prev => ({ ...prev, [id]: value }));
  };

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="avant-apres" className="py-20 bg-emerald-50/25 text-slate-900 relative border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-[#064e3b] text-xs font-bold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Preuves Visuelles · Rénovation et Éclat Pur</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#064e3b]">
            Galerie Interactive Avant / Après
          </h2>
          
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Faites glisser le curseur pour observer l'efficacité de nos interventions à Conakry. 
            Vous pouvez personnaliser ou importer vos propres photos grâce au bouton Studio ci-dessous.
          </p>

          {/* Boutons de modification d'image en Vert & Blanc */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={onOpenModifierGeneral}
              className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>📷 Modifier les Photos de la Galerie</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#064e3b] text-emerald-200 font-extrabold uppercase">
                Studio
              </span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'Toutes les interventions' },
              { id: 'cuisine', label: 'Cuisines & Fours' },
              { id: 'sanitaires', label: 'Salles de bain & Marbre' },
              { id: 'textiles', label: 'Canapés & Tapis' },
              { id: 'vitrerie', label: 'Vitres & Baies' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#16a34a] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:text-[#064e3b] border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredItems.map((item) => {
            const currentPosition = sliderPositions[item.id] ?? 50;

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-xl flex flex-col group relative"
              >
                {/* Green accent top border */}
                <div className="h-1.5 w-full bg-[#16a34a]" />

                {/* Interactive comparison container */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden select-none bg-slate-900">
                  
                  {/* BEFORE image (background) */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${item.beforeImg})`,
                      filter: `brightness(${item.beforeBrightness || 75}%) sepia(0.2) saturate(0.7) contrast(0.95)`
                    }}
                  >
                    <div className="absolute inset-0 bg-slate-950/20" />
                  </div>

                  {/* AFTER image (foreground clipped with clean contrast) */}
                  <div
                    className="absolute inset-0 h-full overflow-hidden bg-cover bg-center"
                    style={{
                      width: `${currentPosition}%`,
                      backgroundImage: `url(${item.afterImg})`,
                      filter: `brightness(${item.afterBrightness || 110}%) saturate(1.15) contrast(1.05)`,
                      boxShadow: '4px 0 20px rgba(0,0,0,0.5)'
                    }}
                  >
                    <div className="absolute inset-0 bg-emerald-500/5" />
                  </div>

                  {/* Vertical Divider Line with handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-10 flex items-center justify-center"
                    style={{ left: `${currentPosition}%` }}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#16a34a] border-2 border-white text-white shadow-xl flex items-center justify-center text-xs -translate-x-1/2">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Range input for smooth sliding on drag or touch */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentPosition}
                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                    aria-label={`Comparateur avant après pour ${item.title}`}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider uppercase bg-[#16a34a] text-white shadow-md flex items-center gap-1">
                      <span>✨</span>
                      <span>APRÈS INTERVENTION</span>
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-slate-900/90 text-white border border-slate-700 shadow-md flex items-center gap-1">
                      <span>⏳</span>
                      <span>AVANT</span>
                    </span>
                  </div>

                  {/* Bouton direct "Modifier cette image" sur la carte */}
                  <button
                    type="button"
                    onClick={() => onOpenModifierWithItem(item)}
                    className="absolute bottom-3 right-3 z-25 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#064e3b] border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 cursor-pointer backdrop-blur-sm"
                    title="Changer les photos de cette réalisation"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Modifier cette image</span>
                  </button>

                  {/* Hint at the bottom */}
                  <div className="absolute bottom-3 left-4 z-10 pointer-events-none bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-white font-medium border border-slate-700/60 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3 h-3 text-emerald-300" />
                    <span>Glissez pour comparer</span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 sm:p-6 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-[#064e3b] text-base sm:text-lg">{item.title}</h3>
                      <button
                        type="button"
                        onClick={() => onOpenModifierWithItem(item)}
                        className="text-[#16a34a] hover:text-[#15803d] text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Changer photo</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#16a34a] font-semibold">
                    <span className="flex items-center gap-1">
                      <span>🫧 Propreté éclatante</span>
                    </span>
                    <a href="#reservation" className="text-[#16a34a] hover:text-[#15803d] hover:underline flex items-center gap-1">
                      Demander ce résultat →
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
