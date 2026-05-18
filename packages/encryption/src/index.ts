export { createTier1Encryption } from "./tier1";
export { computeHmac, hmacEquals } from "./hmac";
export { mockKms } from "./mock-kms";
export type { EncryptedRecord, KmsProvider, EncryptionProvider, DecryptAuditEntry } from "./types";

import { mockKms } from "./mock-kms";
import { createTier1Encryption } from "./tier1";
import type { KmsProvider } from "./types";

let _kms: KmsProvider | null = null;

export function getKms(): KmsProvider {
  if (!_kms) {
    // In production, replace with GCP KMS provider
    // if (process.env.GCP_KMS_KEY_PATH) {
    //   _kms = createGcpKms(process.env.GCP_KMS_KEY_PATH);
    // } else {
    _kms = mockKms;
  }
  return _kms;
}

export function getTier1() {
  return createTier1Encryption(getKms());
}
