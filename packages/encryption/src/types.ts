export interface EncryptedRecord {
  ciphertext: Buffer;
  dekWrapped: Buffer;
  nonce: Buffer;
}

export interface KmsProvider {
  generateDek(): Promise<Buffer>;
  wrapDek(dek: Buffer): Promise<Buffer>;
  unwrapDek(wrappedDek: Buffer): Promise<Buffer>;
}

export interface EncryptionProvider {
  encrypt(plaintext: Buffer): Promise<EncryptedRecord>;
  decrypt(record: EncryptedRecord): Promise<Buffer>;
}

export interface DecryptAuditEntry {
  actorId: string;
  userId: string;
  fieldName: string;
  recordId: string;
  reason: string;
  ipAddress: string;
  userAgent: string;
}
