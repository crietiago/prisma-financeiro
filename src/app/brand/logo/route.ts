import { getOfficialLogoSvg } from "@/lib/brand";

export async function GET() {
  return new Response(await getOfficialLogoSvg("full"), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
