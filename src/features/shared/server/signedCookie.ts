import { cookies } from "next/headers";
import type { JWTPayload } from "jose";
import { createSignedToken, getPrivateCookieOptions, verifySignedToken } from "./signedToken";

export async function saveSignedCookie(name: string, payload: JWTPayload, expiration: string, maxAge?: number) {
  const token = await createSignedToken(payload, expiration);
  const store = await cookies();
  store.set(name, token, getPrivateCookieOptions(maxAge));
}

export async function readSignedCookie<T extends JWTPayload>(name: string) {
  const store = await cookies();
  const token = store.get(name)?.value;
  if (!token) return null;
  try {
    return await verifySignedToken<T>(token);
  } catch {
    return null;
  }
}

export async function deletePrivateCookie(name: string) {
  const store = await cookies();
  store.delete(name);
}
