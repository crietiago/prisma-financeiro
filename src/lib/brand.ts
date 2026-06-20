import { readLegacyHtml } from "./legacy-html";

const OFFICIAL_LOGO_PATTERN =
  /<nav[^>]*>[\s\S]*?<img class="logo" src="data:image\/svg\+xml;base64,([^"]+)"/;

async function readOfficialLogoSvg() {
  const html = await readLegacyHtml("site.html");
  const match = html.match(OFFICIAL_LOGO_PATTERN);

  if (!match?.[1]) throw new Error("Official Prisma logo was not found.");
  return Buffer.from(match[1], "base64").toString("utf8");
}

export async function getOfficialLogoSvg(variant: "full" | "symbol" = "full") {
  const svg = await readOfficialLogoSvg();
  if (variant === "full") return svg;

  return svg.replace('viewBox="0 0 1003 367"', 'viewBox="0 0 367 367"');
}
