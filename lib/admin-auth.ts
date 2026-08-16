import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type AttemptState = { failures: number; blockedUntil: number };
const attempts = new Map<string, AttemptState>();

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export function isRateLimited(request: Request) {
  const state = attempts.get(clientKey(request));
  return Boolean(state && state.blockedUntil > Date.now());
}

function recordFailure(request: Request) {
  const key = clientKey(request);
  const state = attempts.get(key) ?? { failures: 0, blockedUntil: 0 };
  state.failures += 1;
  if (state.failures >= MAX_FAILURES) state.blockedUntil = Date.now() + LOCKOUT_MS;
  attempts.set(key, state);
}

function clearFailures(request: Request) {
  attempts.delete(clientKey(request));
}

export async function verifyAdminPassword(password: string, request: Request) {
  if (isRateLimited(request)) return { ok: false as const, locked: true };
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const valid = Boolean(hash && await bcrypt.compare(password, hash));
  if (!valid) {
    recordFailure(request);
    return { ok: false as const, locked: isRateLimited(request) };
  }
  clearFailures(request);
  return { ok: true as const, locked: false };
}

export function createSessionToken() {
  const payload = `${Date.now() + SESSION_TTL_SECONDS * 1000}.${randomBytes(24).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiresAt, nonce, signature] = parts;
  if (!nonce || Number(expiresAt) < Date.now()) return false;
  const expected = sign(`${expiresAt}.${nonce}`);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export function sessionCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_TTL_SECONDS };
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
