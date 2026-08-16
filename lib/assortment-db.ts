import type { AssortmentCategory, AssortmentData, AssortmentProduct } from "@/lib/assortment";
import { getDb } from "@/lib/db";

type CategoryRow = Omit<AssortmentCategory, "products">;

export async function getAssortmentData(): Promise<AssortmentData> {
  const sql = getDb();
  const categories = await sql`
    select id, name, display_order as "displayOrder"
    from assortment_categories
    order by display_order asc, name asc
  ` as unknown as CategoryRow[];
  const products = await sql`
    select id, category_id as "categoryId", name, price, tag,
      display_order as "displayOrder", status, featured
    from assortment_products
    order by display_order asc, name asc
  ` as unknown as AssortmentProduct[];

  return { categories, products };
}

export async function getCategoryById(id: string) {
  const sql = getDb();
  const rows = await sql`
    select id, name, display_order as "displayOrder"
    from assortment_categories where id = ${id}
  ` as unknown as CategoryRow[];
  return rows[0] ?? null;
}
