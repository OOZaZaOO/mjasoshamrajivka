import { NextResponse } from "next/server";
import { getAssortmentData } from "@/lib/assortment-db";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAssortmentData());
}
