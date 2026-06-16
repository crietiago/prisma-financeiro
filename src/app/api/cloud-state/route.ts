import { getCurrentSupabaseUser, getSupabaseAccessToken } from "@/lib/auth";
import { readCloudState, writeCloudState } from "@/lib/supabase";

export async function GET() {
  const token = await getSupabaseAccessToken();
  const user = await getCurrentSupabaseUser();

  if (!token || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const state = await readCloudState(token, user.id);
  return Response.json({ data: state?.data || null, updated_at: state?.updated_at || null });
}

export async function PUT(request: Request) {
  const token = await getSupabaseAccessToken();
  const user = await getCurrentSupabaseUser();

  if (!token || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("data" in body)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const ok = await writeCloudState(token, user.id, body.data);
  if (!ok) return Response.json({ error: "Could not save state" }, { status: 502 });

  return Response.json({ ok: true });
}
