import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json() as { categoryId?: string; name?: string; price?: string; tag?: string; displayOrder?: number };
  if (!body.categoryId || !body.name?.trim() || !body.price?.trim() || !Number.isInteger(body.displayOrder)) return NextResponse.json({ error: "Некоректні дані товару" }, { status: 400 });
  const sql = getDb();
  const rows = await sql`
    update assortment_products set category_id = ${body.categoryId}, name = ${body.name.trim()}, price = ${body.price.trim()}, tag = ${body.tag?.trim() || null}, display_order = ${body.displayOrder}, updated_at = now()
    where id = ${id}
    returning id, category_id as "categoryId", name, price, tag, display_order as "displayOrder", status, featured
  ` as unknown as Array<{ id: string; categoryId: string; name: string; price: string; tag?: string; displayOrder: number }>;
  if (!rows[0]) return NextResponse.json({ error: "Товар не знайдено" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const sql = getDb();
  await sql`delete from assortment_products where id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
