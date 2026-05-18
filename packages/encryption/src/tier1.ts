import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { randomBytes } from "@noble/ciphers/webcrypto";
import type { EncryptedRecord, EncryptionProvider, KmsProvider } from "./types";

export function createTier1Encryption(kms: KmsProvider): EncryptionProvider {
  return {
    async encrypt(plaintext) {
      const dek = await kms.generateDek();
      const nonce = Buffer.from(randomBytes(24));
      const cipher = xchacha20poly1305(dek, nonce);
      const ciphertext = Buffer.from(cipher.encrypt(plaintext));
      const dekWrapped = await kms.wrapDek(dek);

      // Zero out DEK from memory
      dek.fill(0);

      return { ciphertext, dekWrapped, nonce };
    },

    async decrypt(record) {
      const dek = await kms.unwrapDek(record.dekWrapped);
      const cipher = xchacha20poly1305(dek, record.nonce);
      const plaintext = Buffer.from(cipher.decrypt(record.ciphertext));

      // Zero out DEK from memory
      dek.fill(0);

      return plaintext;
    },
  };
}
