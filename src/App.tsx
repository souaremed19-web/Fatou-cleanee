/**
 * Fatou's Cleaner - Application Principale
 * Nettoyage Professionnel & Conciergerie VIP · Branding Guinée 🇬🇳 & International
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { Calculator } from './components/Calculator';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { CustomerReviews } from './components/CustomerReviews';
import { AgenciesSection } from './components/AgenciesSection';
import { BookingForm } from './components/BookingForm';
import { SuccessModal } from './components/SuccessModal';
import { CodeInspectorModal } from './components/CodeInspectorModal';
import { ImageModifierModal, BeforeAfterItemData } from './components/ImageModifierModal';
import { Footer } from './components/Footer';
import { ServiceType, BookingRecord } from './types/booking';

const DEFAULT_GALLERY_ITEMS: BeforeAfterItemData[] = [
  {
    id: 'kitchen',
    category: 'cuisine',
    title: 'Dégraissage Extrême Cuisine & Électroménager',
    description: 'Décapage en profondeur de la crédence, des feux de cuisson et élimination des dépôts de graisses incrustées.',
    beforeImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    beforeBrightness: 70,
    afterBrightness: 115
  },
  {
    id: 'bathroom',
    category: 'sanitaires',
    title: 'Détartrage & Faïence Marbre Salle de Bain',
    description: 'Traitement anti-calcaire de la robinetterie, polissage marbre et réhabilitation des joints.',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    beforeBrightness: 72,
    afterBrightness: 112
  },
  {
    id: 'living',
    category: 'textiles',
    title: 'Shampouinage Canapé Velours & Tapis de Salon',
    description: 'Injection-extraction haute pression, élimination des auréoles et assainissement anti-acariens.',
    beforeImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    beforeBrightness: 75,
    afterBrightness: 110
  },
  {
    id: 'windows',
    category: 'vitrerie',
    title: 'Baies Vitrées Vue Mer & Vitrage Panoramique',
    description: 'Lavage professionnel raclette américaine, dépoussiérage des rails et profilés aluminium.',
    beforeImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    beforeBrightness: 70,
    afterBrightness: 118
  }
];

export default function App() {
  // Shared state between Calculator and Booking form
  const [selectedService, setSelectedService] = useState<ServiceType>('deep');
  const [surface, setSurface] = useState<number>(65);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['windows']);
  const [frequency, setFrequency] = useState<string>('one_time');

  // Devise : Franc Guinéen (GNF) ou Euro (EUR)
  const [currency, setCurrency] = useState<'EUR' | 'GNF'>('GNF');
  const [selectedCity, setSelectedCity] = useState<string>('Conakry');

  // Backend reservations list
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  // Success modal
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | undefined>(undefined);

  // Gallery items with localStorage persistence
  const [galleryItems, setGalleryItems] = useState<BeforeAfterItemData[]>(() => {
    try {
      const saved = localStorage.getItem('fatous_cleaner_gallery_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  // Image modifier modal state
  const [isImageModifierOpen, setIsImageModifierOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<BeforeAfterItemData | null>(null);

  // Fetch initial bookings from API
  const refreshBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.bookings) {
          setBookings(data.bookings);
        }
      }
    } catch (err) {
      console.warn('API /api/bookings non joignable :', err);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  const handleSelectServiceFromCard = (service: ServiceType) => {
    setSelectedService(service);
    const calcElem = document.getElementById('calculateur');
    if (calcElem) {
      calcElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyToBooking = () => {
    const bookingElem = document.getElementById('reservation');
    if (bookingElem) {
      bookingElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectOfficeForBooking = (city: string) => {
    setSelectedCity(city);
    handleApplyToBooking();
  };

  const handleBookingSuccess = (newBooking: BookingRecord, waUrl?: string) => {
    setConfirmedBooking(newBooking);
    setWhatsappUrl(waUrl);
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Image modifications handlers
  const handleOpenModifierWithItem = (item: BeforeAfterItemData) => {
    setItemToEdit(item);
    setIsImageModifierOpen(true);
  };

  const handleOpenModifierGeneral = () => {
    setItemToEdit(galleryItems[0] || null);
    setIsImageModifierOpen(true);
  };

  const handleSaveGalleryItem = (updatedItem: BeforeAfterItemData) => {
    const nextItems = galleryItems.map(item => item.id === updatedItem.id ? updatedItem : item);
    setGalleryItems(nextItems);
    try {
      localStorage.setItem('fatous_cleaner_gallery_items', JSON.stringify(nextItems));
    } catch (e) {
      console.warn('Erreur sauvegarde localStorage :', e);
    }
  };

  const handleResetDefaultImages = () => {
    setGalleryItems(DEFAULT_GALLERY_ITEMS);
    try {
      localStorage.removeItem('fatous_cleaner_gallery_items');
    } catch (e) {
      // ignore
    }
    if (itemToEdit) {
      setItemToEdit(DEFAULT_GALLERY_ITEMS[0]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#16a34a] selection:text-white">
      {/* Navigation Fatou's Clean with Image Modifier Button */}
      <Navbar 
        onOpenInspector={() => setIsInspectorOpen(true)} 
        onOpenImageModifier={handleOpenModifierGeneral}
        bookingCount={bookings.length}
        currency={currency}
        setCurrency={setCurrency}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onOpenImageModifier={handleOpenModifierGeneral}
          currency={currency}
        />

        {/* Services Showcase */}
        <ServicesSection 
          onSelectService={handleSelectServiceFromCard} 
          currency={currency}
        />

        {/* Dynamic Rate Calculator with Guinea Currency Support */}
        <Calculator
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          surface={surface}
          setSurface={setSurface}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          frequency={frequency}
          setFrequency={setFrequency}
          currency={currency}
          setCurrency={setCurrency}
          onApplyToBooking={handleApplyToBooking}
        />

        {/* Interactive Before / After Comparison with Image Modifier Buttons */}
        <BeforeAfterGallery 
          items={galleryItems}
          onOpenModifierWithItem={handleOpenModifierWithItem}
          onOpenModifierGeneral={handleOpenModifierGeneral}
        />

        {/* Customer Reviews with Explanatory Images */}
        <CustomerReviews 
          onOpenBooking={handleApplyToBooking} 
          currency={currency} 
        />

        {/* Our Offices & Regional Headquarters (Conakry, Kindia Foulayah, Mamou Gare Voiture) */}
        <AgenciesSection 
          onSelectOfficeForBooking={handleSelectOfficeForBooking} 
        />

        {/* Online Booking & Appointment Module */}
        <BookingForm
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          surface={surface}
          setSurface={setSurface}
          selectedOptions={selectedOptions}
          frequency={frequency}
          currency={currency}
          selectedCity={selectedCity}
          onBookingSuccess={handleBookingSuccess}
        />
      </main>

      {/* Footer with Guinea Presence & Contact */}
      <Footer />

      {/* Confirmation Modal */}
      <SuccessModal
        booking={confirmedBooking}
        whatsappUrl={whatsappUrl}
        onClose={() => setConfirmedBooking(null)}
      />

      {/* Image Modifier Modal (Bouton de modification d'image) */}
      <ImageModifierModal
        isOpen={isImageModifierOpen}
        onClose={() => setIsImageModifierOpen(false)}
        currentItem={itemToEdit || galleryItems[0] || null}
        allItems={galleryItems}
        onSaveItem={handleSaveGalleryItem}
        onResetDefaults={handleResetDefaultImages}
      />

      {/* Admin, Nodemailer & Code Deliverables Inspector */}
      <CodeInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        bookings={bookings}
        onRefreshBookings={refreshBookings}
      />
    </div>
  );
}
