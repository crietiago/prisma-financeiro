import { clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST() {
  await clearSessionCookie();
  redirect("/entrar?saiu=1");
}
