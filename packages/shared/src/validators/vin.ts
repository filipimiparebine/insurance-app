/**
 * VIN (Vehicle Identification Number) validator
 *
 * ISO 3779 — 17 characters, excluding I, O, Q.
 *
 * The 9th position is the check digit calculated from the rest of the VIN.
 * Characters A-Z map to values 1-26 (skipping I, O, Q).
 * Digits 0-9 map to values 0-9.
 *
 * Weights: 8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2
 * Sum = sum of (value_i * weight_i)
 * Check digit = sum mod 11, with 10 represented as 'X'
 *
 * For VINs from markets that don't use position 9 check digit (EU),
 * we validate the format only.
 */

const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

const VIN_VALUE_MAP: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5,
  P: 7,
  R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

export interface VinValidationResult {
  valid: boolean;
  error?: string;
}

export function validateVIN(vin: string): VinValidationResult {
  const cleaned = vin.toUpperCase().trim();

  if (cleaned.length !== 17) {
    return { valid: false, error: 'VIN-ul trebuie să aibă 17 caractere.' };
  }

  if (!VIN_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: 'VIN-ul conține caractere invalide. Literele I, O și Q nu sunt permise.',
    };
  }

  // If 9th character is a valid check digit character, validate it
  const checkDigitChar = cleaned[8];
  if (checkDigitChar === 'X' || (checkDigitChar >= '0' && checkDigitChar <= '9')) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += (VIN_VALUE_MAP[cleaned[i]] ?? 0) * VIN_WEIGHTS[i];
    }
    const expectedCheck = sum % 11 === 10 ? 'X' : String(sum % 11);
    if (expectedCheck !== checkDigitChar) {
      return {
        valid: false,
        error: 'Cifra de control a VIN-ului nu este validă.',
      };
    }
  }
  // If 9th char is not a check digit (EU VINs may skip this), skip check

  return { valid: true };
}
