/**
 * CNP (Cod Numeric Personal) validator
 *
 * Romanian Personal Numerical Code — 13 digits used for identity.
 *
 * Structure: S AA LL ZZ JJ NNN C
 *   S = sex/century (1=M/1900-1999, 2=F/1900-1999, 3=M/1800-1899, 4=F/1800-1899,
 *       5=M/2000-2099, 6=F/2000-2099, 7=M/resident, 8=F/resident, 9=foreigner)
 *   AA = last 2 digits of birth year
 *   LL = birth month
 *   ZZ = birth day
 *   JJ = county code (01-52)
 *   NNN = serial (001-999)
 *   C = control digit (ISO 7064 mod 11,10)
 *
 * Control constant: 279146358279
 * Control sum = sum of (digit_i * constant_i) for i=0..11
 * Control digit = control_sum % 11, if 10 → control digit = 1
 */

const CNP_CONTROL = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
const CNP_LENGTH = 13;

export interface CnpValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCNP(cnp: string): CnpValidationResult {
  const cleaned = cnp.replace(/\s/g, '');

  if (cleaned.length !== CNP_LENGTH) {
    return { valid: false, error: 'CNP-ul trebuie să aibă 13 cifre.' };
  }

  if (!/^\d{13}$/.test(cleaned)) {
    return { valid: false, error: 'CNP-ul conține caractere invalide. Doar cifre sunt permise.' };
  }

  const digits = cleaned.split('').map(Number);

  const sex = digits[0];
  if (sex < 1 || sex > 9) {
    return { valid: false, error: 'Prima cifră a CNP-ului nu este validă.' };
  }

  const month = digits[3] * 10 + digits[4];
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Luna din CNP nu este validă.' };
  }

  const day = digits[5] * 10 + digits[6];
  if (day < 1 || day > 31) {
    return { valid: false, error: 'Ziua din CNP nu este validă.' };
  }

  const county = digits[7] * 10 + digits[8];
  if (county < 1 || county > 52) {
    return { valid: false, error: 'Codul de județ din CNP nu este valid.' };
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * CNP_CONTROL[i];
  }
  const controlDigit = sum % 11 === 10 ? 1 : sum % 11;

  if (controlDigit !== digits[12]) {
    return { valid: false, error: 'Cifra de control a CNP-ului nu este validă.' };
  }

  return { valid: true };
}

import { z } from 'zod';

export const cnpSchema = z
  .string()
  .trim()
  .refine((val) => validateCNP(val).valid, { message: 'CNP-ul nu este valid.' });
