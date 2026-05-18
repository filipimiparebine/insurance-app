/**
 * Romanian IBAN validator
 *
 * Format: ROxx AAAA BBBB CCCC DDDD EEEE (24 chars total)
 *
 * IBAN check digits use MOD-97-10 (ISO 7064).
 * Process:
 *   1. Move first 4 chars to end
 *   2. Replace letters: A=10, B=11, ..., Z=35
 *   3. Interpret as large integer mod 97
 *   4. Valid if result = 1
 */

export interface IbanValidationResult {
  valid: boolean;
  error?: string;
  formatted?: string;
}

function mod97(iban: string): number {
  let remainder = 0;
  for (let i = 0; i < iban.length; i++) {
    const ch = iban[i];
    let value: string;
    if (ch >= 'A' && ch <= 'Z') {
      value = String(ch.charCodeAt(0) - 'A'.charCodeAt(0) + 10);
    } else {
      value = ch;
    }
    for (const digit of value) {
      remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
    }
  }
  return remainder;
}

export function validateIBAN(iban: string): IbanValidationResult {
  const cleaned = iban.toUpperCase().replace(/\s/g, '');

  if (!cleaned.startsWith('RO')) {
    return { valid: false, error: 'IBAN-ul trebuie să înceapă cu RO.' };
  }

  if (cleaned.length !== 24) {
    return { valid: false, error: 'IBAN-ul RO trebuie să aibă 24 de caractere.' };
  }

  if (!/^RO\d{22}$/.test(cleaned)) {
    return { valid: false, error: 'IBAN-ul conține caractere invalide.' };
  }

  // Move first 4 chars (RO + check digits) to end
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);

  const result = mod97(rearranged);

  if (result !== 1) {
    return { valid: false, error: 'IBAN-ul nu este valid.' };
  }

  // Format: ROxx XXXX XXXX XXXX XXXX XXXX
  const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();

  return { valid: true, formatted };
}
