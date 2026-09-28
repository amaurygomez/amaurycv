import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Layout: [version:1][iv:12][tag:16][ciphertext], base64-encoded. AAD binds a blob to its slot.
const VERSION = 1;
const IV = 12;
const TAG = 16;
const HEADER = 1 + IV + TAG;

export function parseKey(base64: string | undefined): Buffer {
  const key = Buffer.from(base64 ?? "", "base64");
  if (key.length !== 32) throw new Error("key must be 32 bytes, base64-encoded");
  return key;
}

export function seal(plain: Buffer, key: Buffer, aad: string): string {
  const iv = randomBytes(IV);
  const cipher = createCipheriv("aes-256-gcm", key, iv, { authTagLength: TAG });
  cipher.setAAD(Buffer.from(aad));
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([Buffer.of(VERSION), iv, cipher.getAuthTag(), body]).toString("base64");
}

export function unseal(sealed: string, key: Buffer, aad: string): Buffer {
  const blob = Buffer.from(sealed.trim(), "base64");
  if (blob.length <= HEADER || blob[0] !== VERSION) throw new Error("unsupported sealed blob");
  const decipher = createDecipheriv("aes-256-gcm", key, blob.subarray(1, 1 + IV), {
    authTagLength: TAG,
  });
  decipher.setAAD(Buffer.from(aad));
  decipher.setAuthTag(blob.subarray(1 + IV, HEADER));
  return Buffer.concat([decipher.update(blob.subarray(HEADER)), decipher.final()]);
}
