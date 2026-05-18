/**
 * Romanian Identity Card (CI) validators
 *
 * Serie CI: 2 uppercase letters
 * Număr CI: 6 digits
 */

export interface CiValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSerieCI(serie: string): CiValidationResult {
  const cleaned = serie.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(cleaned)) {
    return { valid: false, error: 'Seria CI trebuie să conțină exact 2 litere mari.' };
  }

  return { valid: true };
}

export function validateNumarCI(numar: string): CiValidationResult {
  const cleaned = numar.trim();

  if (!/^\d{6}$/.test(cleaned)) {
    return { valid: false, error: 'Numărul CI trebuie să aibă exact 6 cifre.' };
  }

  return { valid: true };
}

import { z } from 'zod';

export const serieCiSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/, 'Seria CI trebuie să conțină exact 2 litere mari.');

export const numarCiSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Numărul CI trebuie să aibă exact 6 cifre.');
