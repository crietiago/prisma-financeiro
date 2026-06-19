import { clearSessionCookie } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/request-security";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await clearSessionCookie();
  redirect("/entrar?saiu=1");
}
