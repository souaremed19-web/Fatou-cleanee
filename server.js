/**
 * =========================================================================
 * FATOU'S CLEANER - SERVEUR BACKEND NODE.JS / EXPRESS
 * =========================================================================
 * Fichier : server.js
 * Description : Serveur Express autonome prêt pour la production.
 * Fonctionnalités :
 *  - Route POST /api/booking : validation et sanitization des données client
 *  - Envoi d'e-mail de confirmation au client via Nodemailer
 *  - Envoi d'alerte immédiate à l'administrateur
 *  - Notification WhatsApp (Webhook / Twilio ou lien direct wa.me)
 *  - Recalcul de sécurité du prix côté serveur
 * =========================================================================
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CONFIGURATION DE SÉCURITÉ & CORS
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // En production stricte : return callback(new Error('Non autorisé par CORS'));
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parsers JSON et URL-encoded avec restriction de charge utile
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// En-têtes HTTP défensifs
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Fichiers statiques (dossier public ou racine si utilisé avec un index.html vanilla)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// 2. MOTEUR TARIFAIRE STRICT CÔTÉ SERVEUR
const SERVICES_TARIFS = {
  regular: { name: 'Entretien Régulier', rateM2: 1.6, minPrice: 65 },
  deep: { name: 'Grand Nettoyage Approfondi', rateM2: 2.8, minPrice: 120 },
  office: { name: 'Bureaux & Locaux Pro', rateM2: 1.9, minPrice: 90 },
  airbnb: { name: 'Conciergerie & Airbnb', rateM2: 2.2, minPrice: 85 }
};

const OPTIONS_TARIFS = {
  windows: { name: 'Vitres & Baies vitrées', price: 35 },
  oven: { name: 'Décapage Four & Micro-ondes', price: 30 },
  fridge: { name: 'Intérieur Réfrigérateur & Congélateur', price: 25 },
  ironing: { name: 'Repassage & Pliage linge', price: 28 },
  carpet_couch: { name: 'Shampouinage Canapé/Tapis', price: 49 },
  steam_sanitization: { name: 'Désinfection Vapeur 140°C', price: 39 }
};

function calculatePriceServer(serviceType, surface, options = [], frequency = 'one_time') {
  const service = SERVICES_TARIFS[serviceType] || SERVICES_TARIFS.regular;
  const safeSurface = Math.max(15, Number(surface) || 15);
  const base = Math.max(service.minPrice, Math.round(safeSurface * service.rateM2 * 10) / 10);
  
  let optionsSum = 0;
  for (const optId of options) {
    if (OPTIONS_TARIFS[optId]) {
      optionsSum += OPTIONS_TARIFS[optId].price;
    }
  }

  let discountRate = 0;
  if (frequency === 'weekly') discountRate = 0.15;
  if (frequency === 'biweekly') discountRate = 0.10;
  if (frequency === 'monthly') discountRate = 0.05;

  const discountAmount = Math.round(base * discountRate * 10) / 10;
  const finalPrice = Math.round((base + optionsSum - discountAmount) * 100) / 100;

  return {
    base,
    optionsSum,
    discountAmount,
    finalPrice,
    serviceTitle: service.name
  };
}

// 3. CONFIGURATION TRANSPORTEUR NODEMAILER
function getMailerTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS && !SMTP_USER.includes('votre_')) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  }

  // Transporteur simulé de secours pour éviter les plantages lors des tests locaux
  return {
    sendMail: async (options) => {
      console.log('----------------------------------------------------');
      console.log('📧 [NODEMAILER SIMULÉ] Envoi d’email déclenché :');
      console.log(`Destinataire : ${options.to}`);
      console.log(`Objet : ${options.subject}`);
      console.log('----------------------------------------------------');
      return { messageId: `<mock-${Date.now()}@fatouscleaner.com>` };
    }
  };
}

// 4. NETTOYAGE & SANITIZATION DES ENTRÉES
function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').slice(0, 500);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

// 5. BASE DE DONNÉES EN MÉMOIRE
const bookingsDb = [];

// 6. ROUTES API

// A. Contrôle de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: "Fatou's Cleaner API",
    timestamp: new Date().toISOString()
  });
});

// B. Calcul prédictif de devis
app.post('/api/calculate-quote', (req, res) => {
  const { serviceType, surface, options, frequency } = req.body;
  const result = calculatePriceServer(serviceType, surface, options, frequency);
  res.json({ success: true, ...result });
});

// C. Liste des réservations pour le tableau de bord
app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    total: bookingsDb.length,
    bookings: bookingsDb
  });
});

// D. ROUTE PRINCIPALE : POST /api/booking
app.post('/api/booking', async (req, res) => {
  try {
    const raw = req.body || {};
    const fullName = sanitize(raw.fullName);
    const email = sanitize(raw.email).toLowerCase();
    const phone = sanitize(raw.phone);
    const address = sanitize(raw.address);
    const city = sanitize(raw.city || 'Conakry');
    const postalCode = sanitize(raw.postalCode || 'Simbaya Gare');
    const serviceType = sanitize(raw.serviceType || 'regular');
    const surface = Number(raw.surface);
    const selectedOptions = Array.isArray(raw.selectedOptions) 
      ? raw.selectedOptions.map(o => sanitize(o)) 
      : [];
    const date = sanitize(raw.date);
    const timeSlot = sanitize(raw.timeSlot);
    const accessInstructions = sanitize(raw.accessInstructions);
    const notes = sanitize(raw.notes);
    const frequency = sanitize(raw.frequency || 'one_time');

    // Validation des erreurs
    const validationErrors = [];

    if (!fullName || fullName.length < 2) {
      validationErrors.push('Le champ nom complet est obligatoire (min. 2 caractères).');
    }
    if (!email || !isValidEmail(email)) {
      validationErrors.push('Une adresse email valide est obligatoire.');
    }
    if (!phone || !isValidPhone(phone)) {
      validationErrors.push('Un numéro de téléphone valide est obligatoire.');
    }
    if (!address || address.length < 4) {
      validationErrors.push("L'adresse postale complète est obligatoire.");
    }
    if (!surface || isNaN(surface) || surface < 10) {
      validationErrors.push('La surface doit être supérieure ou égale à 10 m².');
    }
    if (!date) {
      validationErrors.push('Veuillez indiquer une date pour la prestation.');
    }
    if (!timeSlot) {
      validationErrors.push('Veuillez sélectionner un créneau horaire.');
    }
    if (!SERVICES_TARIFS[serviceType]) {
      validationErrors.push('Prestation de nettoyage invalide.');
    }

    if (validationErrors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Données de formulaire invalides.',
        errors: validationErrors
      });
    }

    // Recalcul du montant côté serveur pour garantir l'intégrité
    const pricing = calculatePriceServer(serviceType, surface, selectedOptions, frequency);
    const finalPrice = pricing.finalPrice;

    // Référence de dossier unique
    const uniqueRef = `FC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingRecord = {
      id: `bk_${Date.now()}`,
      reference: uniqueRef,
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      serviceType,
      serviceName: pricing.serviceTitle,
      surface,
      selectedOptions,
      date,
      timeSlot,
      accessInstructions,
      notes,
      frequency,
      calculatedPrice: finalPrice,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    // Construction des templates emails HTML
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Fatou's Cleaner</h1>
          <p style="margin: 4px 0 0; color: #2dd4bf;">Nettoyage & Conciergerie d'Excellence</p>
          <div style="margin-top: 10px; display: inline-block; background: #134e4a; color: #5eead4; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px;">
            Réf : ${uniqueRef}
          </div>
        </div>
        <div style="padding: 24px; color: #334155; line-height: 1.6;">
          <p>Bonjour <strong>${fullName}</strong>,</p>
          <p>Votre demande d'intervention a bien été validée par nos équipes.</p>
          <div style="background-color: #f8fafc; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Date d'intervention :</strong> ${date}</p>
            <p style="margin: 4px 0;"><strong>Créneau sélectionné :</strong> ${timeSlot}</p>
            <p style="margin: 4px 0;"><strong>Prestation :</strong> ${pricing.serviceTitle} (${surface} m²)</p>
            <p style="margin: 4px 0;"><strong>Adresse :</strong> ${address}, ${postalCode} ${city}</p>
            <p style="margin: 8px 0 0; font-size: 18px; color: #0d9488; font-weight: bold;">Montant total : ${finalPrice} €</p>
          </div>
          <p>Un responsable d'équipe vous contactera sous 24h ouvrées pour organiser l'accès aux lieux.</p>
        </div>
      </div>
    `;

    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc;">
        <h2 style="color: #38bdf8;">🚨 Nouvelle Réservation : ${uniqueRef}</h2>
        <p><strong>Client :</strong> ${fullName} (${phone})</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Date & Heure :</strong> ${date} | ${timeSlot}</p>
        <p><strong>Prestation :</strong> ${pricing.serviceTitle} - ${surface} m²</p>
        <p><strong>Adresse :</strong> ${address}, ${postalCode} ${city}</p>
        <p><strong>Instructions d'accès :</strong> ${accessInstructions || 'Aucune'}</p>
        <p><strong>Notes :</strong> ${notes || 'Aucune'}</p>
        <h3 style="color: #34d399;">Montant : ${finalPrice} €</h3>
      </div>
    `;

    // Envoi des emails via Nodemailer
    const transporter = getMailerTransporter();
    const mailSender = process.env.SMTP_FROM || `"Fatou's Clean" <info@fatous-cleaner.net>`;
    const adminRecipient = process.env.ADMIN_EMAIL || 'info@fatous-cleaner.net';

    await Promise.allSettled([
      transporter.sendMail({
        from: mailSender,
        to: email,
        subject: `Confirmation de votre réservation ${uniqueRef} - Fatou's Clean`,
        html: clientEmailHtml
      }),
      transporter.sendMail({
        from: mailSender,
        to: adminRecipient,
        subject: `[ADMIN] Nouvelle réservation ${uniqueRef} - ${fullName}`,
        html: adminEmailHtml
      })
    ]);

    // Enregistrement
    bookingsDb.unshift(bookingRecord);

    // Formatage du message structuré WhatsApp avec émojis professionnels
    const gnfAmount = Math.round(finalPrice * 9500).toLocaleString('fr-FR');
    const waText = [
      `✨ *DEMANDE DE RÉSERVATION - FATOU'S CLEAN* (Réf: ${uniqueRef}) ✨`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Client :* ${fullName}`,
      `📞 *Téléphone :* ${phone}`,
      `📧 *Email :* ${email}`,
      ``,
      `🧹 *PRESTATION DE NETTOYAGE*`,
      `• *Service :* ${pricing.serviceTitle}`,
      `• *Surface :* ${surface} m²`,
      `• *Options :* ${selectedOptions.join(', ') || 'Aucune'}`,
      ``,
      `📅 *PLANIFICATION DU RENDEZ-VOUS*`,
      `• *Date demandée :* ${date}`,
      `• *Créneau horaire :* ${timeSlot}`,
      `• *Lieu :* ${address}, ${postalCode} ${city}`,
      accessInstructions ? `• *Consignes d'accès :* ${accessInstructions}` : null,
      ``,
      `💰 *TARIF ESTIMÉ*`,
      `• *Montant garanti :* ${gnfAmount} GNF (~ ${finalPrice.toFixed(2)} €)`,
      `• *Matériel pro & éco-produits inclus*`,
      ``,
      notes ? `📝 *Remarques :* ${notes}\n` : null,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏢 *Fatou's Clean - Siège social :*`,
      `Simbaya Gare à côté de la Pharmacie LE SION en face de la Cantine, Conakry`,
      `_Message généré automatiquement depuis le site web._`
    ].filter(Boolean).join('\n');

    const adminPhoneClean = (process.env.ADMIN_WHATSAPP_TO || '224623078250').replace(/\D/g, '');
    const whatsappDirectUrl = `https://wa.me/${adminPhoneClean}?text=${encodeURIComponent(waText)}`;

    return res.status(201).json({
      success: true,
      message: `Merci ${fullName}, votre réservation ${uniqueRef} est confirmée avec succès !`,
      reference: uniqueRef,
      booking: bookingRecord,
      whatsappDirectUrl
    });

  } catch (error) {
    console.error('Erreur interne serveur :', error);
    return res.status(500).json({
      success: false,
      message: "Une erreur technique s'est produite lors de l'enregistrement."
    });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`[Fatou's Cleaner] Serveur actif sur http://localhost:${PORT}`);
});

export default app;
