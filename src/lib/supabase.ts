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

function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";
}

function supabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
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

export async function signUpWithSupabase(email: string, password: string, name: string, redirectTo?: string) {
  const path = redirectTo ? `/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}` : "/auth/v1/signup";
  const response = await supabaseFetch(path, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      data: { full_name: name },
    }),
  });

  if (!response.ok) return null;
  return (await response.json()) as SupabaseAuthSession;
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
