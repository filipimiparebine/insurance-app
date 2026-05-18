import * as sodium from "libsodium-wrappers";

let _ready = false;

async function ensureReady() {
  if (!_ready) {
    await sodium.ready;
    _ready = true;
  }
}

export async function encryptTier1(
  plaintext: string,
): Promise<{ encrypted: Uint8Array; dekWrapped: Uint8Array; hmac: Uint8Array }> {
  await ensureReady();

  const dek = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encrypted = sodium.crypto_secretbox_easy(
    new TextEncoder().encode(plaintext),
    nonce,
    dek,
  );

  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);

  const hmac = sodium.crypto_generichash(
    32,
    new TextEncoder().encode(plaintext),
    new TextEncoder().encode(process.env.HMAC_SALT ?? "default-salt"),
  );

  return {
    encrypted: combined,
    dekWrapped: dek,
    hmac,
  };
}

export async function hmacLookup(plaintext: string): Promise<Uint8Array> {
  await ensureReady();
  return sodium.crypto_generichash(
    32,
    new TextEncoder().encode(plaintext),
    new TextEncoder().encode(process.env.HMAC_SALT ?? "default-salt"),
  );
}
