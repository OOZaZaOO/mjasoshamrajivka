import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = createMetadata();
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="uk"><body><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">Перейти до вмісту</a><Header /><main id="main-content">{children}</main><Footer /></body></html>; }
