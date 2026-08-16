"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function SiteChrome({ position }: { position: "header" | "footer" }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return position === "header" ? <Header /> : <Footer />;
}
