export const siteConfig = {
  name: "Landing Starter",
  companyName: "Your Company",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description: "A reusable, accessible foundation for client landing pages.",
  contact: { phone: "+1 (000) 000-0000", email: "hello@example.com", address: "Your address" },
  social: { instagram: "", linkedin: "", facebook: "" },
  seo: { titleTemplate: "%s | Landing Starter", defaultTitle: "Landing Starter" },
} as const;

export type SiteConfig = typeof siteConfig;
