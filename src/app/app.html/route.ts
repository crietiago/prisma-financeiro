import { isAuthenticated } from "@/lib/auth";
import { htmlResponse, readLegacyHtml } from "@/lib/legacy-html";
import { redirect } from "next/navigation";

export async function GET() {
  if (!(await isAuthenticated())) redirect("/entrar?next=/app.html");

  const html = await readLegacyHtml("app.html");
  return htmlResponse(html);
}
