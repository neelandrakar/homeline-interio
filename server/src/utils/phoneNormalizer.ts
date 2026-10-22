/**
 * Indian Mobile Phone Number Validator & Normalizer
 * Standard Indian mobile numbers are 10 digits starting with 6, 7, 8, or 9.
 * Validates prefixes +91, 91, or leading 0.
 */

export interface PhoneNormalizationResult {
  isValid: boolean;
  formattedE164: string;    // e.g. "+919876543210"
  formattedDisplay: string; // e.g. "+91 98765 43210"
  digits: string;           // e.g. "9876543210"
  error?: string;
}

export function normalizeIndianPhoneNumber(input: string): PhoneNormalizationResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      formattedE164: '',
      formattedDisplay: '',
      digits: '',
      error: 'Phone number is required.'
    };
  }

  // Remove whitespace, dashes, brackets, dots
  let cleaned = input.replace(/[\s\-\(\)\.]/g, '').trim();

  // Strip leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Handle prefix variants: 91XXXXXXXXXX (12 digits)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  }
  // Handle trunk prefix: 0XXXXXXXXXX (11 digits)
  else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Must now be strictly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      isValid: false,
      formattedE164: '',
      formattedDisplay: '',
      digits: '',
      error: 'Please enter a valid 10-digit Indian mobile number.'
    };
  }

  // Indian mobile numbers must start with 6, 7, 8, or 9
  const firstDigit = cleaned[0];
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return {
      isValid: false,
      formattedE164: '',
      formattedDisplay: '',
      digits: '',
      error: 'Indian mobile numbers must begin with 6, 7, 8, or 9.'
    };
  }

  const e164 = `+91${cleaned}`;
  const display = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;

  return {
    isValid: true,
    formattedE164: e164,
    formattedDisplay: display,
    digits: cleaned
  };
}
