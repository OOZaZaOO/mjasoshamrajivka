"use client";

import Link from "next/link";
import { ContactDialogTrigger } from "@/components/forms/contact-dialog";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  return <header className="masnyi-header"><div className="masnyi-header__inner"><Link href="/" className="masnyi-logo" aria-label="М'ясний — на головну">М&apos;ЯСНИЙ</Link><nav className="masnyi-nav" aria-label="Основна навігація"><Link href="/assortment">АСОРТИМЕНТ</Link><Link href="#footer">КОНТАКТИ</Link></nav><ContactDialogTrigger className="masnyi-header__cta">Залишити заявку</ContactDialogTrigger><div className="masnyi-header__mobile-actions"><ContactDialogTrigger className="masnyi-header__mobile-cta" aria-label="Залишити заявку">→</ContactDialogTrigger><MobileMenu /></div></div></header>;
}
