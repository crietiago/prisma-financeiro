import { getCurrentSupabaseUser } from "@/lib/auth";
import { injectAuthenticatedControls } from "@/lib/app-shell";
import { htmlResponse, readLegacyHtml } from "@/lib/legacy-html";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await getCurrentSupabaseUser(true);
  if (!user) redirect("/entrar?next=/app");

  const html = injectAuthenticatedControls(await readLegacyHtml("app.html"), user.id);
  return htmlResponse(html);
}
