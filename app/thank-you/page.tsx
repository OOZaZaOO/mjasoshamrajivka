import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Thank you", path: "/thank-you", noIndex: true });
export default function ThankYouPage() { return <Section><Container><div className="max-w-xl"><p className="text-sm font-semibold uppercase tracking-widest text-accent">Message received</p><h1 className="mt-4 text-4xl font-semibold tracking-tight">Thank you for reaching out.</h1><p className="mt-4 leading-7 text-muted">We’ll review your message and get back to you soon.</p></div></Container></Section>; }
