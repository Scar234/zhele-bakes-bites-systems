const clean = (value = '') => value.trim();

export const BUSINESS_PHONE = clean(import.meta.env.VITE_BUSINESS_PHONE || '');
export const BUSINESS_EMAIL = clean(import.meta.env.VITE_BUSINESS_EMAIL || '');
export const BUSINESS_WHATSAPP = clean(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export const WHATSAPP_URL = BUSINESS_WHATSAPP
  ? `https://wa.me/${BUSINESS_WHATSAPP}`
  : '';
