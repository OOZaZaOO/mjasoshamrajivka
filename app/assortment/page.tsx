import type { Metadata } from "next";
import { AssortmentPage } from "@/components/sections/assortment-page";
import { getAssortmentData } from "@/lib/assortment-db";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Асортимент", description: "Свіже м'ясо від М'ясний Local Butcher." });
export const dynamic = "force-dynamic";

export default async function AssortmentRoute() {
  const data = await getAssortmentData();
  return <AssortmentPage initialData={data} />;
}
