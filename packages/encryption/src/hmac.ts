import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";

const HMAC_SALT = process.env.HMAC_SALT ?? "dev-hmac-salt-change-in-production";

export function computeHmac(value: string): Buffer {
  return Buffer.from(hmac(sha256, HMAC_SALT, value));
}

export function hmacEquals(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
