type SupabaseAuthSession = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: {
    id: string;
    email?: string;
  };
};

type SupabaseUser = {
  id: string;
  email?: string;
};

type ConsentMetadata = {
  privacy_consent: true;
  privacy_accepted_at: string;
  privacy_version: string;
  terms_version: string;
  consent_ip_hash?: string;
};

type SupabaseAuthError = {
  code?: string;
  message?: string;
};

export type SupabaseSignUpResult =
  | { session: SupabaseAuthSession; error: null }
  | { session: null; error: SupabaseAuthError };

function supabaseUrl() {
  return (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
}

function supabaseAnonKey() {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

async function supabaseFetch(path: string, init: RequestInit = {}, accessToken?: string) {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");

  const headers = new Headers(init.headers);
  headers.set("apikey", supabaseAnonKey());
  headers.set("content-type", headers.get("content-type") || "application/json");
  headers.set("authorization", `Bearer ${accessToken || supabaseAnonKey()}`);

  return fetch(`${supabaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function signInWithSupabase(email: string, password: string) {
  const response = await supabaseFetch("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) return null;
  return (await response.json()) as SupabaseAuthSession;
}

export async function refreshSupabaseSession(refreshToken: string) {
  const response = await supabaseFetch("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;
  return (await response.json()) as SupabaseAuthSession;
}

export async function signUpWithSupabase(
  email: string,
  password: string,
  name: string,
  redirectTo?: string,
  consent?: ConsentMetadata,
) {
  const path = redirectTo ? `/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}` : "/auth/v1/signup";
  const response = await supabaseFetch(path, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      data: { full_name: name, ...consent },
    }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      error_code?: string;
      code?: string;
      msg?: string;
      message?: string;
    };
    return {
      session: null,
      error: {
        code: error.error_code || error.code,
        message: error.msg || error.message,
      },
    } satisfies SupabaseSignUpResult;
  }

  return {
    session: (await response.json()) as SupabaseAuthSession,
    error: null,
  } satisfies SupabaseSignUpResult;
}

export async function getSupabaseUser(accessToken?: string) {
  if (!accessToken) return null;

  const response = await supabaseFetch("/auth/v1/user", { method: "GET" }, accessToken);
  if (!response.ok) return null;

  return (await response.json()) as SupabaseUser;
}

export async function readCloudState(accessToken: string, userId: string) {
  const query = `/rest/v1/financial_states?select=data,updated_at&user_id=eq.${encodeURIComponent(userId)}&limit=1`;
  const response = await supabaseFetch(query, { method: "GET" }, accessToken);

  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ data: unknown; updated_at: string }>;
  return rows[0] || null;
}

export async function writeCloudState(accessToken: string, userId: string, data: unknown) {
  const response = await supabaseFetch(
    "/rest/v1/financial_states",
    {
      method: "POST",
      headers: {
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ user_id: userId, data }),
    },
    accessToken,
  );

  return response.ok;
}

export async function writeConsentRecord(accessToken: string, userId: string, consent: ConsentMetadata) {
  const response = await supabaseFetch(
    "/rest/v1/user_consents",
    {
      method: "POST",
      headers: {
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        accepted_at: consent.privacy_accepted_at,
        terms_version: consent.terms_version,
        privacy_version: consent.privacy_version,
        ip_hash: consent.consent_ip_hash || null,
      }),
    },
    accessToken,
  );

  return response.ok;
}
