import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json() as { name?: string; displayOrder?: number };
  if (!body.name?.trim() || !Number.isInteger(body.displayOrder)) return NextResponse.json({ error: "Некоректні дані категорії" }, { status: 400 });
  const sql = getDb();
  const rows = await sql`
    update assortment_categories set name = ${body.name.trim()}, display_order = ${body.displayOrder}, updated_at = now()
    where id = ${id}
    returning id, name, display_order as "displayOrder"
  ` as unknown as Array<{ id: string; name: string; displayOrder: number }>;
  if (!rows[0]) return NextResponse.json({ error: "Категорію не знайдено" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const sql = getDb();
  await sql`delete from assortment_categories where id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
