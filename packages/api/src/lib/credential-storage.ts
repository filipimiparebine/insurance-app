import type { EncryptedRecord } from "@blaj/encryption";
import { uploadBuffer, downloadBuffer } from "./s3";

interface CredentialBlob {
  ciphertext: string;
  dekWrapped: string;
  nonce: string;
}

function serializeRecord(record: EncryptedRecord): string {
  const blob: CredentialBlob = {
    ciphertext: record.ciphertext.toString("base64"),
    dekWrapped: record.dekWrapped.toString("base64"),
    nonce: record.nonce.toString("base64"),
  };
  return JSON.stringify(blob);
}

function deserializeRecord(json: string): EncryptedRecord {
  const blob = JSON.parse(json) as CredentialBlob;
  return {
    ciphertext: Buffer.from(blob.ciphertext, "base64"),
    dekWrapped: Buffer.from(blob.dekWrapped, "base64"),
    nonce: Buffer.from(blob.nonce, "base64"),
  };
}

export function generateSecretId(insurerCode: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `credentials/insurer/${insurerCode}/${timestamp}-${random}.json`;
}

export async function storeCredentialBlob(
  encryptedRecord: EncryptedRecord,
  secretId: string,
): Promise<string> {
  const json = serializeRecord(encryptedRecord);
  const buffer = Buffer.from(json, "utf-8");

  await uploadBuffer({
    key: secretId,
    buffer,
    contentType: "application/json",
    bucket: process.env.S3_CREDENTIALS_BUCKET ?? process.env.S3_BUCKET,
  });

  return secretId;
}

export async function fetchCredentialBlob(
  secretId: string,
): Promise<EncryptedRecord | null> {
  try {
    const buffer = await downloadBuffer({
      key: secretId,
      bucket: process.env.S3_CREDENTIALS_BUCKET ?? process.env.S3_BUCKET,
    });
    const json = buffer.toString("utf-8");
    return deserializeRecord(json);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "NoSuchKey" || err.message?.includes("not found"))
    ) {
      return null;
    }
    throw err;
  }
}

export async function deleteCredentialBlob(secretId: string): Promise<void> {
  try {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const { getS3 } = await import("./s3");

    const s3 = getS3();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_CREDENTIALS_BUCKET ?? process.env.S3_BUCKET!,
        Key: secretId,
      }),
    );
  } catch {
    // fire-and-forget: old blob cleanup is best-effort
  }
}
