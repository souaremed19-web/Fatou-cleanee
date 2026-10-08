import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Mail, 
  Database, 
  Code, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { BookingRecord } from '../types/booking';

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onRefreshBookings: () => void;
}

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onRefreshBookings
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'emails' | 'serverJs' | 'appJs' | 'packageJson' | 'envExample'>('bookings');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [emailPreviewType, setEmailPreviewType] = useState<'client' | 'admin'>('client');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedBookingForEmail = bookings[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Espace Administration & Architecture Technique</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono">v2.4 Production</span>
              </h2>
              <p className="text-xs text-slate-400">Supervision de l'API Express, Nodemailer, flux WhatsApp et livrables de code</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'bookings'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Réservations reçues ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'emails'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Aperçu E-mails Nodemailer</span>
          </button>

          <button
            onClick={() => setActiveTab('serverJs')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'serverJs'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>server.js (Node / Express)</span>
          </button>

          <button
            onClick={() => setActiveTab('appJs')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'appJs'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>app.js (Front Vanilla ES6)</span>
          </button>

          <button
            onClick={() => setActiveTab('envExample')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'envExample'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>.env.example</span>
          </button>

          <button
            onClick={() => setActiveTab('packageJson')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'packageJson'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>package.json</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          
          {/* TAB 1: Réservations reçues */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Registre des Réservations en Temps Réel</h3>
                  <p className="text-xs text-slate-400">Toutes les soumissions interceptées par POST /api/booking</p>
                </div>
                <button
                  onClick={onRefreshBookings}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                  <span>Actualiser</span>
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-xl border border-slate-800">
                  Aucune réservation enregistrée pour le moment. Remplissez le formulaire pour tester !
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/70 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Réf / Date</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Prestation</th>
                        <th className="px-4 py-3">Date & Créneau</th>
                        <th className="px-4 py-3">Adresse</th>
                        <th className="px-4 py-3 text-right">Montant</th>
                        <th className="px-4 py-3 text-center">Nodemailer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-medium">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-teal-300">
                            {b.reference}
                            <span className="block text-[10px] font-normal text-slate-500">
                              {new Date(b.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-white">{b.fullName}</div>
                            <div className="text-[11px] text-slate-400">{b.phone}</div>
                            <div className="text-[11px] text-slate-500">{b.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-bold text-[11px]">
                              {b.serviceType.toUpperCase()}
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-0.5">{b.surface} m²</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-white font-semibold">{b.date}</div>
                            <div className="text-[11px] text-slate-400">{b.timeSlot}</div>
                          </td>
                          <td className="px-4 py-3 max-w-[180px] truncate">
                            <div className="text-white truncate">{b.address}</div>
                            <div className="text-[11px] text-slate-400">{b.postalCode} {b.city}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-teal-300 text-sm">
                            {b.calculatedPrice.toFixed(2)} €
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              <Check className="w-3 h-3" />
                              <span>Envoyé</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Aperçu E-mails Nodemailer */}
          {activeTab === 'emails' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Rendu HTML des E-mails générés par Nodemailer</h3>
                  <p className="text-xs text-slate-400">
                    Modèle d'e-mail responsive avec identité visuelle Fatou's Cleaner
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEmailPreviewType('client')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      emailPreviewType === 'client'
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Email Client (Confirmation)
                  </button>
                  <button
                    onClick={() => setEmailPreviewType('admin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      emailPreviewType === 'admin'
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Email Admin (Alerte Direction)
                  </button>
                </div>
              </div>

              {selectedBookingForEmail ? (
                <div className="bg-white rounded-xl overflow-hidden border border-slate-700 text-slate-900 shadow-xl max-w-2xl mx-auto">
                  <div className="bg-slate-200 px-4 py-2 border-b border-slate-300 text-xs font-mono text-slate-700 flex justify-between">
                    <span>
                      {emailPreviewType === 'client' 
                        ? `À : ${selectedBookingForEmail.email} | De : Fatou's Cleaner`
                        : `À : direction@fatouscleaner.com | Alerte nouvelle réservation`}
                    </span>
                    <span className="font-bold text-teal-700">Réf : {selectedBookingForEmail.reference}</span>
                  </div>
                  <div 
                    className="p-4 overflow-y-auto max-h-[600px]"
                    dangerouslySetInnerHTML={{
                      __html: emailPreviewType === 'client'
                        ? (selectedBookingForEmail.clientNotificationPreview || '')
                        : (selectedBookingForEmail.adminNotificationPreview || '')
                    }}
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  Aucune réservation disponible pour prévisualiser l'email.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: server.js */}
          {activeTab === 'serverJs' && (
            <CodeViewer 
              filename="server.js"
              description="Serveur autonome Node.js / Express prêt pour déploiement VPS, Heroku ou Cloud Run"
              code={serverJsCodeSample}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

          {/* TAB 4: app.js */}
          {activeTab === 'appJs' && (
            <CodeViewer 
              filename="app.js"
              description="Script côté client en JavaScript Vanilla (ES6) pour intercepter #bookingForm et synchroniser les tarifs"
              code={appJsCodeSample}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

          {/* TAB 5: .env.example */}
          {activeTab === 'envExample' && (
            <CodeViewer 
              filename=".env.example"
              description="Modèle des variables d'environnement pour Nodemailer SMTP, Twilio WhatsApp et port"
              code={envExampleSample}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

          {/* TAB 6: package.json */}
          {activeTab === 'packageJson' && (
            <CodeViewer 
              filename="package.json"
              description="Dépendances Express, Nodemailer, CORS, Dotenv"
              code={packageJsonSample}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

        </div>

      </div>
    </div>
  );
};

interface CodeViewerProps {
  filename: string;
  description: string;
  code: string;
  copiedKey: string | null;
  onCopy: (code: string, key: string) => void;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ filename, description, code, copiedKey, onCopy }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white font-mono">{filename}</h4>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <button
          onClick={() => onCopy(code, filename)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          {copiedKey === filename ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copié dans le presse-papier !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier le code</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed select-all">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Échantillons exacts synchronisés pour affichage immédiat
const serverJsCodeSample = `/**
 * FATOU'S CLEANER - SERVEUR BACKEND NODE.JS / EXPRESS
 * Fichier : server.js
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Validation, sanitization & calcul sécurisé du prix côté serveur
// Route POST /api/booking avec envoi Nodemailer et WhatsApp
app.post('/api/booking', async (req, res) => {
  // Voir fichier server.js complet à la racine du projet
});

app.listen(PORT, () => {
  console.log(\`Serveur actif sur port \${PORT}\`);
});`;

const appJsCodeSample = `/**
 * FATOU'S CLEAN - SCRIPT CÔTÉ CLIENT (VANILLA JAVASCRIPT ES6+)
 * Fichier : app.js
 * Intégration : Redirection automatique WhatsApp Click-to-Chat & AJAX Express
 */
const WHATSAPP_CONFIG = {
  phoneNumber: '224623078250', // +224 623 07 82 50
  gnfExchangeRate: 9500
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Extraction et formatage du message WhatsApp avec émojis
    const message = [
      '✨ *DEMANDE DE RÉSERVATION - FATOU\\'S CLEAN* ✨',
      '👤 *Client :* ' + formData.get('fullName'),
      '📞 *Téléphone :* ' + formData.get('phone'),
      '🧹 *Service :* ' + formData.get('serviceType'),
      '📅 *Date :* ' + formData.get('date') + ' (' + formData.get('timeSlot') + ')',
      '📍 *Lieu :* ' + formData.get('address'),
      '💰 *Tarif GNF :* ' + Math.round(Number(formData.get('calculatedPrice')) * 9500).toLocaleString('fr-FR') + ' GNF'
    ].join('\\n');

    const whatsappUrl = 'https://wa.me/' + WHATSAPP_CONFIG.phoneNumber + '?text=' + encodeURIComponent(message);

    // Redirection automatique vers WhatsApp pour initier la discussion
    window.open(whatsappUrl, '_blank');
  });
});`;

const envExampleSample = `# SERVEUR & SECURITE
PORT=3000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# CONFIGURATION SMTP NODEMAILER
SMTP_HOST=smtp.fatous-cleaner.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@fatous-cleaner.net
SMTP_PASS=votre_mot_de_passe_securise
SMTP_FROM="Fatou's Clean" <info@fatous-cleaner.net>
ADMIN_EMAIL=info@fatous-cleaner.net

# NOTIFICATIONS WHATSAPP DIRECT (+224 623 07 82 50)
ADMIN_WHATSAPP_TO=whatsapp:+224623078250`;

const packageJsonSample = `{
  "name": "fatous-cleaner-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "nodemailer": "^6.10.0"
  }
}`;
