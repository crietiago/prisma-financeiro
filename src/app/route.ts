import { htmlResponse, readLegacyHtml } from "@/lib/legacy-html";

export async function GET() {
  const html = await readLegacyHtml("site.html");
  return htmlResponse(html);
}
