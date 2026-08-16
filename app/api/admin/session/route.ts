import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken, isRateLimited, sessionCookieOptions, verifyAdminPassword } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (isRateLimited(request)) return NextResponse.json({ error: "Забагато невдалих спроб. Спробуйте пізніше." }, { status: 429 });
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password) return NextResponse.json({ error: "Введіть пароль." }, { status: 400 });
  const result = await verifyAdminPassword(body.password, request);
  if (!result.ok) return NextResponse.json({ error: result.locked ? "Забагато невдалих спроб. Спробуйте через 15 хвилин." : "Неправильний пароль." }, { status: result.locked ? 429 : 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
