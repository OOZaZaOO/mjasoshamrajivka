const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const siteConfig = {
  name: "М'ясний",
  companyName: "М'ясний Local Butcher",
  url: siteUrl,
  description: "М'ясо, яке знає свій відріз. Local butcher — свіже, бо важливо.",
  contact: { phone: "+380 00 000 00 00", email: "hello@myasnyi.ua", address: "Україна" },
  social: { instagram: "", linkedin: "", facebook: "" },
  seo: { titleTemplate: "%s | М'ясний", defaultTitle: "М'ясний — Local Butcher" },
} as const;

export type SiteConfig = typeof siteConfig;
