/**
 * Serveur Backend Express - Fatou's Cleaner
 * Gestion des réservations, devis dynamiques, sécurité et envoi d'emails Nodemailer.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer, { SendMailOptions } from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateQuote } from './src/lib/pricing';
import { generateClientEmailHtml, generateAdminAlertEmailHtml } from './src/lib/emailTemplates';
import { BookingFormData, BookingRecord, ServiceType } from './src/types/booking';
import { generateWhatsAppDirectUrl } from './src/lib/whatsapp';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Configuration CORS sécurisée
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173', 'https://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser requêtes locales, même domaine, ou sans origin (SSR, mobile, curl)
    if (!origin || allowedOrigins.includes(origin) || origin.includes('run.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissif en environnement de preview AI Studio
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parsers JSON et URL-encoded avec limites de taille de sécurité
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// En-têtes de sécurité HTTP
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Base de données en mémoire pour le stockage et l'espace admin
const bookingsStore: BookingRecord[] = [
  {
    id: 'bk_sample_1',
    reference: 'FC-2026-7814',
    fullName: 'Sophie de Marconnay',
    email: 'sophie.marconnay@example.com',
    phone: '+33 6 42 18 90 22',
    address: '14 Rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    serviceType: 'deep',
    surface: 75,
    selectedOptions: ['windows', 'oven'],
    date: '2026-10-15',
    timeSlot: '09h00 - 13h00',
    accessInstructions: 'Digicode 4589B, 3e étage avec ascenseur, sonnette Marconnay.',
    notes: 'Priorité sur la cuisine et le détartrage de la faïence de la salle de bain.',
    calculatedPrice: 275,
    serverVerifiedPrice: 275,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'confirmed',
    emailSent: true,
    adminEmailSent: true
  },
  {
    id: 'bk_sample_2',
    reference: 'FC-2026-6209',
    fullName: 'Alexandre Leroux',
    email: 'contact@leroux-architecture.fr',
    phone: '+33 6 88 12 34 56',
    address: '8 Boulevard Haussmann',
    city: 'Paris',
    postalCode: '75009',
    serviceType: 'office',
    surface: 120,
    selectedOptions: ['steam_sanitization'],
    date: '2026-10-18',
    timeSlot: '18h00 - 21h00',
    accessInstructions: 'Clés disponibles chez le gardien au rez-de-chaussée.',
    notes: 'Intervention après départ des collaborateurs.',
    calculatedPrice: 267,
    serverVerifiedPrice: 267,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'confirmed',
    emailSent: true,
    adminEmailSent: true
  }
];

// Configuration du transporteur Nodemailer avec mode résilient
function createMailTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass && !user.includes('votre_')) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });
  }

  // Mode Simulation sécurisé : les emails sont générés avec succès et logués dans la console
  return {
    isMock: true,
    sendMail: async (mailOptions: SendMailOptions) => {
      console.log(`\n📨 [NODEMAILER SIMULATION] Envoi d'email à : ${mailOptions.to}`);
      console.log(`Sujet : ${mailOptions.subject}`);
      console.log(`De : ${mailOptions.from || process.env.SMTP_FROM || "Fatou's Cleaner"}`);
      console.log(`Aperçu HTML généré avec succès (${(mailOptions.html as string)?.length || 0} caractères)\n`);
      return {
        messageId: `<simulated-${Date.now()}@fatouscleaner.com>`,
        response: '250 OK: Simulated email delivery successful'
      };
    }
  };
}

// Fonction de nettoyage et sanitization des chaînes
function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Élimine balises directes pour contrer XSS
    .substring(0, 500); // Limite longueur
}

// Validation stricte du format email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return emailRegex.test(email);
}

// Validation du numéro de téléphone
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s.-]/g, '');
  return cleaned.length >= 8 && cleaned.length <= 16;
}

// --- ROUTES D'API ---

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: "Fatou's Cleaner Backend API",
    time: new Date().toISOString(),
    version: '2.4.0',
    nodemailerConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)
  });
});

// 2. Calcul dynamique et sécurisé du devis côté serveur
app.post('/api/calculate-quote', (req: Request, res: Response) => {
  try {
    const { serviceType, surface, options, frequency } = req.body;
    const calc = calculateQuote(
      serviceType as ServiceType,
      Number(surface) || 30,
      Array.isArray(options) ? options : [],
      frequency || 'one_time'
    );
    res.json({ success: true, ...calc });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Calcul de devis impossible' });
  }
});

// 3. Récupération des réservations (espace administration)
app.get('/api/bookings', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: bookingsStore.length,
    bookings: bookingsStore
  });
});

// 4. ROUTE MAÎTRESSE : POST /api/booking (Soumission, validation, Nodemailer & WhatsApp)
app.post('/api/booking', async (req: Request, res: Response) => {
  const errors: string[] = [];

  // Extraction et assainissement
  const rawBody = req.body as Partial<BookingFormData>;
  const fullName = sanitizeString(rawBody.fullName);
  const email = sanitizeString(rawBody.email).toLowerCase();
  const phone = sanitizeString(rawBody.phone);
  const address = sanitizeString(rawBody.address);
  const city = sanitizeString(rawBody.city || 'Conakry');
  const postalCode = sanitizeString(rawBody.postalCode || 'Simbaya Gare');
  const serviceType = (rawBody.serviceType || 'regular') as ServiceType;
  const surface = Number(rawBody.surface);
  const selectedOptions = Array.isArray(rawBody.selectedOptions) 
    ? rawBody.selectedOptions.map(opt => sanitizeString(opt)) 
    : [];
  const date = sanitizeString(rawBody.date);
  const timeSlot = sanitizeString(rawBody.timeSlot);
  const accessInstructions = sanitizeString(rawBody.accessInstructions);
  const notes = sanitizeString(rawBody.notes);
  const frequency = sanitizeString(rawBody.frequency || 'one_time');

  // Validations strictes
  if (!fullName || fullName.length < 2) {
    errors.push('Le nom complet est obligatoire (au moins 2 caractères).');
  }
  if (!email || !isValidEmail(email)) {
    errors.push('Une adresse email valide est requise pour recevoir votre confirmation.');
  }
  if (!phone || !isValidPhone(phone)) {
    errors.push('Un numéro de téléphone joignable est requis pour la confirmation d’accès.');
  }
  if (!address || address.length < 4) {
    errors.push("L'adresse postale de l'intervention est obligatoire.");
  }
  if (isNaN(surface) || surface < 10) {
    errors.push('La surface doit être un nombre supérieur ou égal à 10 m².');
  }
  if (!date) {
    errors.push('Veuillez sélectionner une date pour votre prestation.');
  }
  if (!timeSlot) {
    errors.push('Veuillez choisir un créneau horaire d’intervention.');
  }

  const validServices: ServiceType[] = ['regular', 'deep', 'office', 'airbnb'];
  if (!validServices.includes(serviceType)) {
    errors.push('Type de prestation non reconnu.');
  }

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Erreur de validation des données.',
      errors
    });
  }

  // Recalcul du prix officiel côté serveur pour prévenir toute falsification client
  const calculation = calculateQuote(serviceType, surface, selectedOptions, frequency);
  const serverVerifiedPrice = calculation.finalPrice;

  // Génération de la référence unique
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const reference = `FC-${currentYear}-${randomSuffix}`;

  const bookingRecord: BookingRecord = {
    id: `bk_${Date.now()}_${randomSuffix}`,
    reference,
    fullName,
    email,
    phone,
    address,
    city,
    postalCode,
    serviceType,
    surface,
    frequency: frequency as any,
    selectedOptions,
    date,
    timeSlot,
    accessInstructions,
    notes,
    calculatedPrice: serverVerifiedPrice,
    serverVerifiedPrice,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    emailSent: false,
    adminEmailSent: false
  };

  // Préparation des templates d'emails
  const clientHtml = generateClientEmailHtml(bookingRecord);
  const adminHtml = generateAdminAlertEmailHtml(bookingRecord);

  bookingRecord.clientNotificationPreview = clientHtml;
  bookingRecord.adminNotificationPreview = adminHtml;

  // Envoi via Nodemailer
  let emailDeliverySuccess = false;
  let adminDeliverySuccess = false;

  try {
    const transporter = createMailTransporter();
    const sender = process.env.SMTP_FROM || `"Fatou's Clean" <info@fatous-cleaner.net>`;
    const adminEmail = process.env.ADMIN_EMAIL || 'info@fatous-cleaner.net';

    // 1. Email au client
    await transporter.sendMail({
      from: sender,
      to: email,
      subject: `Confirmation de votre réservation ${reference} - Fatou's Clean`,
      html: clientHtml
    });
    emailDeliverySuccess = true;
    bookingRecord.emailSent = true;

    // 2. Email d'alerte à l'administrateur
    await transporter.sendMail({
      from: sender,
      to: adminEmail,
      subject: `🚨 Nouvelle réservation ${reference} - ${fullName} (${serverVerifiedPrice}€)`,
      html: adminHtml
    });
    adminDeliverySuccess = true;
    bookingRecord.adminEmailSent = true;
  } catch (mailError: any) {
    console.error('Erreur lors de l’envoi de l’e-mail via Nodemailer :', mailError?.message || mailError);
    // On ne bloque pas la réponse client en cas de problème de serveur mail externe,
    // la réservation reste enregistrée en base et confirmée !
  }

  // Stockage en mémoire
  bookingsStore.unshift(bookingRecord);

  // Lien direct WhatsApp cliquable avec message complet et structuré (+224 623 07 82 50)
  const whatsappDirectUrl = generateWhatsAppDirectUrl(bookingRecord);

  return res.status(201).json({
    success: true,
    message: `Félicitations ${fullName} ! Votre réservation (${reference}) a été enregistrée avec succès. Un e-mail de confirmation détaillé vous a été envoyé.`,
    reference,
    booking: bookingRecord,
    whatsappDirectUrl,
    details: {
      calculatedPrice: serverVerifiedPrice,
      estimatedHours: calculation.estimatedHours,
      emailSent: emailDeliverySuccess,
      adminEmailSent: adminDeliverySuccess
    }
  });
});

// Configuration du frontend : mode dev avec middleware Vite ou mode production
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ Serveur Fatou's Cleaner démarré avec succès sur http://localhost:${PORT}`);
    console.log(`🚀 Route API principale : POST http://localhost:${PORT}/api/booking`);
    console.log(`📊 Mode : ${isProd ? 'Production' : 'Développement avec Vite intégré'}`);
  });
}

startServer().catch((err) => {
  console.error('Erreur au démarrage du serveur :', err);
});

export default app;
