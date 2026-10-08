/**
 * Module d'intégration WhatsApp - Fatou's Clean
 * Génération et encodage du message structuré pour WhatsApp Click-to-Chat
 */

import { COMPANY_INFO } from './companyInfo';
import { SERVICES_CATALOG, PRICING_OPTIONS } from './pricing';
import { BookingFormData } from '../types/booking';

export const OFFICIAL_WHATSAPP_NUMBER = '224623078250'; // +224 623 07 82 50 sans espace ni '+'
export const GNF_EXCHANGE_RATE = 9500;

/**
 * Formate le prix en Francs Guinéens (GNF)
 */
export function formatPriceGNF(priceEur: number): string {
  const gnf = Math.round(priceEur * GNF_EXCHANGE_RATE);
  return `${gnf.toLocaleString('fr-FR')} GNF`;
}

/**
 * Construit un message WhatsApp structuré avec émojis professionnels
 */
export function buildWhatsAppBookingMessage(data: Partial<BookingFormData> & { reference?: string }): string {
  const serviceName = data.serviceType 
    ? (SERVICES_CATALOG[data.serviceType]?.title || data.serviceType)
    : 'Entretien de standing';

  const optionsNames = (data.selectedOptions && data.selectedOptions.length > 0)
    ? data.selectedOptions.map(id => PRICING_OPTIONS.find(o => o.id === id)?.name || id).join(', ')
    : 'Aucune option additionnelle';

  const priceEur = Number(data.calculatedPrice) || 0;
  const priceGNF = formatPriceGNF(priceEur);

  const refText = data.reference ? ` (Réf: ${data.reference})` : '';

  const lines = [
    `✨ *DEMANDE DE RÉSERVATION - FATOU'S CLEAN*${refText} ✨`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Client :* ${data.fullName || 'Non précisé'}`,
    `📞 *Téléphone :* ${data.phone || 'Non précisé'}`,
    `📧 *Email :* ${data.email || 'Non précisé'}`,
    ``,
    `🧹 *PRESTATION DE NETTOYAGE*`,
    `• *Service :* ${serviceName}`,
    `• *Surface :* ${data.surface || 30} m²`,
    `• *Options choisies :* ${optionsNames}`,
    ``,
    `📅 *PLANIFICATION DU PASSAGE*`,
    `• *Date souhaitée :* ${data.date || 'Dès que possible'}`,
    `• *Créneau horaire :* ${data.timeSlot || '08h00 - 12h00'}`,
    `• *Lieu :* ${data.address || 'Conakry'}${data.city ? `, ${data.city}` : ''}${data.postalCode ? ` (${data.postalCode})` : ''}`,
    data.accessInstructions ? `• *Consignes d'accès :* ${data.accessInstructions}` : null,
    ``,
    `💰 *TARIF ESTIMÉ*`,
    `• *Montant Garanti :* ${priceGNF} (~ ${priceEur.toFixed(2)} €)`,
    ``,
    data.notes ? `📝 *Remarques :* ${data.notes}\n` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🏢 *Fatou's Clean - Réseau en Guinée 🇬🇳 :*`,
    `• *Siège Conakry :* Simbaya Gare (face Cantine, à côté Pharmacie LE SION)`,
    `• *Siège Kindia :* Précisément à Foulayah`,
    `• *Agence Mamou :* Auprès de la Gare Voiture`,
    `_Message transmis automatiquement depuis le site web._`
  ].filter(line => line !== null);

  return lines.join('\n');
}

/**
 * Génère le lien direct Click-to-Chat vers WhatsApp (wa.me)
 */
export function generateWhatsAppDirectUrl(
  data: Partial<BookingFormData> & { reference?: string },
  phoneNumber: string = OFFICIAL_WHATSAPP_NUMBER
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const message = buildWhatsAppBookingMessage(data);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
