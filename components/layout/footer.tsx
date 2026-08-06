import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export function Footer() { return <footer className="border-t border-line py-8"><Container><div className="flex flex-col justify-between gap-4 text-sm text-muted sm:flex-row"><p>© {new Date().getFullYear()} {siteConfig.companyName}</p><div className="flex gap-5"><Link href="/privacy" className="hover:text-ink">Privacy</Link><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-ink">{siteConfig.contact.email}</a></div></div></Container></footer>; }
