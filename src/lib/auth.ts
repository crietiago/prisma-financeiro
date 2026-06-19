import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseUser, isSupabaseConfigured, refreshSupabaseSession } from "./supabase";

const COOKIE_NAME = "prisma_session";
const SUPABASE_ACCESS_COOKIE = "prisma_supabase_access";
const SUPABASE_REFRESH_COOKIE = "prisma_supabase_refresh";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

function getSecret() {
  return process.env.AUTH_SECRET || process.env.APP_ACCESS_PASSWORD || "prisma-local-dev-secret";
}

export function expectedPassword() {
  if (process.env.APP_ACCESS_PASSWORD) return process.env.APP_ACCESS_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "prisma2026";
  return "";
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `prisma:${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token?: string) {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const [, expiresAtRaw] = payload.split(":");
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(payload));
}

export async function isAuthenticated(allowRefresh = false) {
  if (isSupabaseConfigured() && (await getCurrentSupabaseUser(allowRefresh))) return true;

  const store = await cookies();
  return isValidSessionToken(store.get(COOKIE_NAME)?.value);
}

export async function getSupabaseAccessToken() {
  const store = await cookies();
  return store.get(SUPABASE_ACCESS_COOKIE)?.value;
}

export async function getSupabaseRefreshToken() {
  const store = await cookies();
  return store.get(SUPABASE_REFRESH_COOKIE)?.value;
}

export async function getCurrentSupabaseUser(allowRefresh = false) {
  const accessToken = await getSupabaseAccessToken();
  const currentUser = await getSupabaseUser(accessToken);
  if (currentUser) return currentUser;

  if (!allowRefresh) return null;

  const refreshToken = await getSupabaseRefreshToken();
  if (!refreshToken) return null;

  const refreshedSession = await refreshSupabaseSession(refreshToken);
  if (!refreshedSession?.access_token || !refreshedSession.user) return null;

  await setSupabaseSessionCookies(refreshedSession);
  return refreshedSession.user;
}

export async function setSupabaseSessionCookies(session: {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}) {
  if (!session.access_token) return false;

  const store = await cookies();
  const maxAge = Math.max(60, Number(session.expires_in || 3600));

  store.set(SUPABASE_ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  });

  if (session.refresh_token) {
    store.set(SUPABASE_REFRESH_COOKIE, session.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL_SECONDS,
      path: "/",
    });
  }

  return true;
}

export async function setSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  store.set(SUPABASE_ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  store.set(SUPABASE_REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
