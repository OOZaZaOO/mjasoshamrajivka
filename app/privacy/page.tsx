import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Privacy", path: "/privacy" });
export default function PrivacyPage() { return <Section><Container><article className="prose max-w-2xl"><p className="text-sm font-semibold uppercase tracking-widest text-accent">Template / placeholder</p><h1>Privacy notice</h1><p>This starter text is not a legally complete privacy policy. Adapt it with the client’s legal counsel, data flows, vendors, retention periods and jurisdiction before publishing.</p><h2>What to customize</h2><p>Document the information collected through this site, the purpose and legal basis for processing, contact details, third-party services, retention, user rights and cookie choices.</p></article></Container></Section>; }
