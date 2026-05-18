/**
 * CUI (Cod Unic de Înregistrare) validator
 *
 * Romanian Unique Registration Code for legal entities.
 *
 * Structure: CCCCCCCCC (7-10 digits) or RO + 7-10 digits
 * Control uses test key 753217532175321... repeating.
 *
 * Control digit = (sum of digit_i * key_i) * 10 mod 11
 * If result = 10 → control digit = 0
 */

const CUI_KEY = [7, 5, 3, 2, 1];

export interface CuiValidationResult {
  valid: boolean;
  error?: string;
  raw?: string;
}

export function validateCUI(cui: string): CuiValidationResult {
  let cleaned = cui.trim();

  // Strip optional RO prefix
  if (cleaned.toUpperCase().startsWith('RO')) {
    cleaned = cleaned.slice(2);
  }

  if (!/^\d{6,10}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'CUI-ul trebuie să conțină între 6 și 10 cifre (fără prefixul RO).',
    };
  }

  // Pad to 9 digits for calculation (common practice for CUI < 9 digits)
  const padded = cleaned.padStart(9, '0');
  const digits = padded.split('').map(Number);

  const keyLen = padded.length;
  let sum = 0;
  for (let i = 0; i < keyLen - 1; i++) {
    sum += digits[i] * CUI_KEY[(i + 1) % CUI_KEY.length];
  }

  const control = (sum * 10) % 11 === 10 ? 0 : (sum * 10) % 11;

  if (control !== digits[keyLen - 1]) {
    return {
      valid: false,
      error: 'CUI-ul nu este valid. Cifra de control nu se potrivește.',
    };
  }

  return { valid: true, raw: cleaned };
}

import { z } from 'zod';

export const cuidSchema = z
  .string()
  .trim()
  .refine((val) => validateCUI(val).valid, { message: 'CUI-ul nu este valid.' });
