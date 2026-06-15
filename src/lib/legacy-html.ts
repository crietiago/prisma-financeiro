import { readFile } from "node:fs/promises";
import path from "node:path";

function legacyPath(fileName: "site.html" | "app.html") {
  return path.join(process.cwd(), "legacy", fileName);
}

export async function readLegacyHtml(fileName: "site.html" | "app.html") {
  return readFile(legacyPath(fileName), "utf8");
}

export function htmlResponse(html: string, init?: ResponseInit) {
  return new Response(html, {
    ...init,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      ...(init?.headers || {}),
    },
  });
}
