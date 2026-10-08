import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Sliders, 
  Link as LinkIcon
} from 'lucide-react';

export interface BeforeAfterItemData {
  id: string;
  category: string;
  title: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  beforeBrightness?: number;
  afterBrightness?: number;
}

interface ImageModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: BeforeAfterItemData | null;
  allItems: BeforeAfterItemData[];
  onSaveItem: (updatedItem: BeforeAfterItemData) => void;
  onResetDefaults: () => void;
}

export const PRESET_IMAGES = [
  {
    name: 'Cuisine moderne & plan de travail',
    before: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Salle de bain & faïence marbre',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Salon standing & canapé velours',
    before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Baie vitrée & terrasse lumineuse',
    before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Bureaux VIP & open space lumineux',
    before: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Villa résidence & carrelage lustré',
    before: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  }
];

export const ImageModifierModal: React.FC<ImageModifierModalProps> = ({
  isOpen,
  onClose,
  currentItem,
  allItems,
  onSaveItem,
  onResetDefaults
}) => {
  if (!isOpen || !currentItem) return null;

  const [selectedId, setSelectedId] = useState<string>(currentItem.id);
  const activeItem = allItems.find(i => i.id === selectedId) || currentItem;

  const [title, setTitle] = useState(activeItem.title);
  const [description, setDescription] = useState(activeItem.description);
  const [category, setCategory] = useState(activeItem.category);
  const [beforeImg, setBeforeImg] = useState(activeItem.beforeImg);
  const [afterImg, setAfterImg] = useState(activeItem.afterImg);
  const [beforeBrightness, setBeforeBrightness] = useState(activeItem.beforeBrightness || 75);
  const [afterBrightness, setAfterBrightness] = useState(activeItem.afterBrightness || 110);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleSelectDifferentItem = (id: string) => {
    setSelectedId(id);
    const item = allItems.find(i => i.id === id);
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setCategory(item.category);
      setBeforeImg(item.beforeImg);
      setAfterImg(item.afterImg);
      setBeforeBrightness(item.beforeBrightness || 75);
      setAfterBrightness(item.afterBrightness || 110);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'before') {
          setBeforeImg(result);
        } else {
          setAfterImg(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_IMAGES[0]) => {
    setBeforeImg(preset.before);
    setAfterImg(preset.after);
  };

  const handleSave = () => {
    onSaveItem({
      id: selectedId,
      category,
      title,
      description,
      beforeImg,
      afterImg,
      beforeBrightness,
      afterBrightness
    });

    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-200">
        
        {/* Modal Top Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#064e3b] via-[#16a34a] to-[#22c55e]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#16a34a] flex items-center justify-center text-white shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#064e3b]">Studio Photos · Fatou's Clean</h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#16a34a] font-bold border border-emerald-200">
                  Logo & Branding Vert/Blanc
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Téléversez vos photos, utilisez des URLs externes ou sélectionnez des modèles haute définition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Select which card to edit */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-semibold shrink-0">Choisir la photo :</span>
          {allItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectDifferentItem(item.id)}
              className={`px-3 py-1.5 rounded-xl shrink-0 font-bold transition-all cursor-pointer ${
                selectedId === item.id
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          
          {/* Live Preview Side by Side */}
          <div className="grid sm:grid-cols-2 gap-5">
            
            {/* Avant Preview */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  Photo Avant (État initial)
                </span>
                <span className="text-[10px] text-slate-500">Luminosité : {beforeBrightness}%</span>
              </div>

              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={beforeImg}
                  alt="Aperçu Avant"
                  className="w-full h-full object-cover"
                  style={{ filter: `brightness(${beforeBrightness}%) sepia(0.2)` }}
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-white">
                  AVANT
                </div>
              </div>

              {/* Slider Luminosité Avant */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <input
                  type="range"
                  min="50"
                  max="120"
                  value={beforeBrightness}
                  onChange={(e) => setBeforeBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#16a34a]"
                />
              </div>

              {/* Upload for Avant */}
              <div className="flex gap-2 pt-1">
                <label className="flex-1 px-3 py-2 bg-white hover:bg-emerald-50 text-[#064e3b] text-xs font-bold rounded-xl border border-emerald-200 cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Importer fichier</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'before')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Après Preview */}
            <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#064e3b] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                  Photo Après (Fatou's Clean)
                </span>
                <span className="text-[10px] text-[#16a34a]">Luminosité : {afterBrightness}%</span>
              </div>

              <div className="relative h-44 rounded-xl overflow-hidden border border-emerald-300 bg-slate-900 shadow-sm">
                <img
                  src={afterImg}
                  alt="Aperçu Après"
                  className="w-full h-full object-cover"
                  style={{ filter: `brightness(${afterBrightness}%) saturate(1.15)` }}
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#16a34a] text-white">
                  APRÈS
                </div>
              </div>

              {/* Slider Luminosité Après */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                <Sliders className="w-3.5 h-3.5 text-[#16a34a]" />
                <input
                  type="range"
                  min="80"
                  max="140"
                  value={afterBrightness}
                  onChange={(e) => setAfterBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#16a34a]"
                />
              </div>

              {/* Upload for Après */}
              <div className="flex gap-2 pt-1">
                <label className="flex-1 px-3 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>Importer fichier</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'after')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          </div>

          {/* URLs directes */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-slate-500" />
                <span>URL directe Image Avant</span>
              </label>
              <input
                type="url"
                value={beforeImg}
                onChange={(e) => setBeforeImg(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#16a34a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-[#16a34a]" />
                <span>URL directe Image Après</span>
              </label>
              <input
                type="url"
                value={afterImg}
                onChange={(e) => setAfterImg(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#16a34a]"
              />
            </div>
          </div>

          {/* Presets rapides */}
          <div className="border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-[#064e3b] flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Modèles professionnels HD (en 1 clic) :</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-2 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="font-bold truncate">{preset.name}</div>
                  <div className="text-[10px] text-[#16a34a] mt-0.5">Appliquer ce duo →</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text metadata */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre de la réalisation
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a]"
                >
                  <option value="cuisine">Cuisine & Fours</option>
                  <option value="sanitaires">Salles de bain & Marbre</option>
                  <option value="textiles">Textiles, Canapés & Tapis</option>
                  <option value="vitrerie">Vitrerie & Baies vitrées</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description de la réalisation
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#16a34a] resize-none"
              />
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser les images d'origine</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
            >
              {saveFeedback ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Images Enregistrées !</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
