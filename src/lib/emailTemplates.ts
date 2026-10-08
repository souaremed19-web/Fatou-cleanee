/**
 * Templates HTML professionnels pour Nodemailer
 * 1. Email de confirmation envoyé au Client (Vert & Blanc)
 * 2. Email d'alerte instantanée envoyé à l'Administrateur Fatou's Clean (Vert & Blanc)
 */

import { BookingRecord } from '../types/booking';
import { SERVICES_CATALOG, PRICING_OPTIONS } from './pricing';
import { COMPANY_INFO } from './companyInfo';

const GNF_RATE = 9500;

export function generateClientEmailHtml(booking: BookingRecord): string {
  const service = SERVICES_CATALOG[booking.serviceType] || { title: booking.serviceType };
  const optionNames = booking.selectedOptions
    .map(id => PRICING_OPTIONS.find(o => o.id === id)?.name || id)
    .join(', ');

  const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const priceGnf = Math.round(booking.calculatedPrice * GNF_RATE);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de votre réservation - Fatou's Clean</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 0; color: #1e293b; line-height: 1.6; }
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #bbf7d0; box-shadow: 0 10px 30px rgba(22,163,74,0.1); }
    .header { background: linear-gradient(135deg, #064e3b 0%, #16a34a 50%, #22c55e 100%); padding: 36px 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 14px; color: #dcfce7; font-weight: 500; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); border: 1px solid #ffffff; color: #ffffff; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-top: 14px; }
    .content { padding: 32px; }
    .card { background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 16px; padding: 22px; margin-bottom: 24px; }
    .card-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #16a34a; margin-top: 0; margin-bottom: 14px; font-weight: 800; }
    .grid { display: flex; flex-wrap: wrap; margin-bottom: 8px; }
    .grid-item { flex: 1 1 50%; min-width: 200px; margin-bottom: 12px; }
    .grid-label { font-size: 12px; color: #64748b; margin-bottom: 2px; }
    .grid-value { font-size: 15px; font-weight: 700; color: #064e3b; }
    .price-box { background: #f0fdf4; border: 2px solid #86efac; border-radius: 16px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; margin: 24px 0; }
    .price-label { font-size: 14px; font-weight: 700; color: #064e3b; }
    .price-amount { font-size: 24px; font-weight: 900; color: #16a34a; }
    .cta-btn { display: inline-block; background: #16a34a; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; text-align: center; }
    .footer { background: #064e3b; padding: 26px 32px; text-align: center; font-size: 12px; color: #dcfce7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Fatou's Clean</h1>
      <p>Nettoyage Professionnel & Conciergerie de Standing · Conakry 🇬🇳</p>
      <div class="badge">Dossier Réf : ${booking.reference}</div>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Bonjour <strong>${escapeHtml(booking.fullName)}</strong>,</p>
      <p>Votre demande d'intervention a été validée avec succès par nos équipes à Conakry. Nos agents qualifiés préparent votre prestation avec du matériel professionnel et des produits neutres éco-certifiés.</p>
      
      <div class="card">
        <div class="card-title">Détails de l'intervention</div>
        <div class="grid">
          <div class="grid-item">
            <div class="grid-label">Date prévue</div>
            <div class="grid-value" style="text-transform: capitalize;">${formattedDate}</div>
          </div>
          <div class="grid-item">
            <div class="grid-label">Créneau horaire</div>
            <div class="grid-value">${escapeHtml(booking.timeSlot)}</div>
          </div>
          <div class="grid-item">
            <div class="grid-label">Prestation</div>
            <div class="grid-value">${escapeHtml(service.title)}</div>
          </div>
          <div class="grid-item">
            <div class="grid-label">Surface déclarée</div>
            <div class="grid-value">${booking.surface} m²</div>
          </div>
        </div>

        ${optionNames ? `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #bbf7d0;">
          <div class="grid-label">Options sélectionnées</div>
          <div class="grid-value" style="font-size: 14px; font-weight: 600; color: #16a34a;">${escapeHtml(optionNames)}</div>
        </div>` : ''}

        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #bbf7d0;">
          <div class="grid-label">Lieu d'intervention</div>
          <div class="grid-value" style="font-size: 14px;">${escapeHtml(booking.address)}, ${escapeHtml(booking.postalCode)} ${escapeHtml(booking.city)}</div>
        </div>
      </div>

      <div class="price-box">
        <div>
          <div class="price-label">Tarif garanti</div>
          <div style="font-size: 12px; color: #16a34a;">Produits & matériel pro inclus</div>
        </div>
        <div style="text-align: right;">
          <div class="price-amount">${priceGnf.toLocaleString('fr-FR')} GNF</div>
          <div style="font-size: 12px; color: #64748b;">(~ ${booking.calculatedPrice.toFixed(2)} €)</div>
        </div>
      </div>

      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="${COMPANY_INFO.whatsappUrl}" class="cta-btn">
          💬 Joindre notre équipe sur WhatsApp
        </a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0; color: #ffffff; font-weight: 700;">Fatou's Clean - Réseau d'Agences en Guinée 🇬🇳</p>
      <p style="margin: 0 0 4px 0;">• Siège National : Simbaya Gare (face Cantine), Conakry</p>
      <p style="margin: 0 0 4px 0;">• Siège Régional : Précisément à Foulayah, Kindia</p>
      <p style="margin: 0 0 6px 0;">• Agence Régionale : Auprès de la Gare Voiture, Mamou</p>
      <p style="margin: 0;">Téléphone : ${COMPANY_INFO.phone} · Email : ${COMPANY_INFO.email}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateAdminAlertEmailHtml(booking: BookingRecord): string {
  const service = SERVICES_CATALOG[booking.serviceType] || { title: booking.serviceType };
  const optionNames = booking.selectedOptions
    .map(id => PRICING_OPTIONS.find(o => o.id === id)?.name || id)
    .join(', ');

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${booking.address}, ${booking.postalCode} ${booking.city}`)}`;
  const phoneClean = booking.phone.replace(/[^0-9+]/g, '');
  const priceGnf = Math.round(booking.calculatedPrice * GNF_RATE);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Alerte Admin - Nouvelle Réservation Fatou's Clean</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #064e3b; color: #f8fafc; padding: 20px; }
    .box { max-width: 650px; margin: 0 auto; background: #065f46; border-radius: 16px; padding: 26px; border: 1px solid #10b981; }
    .badge { background: #10b981; color: #fff; padding: 5px 12px; border-radius: 8px; font-weight: bold; font-size: 13px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #047857; padding-bottom: 8px; font-size: 14px; }
    .label { color: #a7f3d0; }
    .val { font-weight: 600; color: #ffffff; text-align: right; }
    .highlight { color: #34d399; font-weight: 800; font-size: 20px; }
    .btn { display: inline-block; padding: 9px 16px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; margin-right: 8px; margin-top: 10px; }
    .btn-call { background: #10b981; color: #fff; }
    .btn-maps { background: #334155; color: #fff; }
    .btn-wa { background: #22c55e; color: #fff; }
  </style>
</head>
<body>
  <div class="box">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #a7f3d0;">⚡ NOUVELLE RÉSERVATION - FATOU'S CLEAN</h2>
      <span class="badge">${booking.reference}</span>
    </div>

    <div class="row">
      <span class="label">Client :</span>
      <span class="val">${escapeHtml(booking.fullName)}</span>
    </div>
    <div class="row">
      <span class="label">Téléphone :</span>
      <span class="val"><a href="tel:${phoneClean}" style="color: #6ee7b7;">${escapeHtml(booking.phone)}</a></span>
    </div>
    <div class="row">
      <span class="label">Email :</span>
      <span class="val"><a href="mailto:${escapeHtml(booking.email)}" style="color: #6ee7b7;">${escapeHtml(booking.email)}</a></span>
    </div>
    <div class="row">
      <span class="label">Date & Heure :</span>
      <span class="val">${escapeHtml(booking.date)} (${escapeHtml(booking.timeSlot)})</span>
    </div>
    <div class="row">
      <span class="label">Type de service :</span>
      <span class="val">${escapeHtml(service.title)}</span>
    </div>
    <div class="row">
      <span class="label">Surface :</span>
      <span class="val">${booking.surface} m²</span>
    </div>
    <div class="row">
      <span class="label">Options choisies :</span>
      <span class="val">${escapeHtml(optionNames || 'Aucune')}</span>
    </div>
    <div class="row">
      <span class="label">Lieu d'intervention :</span>
      <span class="val">${escapeHtml(booking.address)}, ${escapeHtml(booking.postalCode)} ${escapeHtml(booking.city)}</span>
    </div>
    <div class="row">
      <span class="label">Consignes d'accès :</span>
      <span class="val">${escapeHtml(booking.accessInstructions || 'Non précisé')}</span>
    </div>
    <div class="row" style="border-bottom: none; margin-top: 16px;">
      <span class="label" style="font-size: 16px;">Total Calculé :</span>
      <span class="highlight">${priceGnf.toLocaleString('fr-FR')} GNF (~ ${booking.calculatedPrice.toFixed(2)} €)</span>
    </div>

    <div style="margin-top: 24px;">
      <a href="tel:${phoneClean}" class="btn btn-call">📞 Appeler Client</a>
      <a href="${googleMapsUrl}" target="_blank" class="btn btn-maps">📍 Voir sur Maps</a>
      <a href="https://wa.me/${phoneClean.replace('+', '')}?text=${encodeURIComponent(`Bonjour ${booking.fullName}, Fatou's Clean vous confirme l'intervention du ${booking.date} (${booking.timeSlot}).`)}" target="_blank" class="btn btn-wa">💬 WhatsApp Client</a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
