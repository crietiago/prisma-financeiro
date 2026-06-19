import { expectedPassword, setSessionCookie, setSupabaseSessionCookies } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/request-security";
import { isSupabaseConfigured, signInWithSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

function nextPath(formData: FormData) {
  const raw = String(formData.get("next") || "/app");
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/app";
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = nextPath(formData);

  if (email && isSupabaseConfigured()) {
    const session = await signInWithSupabase(email, password);
    if (!session || !(await setSupabaseSessionCookies(session))) {
      redirect(`/entrar?erro=1&next=${encodeURIComponent(next)}`);
    }

    redirect(next);
  }

  const allowPasswordFallback = process.env.NODE_ENV !== "production";

  if (!allowPasswordFallback || !expectedPassword() || password !== expectedPassword()) {
    redirect(`/entrar?erro=1&next=${encodeURIComponent(next)}`);
  }

  await setSessionCookie();
  redirect(next);
}
