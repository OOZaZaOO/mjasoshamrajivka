import { AssortmentAdmin } from "@/components/admin/assortment-admin";
import { getAssortmentData } from "@/lib/assortment-db";

export const dynamic = "force-dynamic";

export default async function AdminAssortmentPage() {
  const data = await getAssortmentData();
  return <AssortmentAdmin initialData={data} />;
}
