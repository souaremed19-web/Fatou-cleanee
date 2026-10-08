/**
 * Fatou's Cleaner - Types & Schémas de Réservation
 */

export type ServiceType = 'regular' | 'deep' | 'office' | 'airbnb';

export interface ServiceDefinition {
  id: ServiceType;
  title: string;
  tagline: string;
  basePricePerM2: number;
  minimumPrice: number;
  description: string;
  features: string[];
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
  icon?: string;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  serviceType: ServiceType;
  surface: number; // en m²
  frequency?: 'one_time' | 'weekly' | 'biweekly' | 'monthly';
  selectedOptions: string[];
  date: string;
  timeSlot: string;
  accessInstructions?: string;
  notes?: string;
  calculatedPrice: number;
}

export interface BookingRecord extends BookingFormData {
  id: string;
  reference: string;
  createdAt: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  serverVerifiedPrice: number;
  emailSent: boolean;
  adminEmailSent: boolean;
  whatsappNoticeSent?: boolean;
  clientNotificationPreview?: string;
  adminNotificationPreview?: string;
}

export interface BookingApiResponse {
  success: boolean;
  message: string;
  booking?: BookingRecord;
  reference?: string;
  whatsappDirectUrl?: string;
  errors?: string[];
}
