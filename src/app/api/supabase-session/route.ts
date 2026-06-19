import { getSupabaseUser } from "@/lib/supabase";
import { setSupabaseSessionCookies } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);

  const accessToken = typeof body?.access_token === "string" ? body.access_token : "";
  const refreshToken = typeof body?.refresh_token === "string" ? body.refresh_token : "";
  const expiresIn = Number(body?.expires_in || 3600);

  if (!accessToken || !(await getSupabaseUser(accessToken))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await setSupabaseSessionCookies({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: Number.isFinite(expiresIn) ? expiresIn : 3600,
  });

  return Response.json({ ok: true });
}
