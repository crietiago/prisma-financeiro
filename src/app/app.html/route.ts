import { isAuthenticated } from "@/lib/auth";
import { injectAuthenticatedControls } from "@/lib/app-shell";
import { htmlResponse, readLegacyHtml } from "@/lib/legacy-html";
import { redirect } from "next/navigation";

export async function GET() {
  if (!(await isAuthenticated(true))) redirect("/entrar?next=/app.html");

  const html = injectAuthenticatedControls(await readLegacyHtml("app.html"));
  return htmlResponse(html);
}
