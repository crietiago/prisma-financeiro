import { expectedPassword, setSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

function nextPath(formData: FormData) {
  const raw = String(formData.get("next") || "/app");
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/app";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const next = nextPath(formData);

  if (!expectedPassword() || password !== expectedPassword()) {
    redirect(`/entrar?erro=1&next=${encodeURIComponent(next)}`);
  }

  await setSessionCookie();
  redirect(next);
}
