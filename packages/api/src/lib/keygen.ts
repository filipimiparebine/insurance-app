const KEY_PREFIX = "blaj_";
const KEY_BYTES = 24;

export function generateApiKey(): { rawKey: string; hex: string; prefix: string } {
  const bytes = new Uint8Array(KEY_BYTES);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  const rawKey = KEY_PREFIX + hex;
  const prefix = rawKey.slice(0, KEY_PREFIX.length + 6);
  return { rawKey, hex, prefix };
}

export async function hashApiKey(rawKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function hashApiKeyWithBcrypt(rawKey: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(rawKey, 12);
}

export function validateKeyFormat(key: string): boolean {
  return /^blaj_[0-9a-f]{48}$/.test(key);
}
