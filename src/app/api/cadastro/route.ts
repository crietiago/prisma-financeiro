import { setSupabaseSessionCookies } from "@/lib/auth";
import { isSupabaseConfigured, signUpWithSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

function nextPath(formData: FormData) {
  const raw = String(formData.get("next") || "/app");
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/app";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = nextPath(formData);
  const welcomeUrl = new URL("/boas-vindas", request.url);
  welcomeUrl.searchParams.set("next", next);

  if (!isSupabaseConfigured() || !name || !email || password.length < 8) {
    redirect(`/cadastro?erro=1&next=${encodeURIComponent(next)}`);
  }

  const session = await signUpWithSupabase(email, password, name, welcomeUrl.toString());
  if (!session) redirect(`/cadastro?erro=1&next=${encodeURIComponent(next)}`);

  if (await setSupabaseSessionCookies(session)) redirect(next);

  redirect(`/entrar?cadastro=1&next=${encodeURIComponent(next)}`);
}
