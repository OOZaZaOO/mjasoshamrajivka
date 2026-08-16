import { NextResponse } from "next/server";
import { getAssortmentData } from "@/lib/assortment-db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getAssortmentData());
}
