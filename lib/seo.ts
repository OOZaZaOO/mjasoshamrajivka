import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export function createMetadata(options: { title?: string; description?: string; path?: string; noIndex?: boolean } = {}): Metadata {
  const title = options.title ?? siteConfig.seo.defaultTitle;
  const description = options.description ?? siteConfig.description;
  const url = new URL(options.path ?? "/", siteConfig.url);
  return {
    title: options.title ?? { default: title, template: siteConfig.seo.titleTemplate },
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    robots: options.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, url, siteName: siteConfig.name, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: "/favicon.svg" },
  };
}
