import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { id?: string; categoryId?: string; name?: string; price?: string; tag?: string; displayOrder?: number };
  if (!body.id || !body.categoryId || !body.name?.trim() || !body.price?.trim() || !Number.isInteger(body.displayOrder)) return NextResponse.json({ error: "Некоректні дані товару" }, { status: 400 });
  const sql = getDb();
  const rows = await sql`
    insert into assortment_products (id, category_id, name, price, tag, display_order)
    values (${body.id}, ${body.categoryId}, ${body.name.trim()}, ${body.price.trim()}, ${body.tag?.trim() || null}, ${body.displayOrder})
    returning id, category_id as "categoryId", name, price, tag, display_order as "displayOrder", status, featured
  ` as unknown as Array<{ id: string; categoryId: string; name: string; price: string; tag?: string; displayOrder: number }>;
  return NextResponse.json(rows[0], { status: 201 });
}
