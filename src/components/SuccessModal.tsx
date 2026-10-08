import React from 'react';
import { CheckCircle2, MessageSquare, Mail, Calendar, MapPin, X, Printer, Phone } from 'lucide-react';
import { BookingRecord } from '../types/booking';
import { COMPANY_INFO } from '../lib/companyInfo';
import { Logo } from './Logo';

interface SuccessModalProps {
  booking: BookingRecord | null;
  whatsappUrl?: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  booking,
  whatsappUrl,
  onClose
}) => {
  if (!booking) return null;

  const GNF_RATE = 9500;
  const priceGnf = Math.round(booking.calculatedPrice * GNF_RATE);

  return (
    <div 
      id="bookingSuccessModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden">
        
        {/* Green top accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#16a34a]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
          <div className="mb-3">
            <Logo size="lg" showText={false} />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#16a34a] font-extrabold">Réservation Confirmée</span>
          <h3 className="text-2xl font-black text-[#064e3b] mt-1">Merci pour votre confiance !</h3>
          <p className="text-sm text-slate-600 mt-1">
            Votre dossier <strong className="text-[#16a34a] modal-booking-ref">{booking.reference}</strong> a été validé avec succès par Fatou's Clean.
          </p>
        </div>

        {/* Booking Card Recap in White & Vert */}
        <div className="my-6 bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs text-slate-500">Client :</span>
            <span className="font-bold text-[#064e3b] modal-booking-name">{booking.fullName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Intervention :</span>
            </span>
            <span className="font-bold text-[#16a34a]">
              {booking.date} ({booking.timeSlot})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Lieu :</span>
            </span>
            <span className="font-semibold text-slate-800 truncate max-w-[260px]">
              {booking.address}, {booking.postalCode} {booking.city}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-base">
            <span className="text-xs text-slate-500">Total garanti :</span>
            <div className="text-right">
              <span className="font-black text-[#064e3b] text-lg">
                {priceGnf.toLocaleString('fr-FR')} GNF
              </span>
              <span className="text-xs text-slate-500 ml-1.5">
                (~ {booking.calculatedPrice.toFixed(2)} €)
              </span>
            </div>
          </div>
        </div>

        {/* Email & Contact Notice */}
        <div className="space-y-2 mb-6 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b]">
            <Mail className="w-4.5 h-4.5 text-[#16a34a] shrink-0" />
            <span>
              Un e-mail de confirmation détaillé vous a été envoyé à <strong>{booking.email}</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
            <Phone className="w-4.5 h-4.5 text-[#16a34a] shrink-0" />
            <span>
              Besoin d'un renseignement immédiat ? Contactez notre siège au <strong>{COMPANY_INFO.phone}</strong>.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-whatsapp-link flex-1 py-3 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Ouvrir sur WhatsApp Direct</span>
            </a>
          )}

          <button
            onClick={() => window.print()}
            className="px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
