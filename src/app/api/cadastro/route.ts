import { setSupabaseSessionCookies } from "@/lib/auth";
import { PRIVACY_VERSION, TERMS_VERSION } from "@/lib/compliance";
import { isSameOriginRequest } from "@/lib/request-security";
import { isSupabaseConfigured, signUpWithSupabase, writeConsentRecord } from "@/lib/supabase";
import { createHmac } from "node:crypto";
import { redirect } from "next/navigation";

function nextPath(formData: FormData) {
  const raw = String(formData.get("next") || "/app");
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/app";
}

function consentIpHash(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "";
  const secret = process.env.AUTH_SECRET || process.env.APP_ACCESS_PASSWORD || "prisma-local-dev-secret";

  if (!ip) return undefined;
  return createHmac("sha256", secret).update(ip).digest("base64url");
}

function signUpErrorPath(code?: string) {
  if (code === "over_email_send_rate_limit") return "limite-email";
  if (code === "email_address_invalid" || code === "weak_password") return "dados";
  return "cadastro";
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = nextPath(formData);
  const privacyConsent = formData.get("privacyConsent") === "accepted";
  const termsVersion = String(formData.get("termsVersion") || "");
  const privacyVersion = String(formData.get("privacyVersion") || "");
  const welcomeUrl = new URL("/boas-vindas", request.url);
  welcomeUrl.searchParams.set("next", next);

  if (
    !isSupabaseConfigured() ||
    !name ||
    !email ||
    password.length < 8 ||
    !privacyConsent ||
    termsVersion !== TERMS_VERSION ||
    privacyVersion !== PRIVACY_VERSION
  ) {
    redirect(`/cadastro?erro=1&next=${encodeURIComponent(next)}`);
  }

  const consent = {
    privacy_consent: true as const,
    privacy_accepted_at: new Date().toISOString(),
    privacy_version: PRIVACY_VERSION,
    terms_version: TERMS_VERSION,
    consent_ip_hash: consentIpHash(request),
  };

  const result = await signUpWithSupabase(email, password, name, welcomeUrl.toString(), consent);
  if (!result.session) {
    console.warn("Supabase sign-up failed", { code: result.error.code || "unknown" });
    redirect(`/cadastro?erro=${signUpErrorPath(result.error.code)}&next=${encodeURIComponent(next)}`);
  }

  if (result.session.access_token && result.session.user?.id) {
    await writeConsentRecord(result.session.access_token, result.session.user.id, consent);
  }

  if (await setSupabaseSessionCookies(result.session)) redirect(next);

  redirect(`/entrar?cadastro=1&next=${encodeURIComponent(next)}`);
}
