import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { id?: string; name?: string; displayOrder?: number };
  if (!body.id || !body.name?.trim() || !Number.isInteger(body.displayOrder)) return NextResponse.json({ error: "Некоректні дані категорії" }, { status: 400 });
  const sql = getDb();
  const rows = await sql`
    insert into assortment_categories (id, name, display_order)
    values (${body.id}, ${body.name.trim()}, ${body.displayOrder})
    returning id, name, display_order as "displayOrder"
  ` as unknown as Array<{ id: string; name: string; displayOrder: number }>;
  return NextResponse.json(rows[0], { status: 201 });
}
