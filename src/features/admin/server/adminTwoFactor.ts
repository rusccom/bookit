import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual
} from "node:crypto";

import { getEnv } from "@/features/shared/server/env";

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function createTotpSecret() {
  return encodeBase32(randomBytes(20));
}

export function createOtpAuthUri(login: string, secret: string) {
  const label = encodeURIComponent(`BookCort:${login}`);
  const issuer = encodeURIComponent("BookCort");
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;
}

export function verifyTotp(secret: string, token: string) {
  if (!/^\d{6}$/.test(token)) return false;
  const counter = Math.floor(Date.now() / 30000);
  return [-1, 0, 1].some((offset) => compareToken(
    createTotpToken(secret, counter + offset),
    token
  ));
}

export function encryptTotpSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(toBase64Url).join(".");
}

export function decryptTotpSecret(value: string) {
  const [iv, tag, encrypted] = value.split(".").map(fromBase64Url);
  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

function createTotpToken(secret: string, counter: number) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const hash = createHmac("sha1", decodeBase32(secret)).update(buffer).digest();
  const offset = hash[hash.length - 1] & 15;
  const code = (hash.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return String(code).padStart(6, "0");
}

function compareToken(expected: string, actual: string) {
  return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

function encodeBase32(value: Buffer) {
  let bits = "";
  for (const byte of value) bits += byte.toString(2).padStart(8, "0");
  let result = "";
  for (let index = 0; index < bits.length; index += 5) {
    result += BASE32[Number.parseInt(bits.slice(index, index + 5).padEnd(5, "0"), 2)];
  }
  return result;
}

function decodeBase32(value: string) {
  let bits = "";
  for (const char of value) bits += BASE32.indexOf(char).toString(2).padStart(5, "0");
  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }
  return Buffer.from(bytes);
}

function getEncryptionKey() {
  return createHash("sha256").update(getEnv().SESSION_SECRET).digest();
}

function toBase64Url(value: Buffer) {
  return value.toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url");
}
