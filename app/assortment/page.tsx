import type { Metadata } from "next";
import { AssortmentPage } from "@/components/sections/assortment-page";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Асортимент", description: "Свіже м'ясо від М'ясний Local Butcher." });

export default function AssortmentRoute() {
  return <AssortmentPage />;
}
