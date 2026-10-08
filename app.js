/**
 * =========================================================================
 * FATOU'S CLEAN - LOGIQUE FRONT-END CLIENT (JAVASCRIPT VANILLA ES6+)
 * =========================================================================
 * Fichier : app.js
 * Description : 
 *  1. Calculateur dynamique de devis (m², prestations, options, devises GNF & EUR)
 *  2. Galerie interactive Avant/Après avec slider
 *  3. Capture de la soumission du formulaire #bookingForm
 *  4. Formatage d'un message WhatsApp professionnel et structuré
 *  5. Redirection automatique Click-to-Chat vers WhatsApp (https://wa.me/224623078250)
 *  6. Envoi asynchrone AJAX au serveur Express (/api/booking) & Nodemailer
 * =========================================================================
 */

// Configuration officielle Fatou's Clean
const WHATSAPP_CONFIG = {
  phoneNumber: '224623078250', // +224 623 07 82 50 sans espace ni symbole '+'
  gnfExchangeRate: 9500,        // 1 € ≈ 9 500 GNF
  officeAddress: 'Simbaya Gare à côté de la Pharmacie LE SION en face de la Cantine, Conakry'
};

document.addEventListener('DOMContentLoaded', () => {
  initPricingCalculator();
  initBeforeAfterSliders();
  initBookingForm();
});

/**
 * -------------------------------------------------------------------------
 * 1. CALCULATEUR DYNAMIQUE DE TARIF EN TEMPS RÉEL
 * -------------------------------------------------------------------------
 */
function initPricingCalculator() {
  const surfaceInput = document.getElementById('calcSurface');
  const surfaceDisplay = document.getElementById('calcSurfaceDisplay');
  const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
  const optionCheckboxes = document.querySelectorAll('input[name="calcOption"], input[name="options"]');
  const frequencyRadios = document.querySelectorAll('input[name="frequency"]');

  const priceDisplay = document.getElementById('calcTotalPrice');
  const priceDisplayGnf = document.getElementById('calcTotalPriceGnf');
  const hoursDisplay = document.getElementById('calcEstimatedHours');

  // Catalogue des tarifs de base (en EUR)
  const serviceRates = {
    regular: { name: 'Entretien Régulier', rate: 1.6, min: 65, speedM2PerHour: 35 },
    deep: { name: 'Grand Nettoyage Approfondi', rate: 2.8, min: 120, speedM2PerHour: 25 },
    office: { name: 'Bureaux & Locaux Pro', rate: 1.9, min: 90, speedM2PerHour: 40 },
    airbnb: { name: 'Conciergerie & Airbnb', rate: 2.2, min: 85, speedM2PerHour: 30 }
  };

  const optionPrices = {
    windows: { name: 'Vitres & Baies vitrées', price: 35 },
    oven: { name: 'Décapage Four & Micro-ondes', price: 30 },
    fridge: { name: 'Intérieur Réfrigérateur & Congélateur', price: 25 },
    ironing: { name: 'Repassage & Pliage linge', price: 28 },
    carpet_couch: { name: 'Shampouinage Canapé ou Tapis', price: 49 },
    steam_sanitization: { name: 'Désinfection Vapeur 140°C', price: 39 }
  };

  function updatePrice() {
    if (!surfaceInput) return;

    const surface = Math.max(15, parseInt(surfaceInput.value, 10) || 15);
    if (surfaceDisplay) surfaceDisplay.textContent = `${surface} m²`;

    let selectedService = 'regular';
    serviceRadios.forEach((radio) => {
      if (radio.checked) selectedService = radio.value;
    });

    const serviceData = serviceRates[selectedService] || serviceRates.regular;
    const basePrice = Math.max(serviceData.min, surface * serviceData.rate);

    let optionsTotal = 0;
    let optionsCount = 0;
    optionCheckboxes.forEach((cb) => {
      if (cb.checked) {
        optionsTotal += optionPrices[cb.value]?.price || 0;
        optionsCount++;
      }
    });

    let discountPercent = 0;
    frequencyRadios.forEach((f) => {
      if (f.checked) {
        if (f.value === 'weekly') discountPercent = 0.15;
        if (f.value === 'biweekly') discountPercent = 0.10;
        if (f.value === 'monthly') discountPercent = 0.05;
      }
    });

    const discountAmount = basePrice * discountPercent;
    const finalPriceEur = Math.round((basePrice + optionsTotal - discountAmount) * 100) / 100;
    const finalPriceGnf = Math.round(finalPriceEur * WHATSAPP_CONFIG.gnfExchangeRate);

    let hours = Math.round((surface / serviceData.speedM2PerHour + optionsCount * 0.4) * 10) / 10;
    if (selectedService === 'deep' && hours < 2.5) hours = 2.5;

    // Affichage des prix
    if (priceDisplay) {
      priceDisplay.textContent = `${finalPriceEur.toFixed(2)} €`;
    }
    if (priceDisplayGnf) {
      priceDisplayGnf.textContent = `${finalPriceGnf.toLocaleString('fr-FR')} GNF`;
    }
    if (hoursDisplay) {
      hoursDisplay.textContent = `~${hours}h d'intervention estimée`;
    }

    // Synchronisation avec les champs cachés du formulaire de réservation
    const formSurfaceInput = document.getElementById('bookingSurface');
    const formPriceInput = document.getElementById('bookingCalculatedPrice');
    if (formSurfaceInput) formSurfaceInput.value = surface;
    if (formPriceInput) formPriceInput.value = finalPriceEur;
  }

  if (surfaceInput) {
    surfaceInput.addEventListener('input', updatePrice);
  }
  serviceRadios.forEach((r) => r.addEventListener('change', updatePrice));
  optionCheckboxes.forEach((cb) => cb.addEventListener('change', updatePrice));
  frequencyRadios.forEach((f) => f.addEventListener('change', updatePrice));

  updatePrice();
}

/**
 * -------------------------------------------------------------------------
 * 2. GALERIE AVANT / APRÈS (Curseur de comparaison tactile et souris)
 * -------------------------------------------------------------------------
 */
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.before-after-container');
  containers.forEach((container) => {
    const slider = container.querySelector('.comparison-slider');
    const afterImage = container.querySelector('.after-image-wrapper');
    const handle = container.querySelector('.slider-handle');

    if (!slider || !afterImage) return;

    function moveDivider(percent) {
      const clamped = Math.max(0, Math.min(100, percent));
      afterImage.style.width = `${clamped}%`;
      if (handle) handle.style.left = `${clamped}%`;
    }

    slider.addEventListener('input', (e) => {
      moveDivider(e.target.value);
    });
  });
}

/**
 * -------------------------------------------------------------------------
 * 3. GESTIONNAIRE PRINCIPAL : FORMULAIRE & LIEN DIRECT WHATSAPP
 * -------------------------------------------------------------------------
 */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const alertContainer = document.getElementById('bookingAlert');
  const modalSuccess = document.getElementById('bookingSuccessModal');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 1. Réinitialisation des messages d'erreur visuels
    clearFormErrors(alertContainer);

    // 2. Extraction des données du formulaire et du calculateur
    const formData = new FormData(form);
    const selectedOptions = [];
    const selectedOptionsLabels = [];

    // Mappage des options
    const optionLabelsMap = {
      windows: 'Vitres & Baies vitrées',
      oven: 'Décapage Four & Micro-ondes',
      fridge: 'Intérieur Réfrigérateur',
      ironing: 'Repassage & Pliage linge',
      carpet_couch: 'Shampouinage Canapé/Tapis',
      steam_sanitization: 'Désinfection Vapeur 140°C'
    };

    form.querySelectorAll('input[name="options"]:checked').forEach((cb) => {
      selectedOptions.push(cb.value);
      selectedOptionsLabels.push(optionLabelsMap[cb.value] || cb.value);
    });

    // Mappage des types de services
    const serviceLabelsMap = {
      regular: 'Entretien Résidentiel Régulier',
      deep: 'Grand Nettoyage Approfondi (Remise à neuf)',
      office: 'Nettoyage Bureaux & Locaux Pro',
      airbnb: 'Conciergerie & Rotation Airbnb'
    };

    const serviceType = (formData.get('serviceType') || 'regular').toString();
    const serviceTitle = serviceLabelsMap[serviceType] || 'Nettoyage de Standing';
    const surface = parseInt(formData.get('surface'), 10) || 30;
    const priceEur = parseFloat(formData.get('calculatedPrice')) || 0;
    const priceGnf = Math.round(priceEur * WHATSAPP_CONFIG.gnfExchangeRate);

    const bookingData = {
      fullName: (formData.get('fullName') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim().toLowerCase(),
      phone: (formData.get('phone') || '').toString().trim(),
      address: (formData.get('address') || '').toString().trim(),
      city: (formData.get('city') || 'Conakry').toString().trim(),
      postalCode: (formData.get('postalCode') || 'Simbaya').toString().trim(),
      serviceType: serviceType,
      serviceTitle: serviceTitle,
      surface: surface,
      frequency: (formData.get('frequency') || 'one_time').toString(),
      selectedOptions: selectedOptions,
      selectedOptionsLabels: selectedOptionsLabels,
      date: (formData.get('date') || '').toString(),
      timeSlot: (formData.get('timeSlot') || '09h00 - 13h00').toString(),
      accessInstructions: (formData.get('accessInstructions') || '').toString().trim(),
      notes: (formData.get('notes') || '').toString().trim(),
      calculatedPriceEur: priceEur,
      calculatedPriceGnf: priceGnf
    };

    // 3. Validation préalable des données côté client
    const validationErrors = validateClientData(bookingData);
    if (validationErrors.length > 0) {
      showErrorAlert(validationErrors, alertContainer);
      return;
    }

    // 4. Génération du message structuré WhatsApp avec émojis professionnels
    const whatsappMessage = buildWhatsAppMessage(bookingData);
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // 5. État visuel de chargement sur le bouton
    setButtonLoadingState(submitBtn, true);

    try {
      // 6. Envoi asynchrone AJAX au serveur Express (pour sauvegarde BDD & emails Nodemailer)
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone,
          address: bookingData.address,
          city: bookingData.city,
          postalCode: bookingData.postalCode,
          serviceType: bookingData.serviceType,
          surface: bookingData.surface,
          frequency: bookingData.frequency,
          selectedOptions: bookingData.selectedOptions,
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          accessInstructions: bookingData.accessInstructions,
          notes: bookingData.notes,
          calculatedPrice: bookingData.calculatedPriceEur
        })
      });

      const result = await response.json();

      setButtonLoadingState(submitBtn, false);

      // Si le serveur a attribué une référence officielle, on met à jour le message
      const finalRef = result.reference || `FC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 7. Mise à jour de l'URL WhatsApp avec la référence officielle
      const finalWhatsAppMessage = buildWhatsAppMessage({ ...bookingData, reference: finalRef });
      const finalWhatsAppUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(finalWhatsAppMessage)}`;

      // 8. Affichage du modal / feedback de succès
      displaySuccessFeedback(finalRef, bookingData.fullName, finalWhatsAppUrl, modalSuccess);

      // 9. REDIRECTION AUTOMATIQUE VERS WHATSAPP (comme exigé par le cahier des charges)
      // Ouverture dans un nouvel onglet ou redirection pour déclencher la discussion
      const openWhatsApp = window.open(finalWhatsAppUrl, '_blank');
      if (!openWhatsApp) {
        // En cas de blocage des popups par le navigateur, redirection directe
        window.location.href = finalWhatsAppUrl;
      }

      form.reset();

    } catch (networkError) {
      console.warn('Envoi serveur indisponible, redirection WhatsApp immédiate en cours...', networkError);
      setButtonLoadingState(submitBtn, false);

      // Même si le serveur est inaccessible, le client est redirigé vers WhatsApp pour ne jamais perdre le prospect !
      displaySuccessFeedback('DIRECT-WA', bookingData.fullName, whatsappUrl, modalSuccess);
      window.open(whatsappUrl, '_blank');
    }
  });
}

/**
 * -------------------------------------------------------------------------
 * 4. FORMATEUR DU MESSAGE STRUCTURÉ WHATSAPP AVEC ÉMOJIS PROFESSIONNELS
 * -------------------------------------------------------------------------
 */
function buildWhatsAppMessage(data) {
  const optionsText = data.selectedOptionsLabels && data.selectedOptionsLabels.length > 0
    ? data.selectedOptionsLabels.join(', ')
    : 'Aucune';

  const refHeader = data.reference ? ` (Réf: ${data.reference})` : '';
  const gnfFormatted = data.calculatedPriceGnf 
    ? `${data.calculatedPriceGnf.toLocaleString('fr-FR')} GNF` 
    : 'À confirmer';

  const eurFormatted = data.calculatedPriceEur 
    ? ` (~ ${data.calculatedPriceEur.toFixed(2)} €)` 
    : '';

  const messageLines = [
    `✨ *NOUVELLE DEMANDE DE RÉSERVATION - FATOU'S CLEAN*${refHeader} ✨`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Client :* ${data.fullName}`,
    `📞 *Téléphone :* ${data.phone}`,
    `📧 *Email :* ${data.email}`,
    ``,
    `🧹 *DÉTAILS DE LA PRESTATION*`,
    `• *Service :* ${data.serviceTitle || data.serviceType}`,
    `• *Surface déclarée :* ${data.surface} m²`,
    `• *Options choisies :* ${optionsText}`,
    ``,
    `📅 *PLANIFICATION DU RENDEZ-VOUS*`,
    `• *Date demandée :* ${data.date}`,
    `• *Créneau horaire :* ${data.timeSlot}`,
    `• *Lieu d'intervention :* ${data.address}, ${data.postalCode} ${data.city}`,
    data.accessInstructions ? `• *Consignes d'accès :* ${data.accessInstructions}` : null,
    ``,
    `💰 *TARIF ESTIMÉ*`,
    `• *Montant Garanti :* ${gnfFormatted}${eurFormatted}`,
    `• *Matériel & produits éco-responsables inclus*`,
    ``,
    data.notes ? `📝 *Remarques particulières :* ${data.notes}\n` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🏢 *Fatou's Clean - Réseau d'Agences en Guinée 🇬🇳 :*`,
    `• *Siège Principal Conakry :* Simbaya Gare (face Cantine, à côté Pharmacie LE SION)`,
    `• *Siège Régional Kindia :* Précisément à Foulayah`,
    `• *Agence Régionale Mamou :* Auprès de la Gare Voiture`,
    `_Message généré automatiquement depuis le formulaire web._`
  ].filter(line => line !== null);

  return messageLines.join('\n');
}

/**
 * -------------------------------------------------------------------------
 * 5. VALIDATION DÉFENSIVE DES CHAMPS CÔTÉ CLIENT
 * -------------------------------------------------------------------------
 */
function validateClientData(data) {
  const errors = [];
  if (!data.fullName || data.fullName.length < 2) {
    errors.push('Veuillez renseigner votre nom complet (au moins 2 caractères).');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Veuillez fournir une adresse email valide pour la réception de votre récapitulatif.');
  }
  const cleanPhone = data.phone.replace(/\D/g, '');
  if (!data.phone || cleanPhone.length < 8) {
    errors.push('Veuillez renseigner un numéro de téléphone joignable (ex: +224 623 07 82 50).');
  }
  if (!data.address || data.address.length < 4) {
    errors.push("L'adresse complète de l'intervention est obligatoire.");
  }
  if (!data.date) {
    errors.push('Veuillez sélectionner une date souhaitée pour votre intervention.');
  }
  if (!data.timeSlot) {
    errors.push('Veuillez choisir un créneau horaire.');
  }
  return errors;
}

/**
 * Affichage des erreurs avec scroll automatique
 */
function showErrorAlert(messages, container) {
  if (!container) {
    alert(messages.join('\n'));
    return;
  }
  container.innerHTML = `
    <div class="p-4 mb-4 text-sm text-red-800 rounded-2xl bg-red-50 border border-red-200" role="alert">
      <div class="flex items-center font-bold mb-1.5 text-red-700">
        <svg class="w-4 h-4 mr-2 inline shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        Attention, veuillez corriger les informations suivantes :
      </div>
      <ul class="list-disc list-inside space-y-1 text-xs text-red-600">
        ${messages.map((m) => `<li>${escapeHtml(m)}</li>`).join('')}
      </ul>
    </div>
  `;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearFormErrors(container) {
  if (container) container.innerHTML = '';
}

/**
 * Gestion du bouton de chargement
 */
function setButtonLoadingState(btn, isLoading) {
  if (!btn) return;
  if (isLoading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');
    btn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Génération du message WhatsApp & Envoi...
    `;
  } else {
    btn.disabled = false;
    btn.classList.remove('opacity-75', 'cursor-not-allowed');
    if (btn.dataset.originalText) {
      btn.innerHTML = btn.dataset.originalText;
    }
  }
}

/**
 * Affichage du feedback de succès
 */
function displaySuccessFeedback(reference, fullName, whatsappUrl, modalSuccess) {
  if (modalSuccess) {
    modalSuccess.classList.remove('hidden');
    const refElem = modalSuccess.querySelector('.modal-booking-ref');
    const nameElem = modalSuccess.querySelector('.modal-booking-name');
    const waBtn = modalSuccess.querySelector('.modal-whatsapp-link');

    if (refElem) refElem.textContent = reference;
    if (nameElem) nameElem.textContent = fullName;
    if (waBtn && whatsappUrl) waBtn.href = whatsappUrl;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Exports pour modularité éventuelle
export { 
  initPricingCalculator, 
  initBeforeAfterSliders, 
  initBookingForm, 
  buildWhatsAppMessage, 
  WHATSAPP_CONFIG 
};
