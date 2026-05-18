import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { randomBytes } from "@noble/ciphers/webcrypto";
import type { KmsProvider } from "./types";

const MASTER_KEY = (() => {
  const key = process.env.ENCRYPTION_MASTER_KEY;
  if (key) {
    return Buffer.from(key, "hex");
  }
  console.warn("[encryption] ENCRYPTION_MASTER_KEY not set, using insecure dev key");
  return Buffer.alloc(32, 0x42);
})();

export const mockKms: KmsProvider = {
  async generateDek() {
    return Buffer.from(randomBytes(32));
  },

  async wrapDek(dek) {
    const nonce = randomBytes(24);
    const cipher = xchacha20poly1305(MASTER_KEY, nonce);
    const wrapped = Buffer.concat([nonce, cipher.encrypt(dek)]);
    return wrapped;
  },

  async unwrapDek(wrappedDek) {
    const nonce = wrappedDek.subarray(0, 24);
    const wrapped = wrappedDek.subarray(24);
    const cipher = xchacha20poly1305(MASTER_KEY, nonce);
    return Buffer.from(cipher.decrypt(wrapped));
  },
};
