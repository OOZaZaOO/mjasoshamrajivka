"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactDialogTrigger } from "@/components/forms/contact-dialog";

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  const close = () => setOpen(false);
  return <header className="masnyi-header"><div className="masnyi-header__inner"><Link href="/" className="masnyi-logo" aria-label="М'ясний — на головну">М&apos;ЯСНИЙ</Link><nav className="masnyi-nav" aria-label="Основна навігація"><Link href="#dinner">АСОРТИМЕНТ</Link><Link href="#footer">КОНТАКТИ</Link></nav><ContactDialogTrigger className="masnyi-header__cta">Залишити заявку</ContactDialogTrigger><button ref={menuButton} type="button" className="masnyi-menu-button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span>{open ? "Закрити" : "Меню"}</span></button></div>{open && <nav id="mobile-navigation" className="masnyi-mobile-nav" aria-label="Мобільна навігація"><Link href="#dinner" onClick={close}>АСОРТИМЕНТ</Link><Link href="#footer" onClick={close}>КОНТАКТИ</Link><ContactDialogTrigger className="masnyi-header__cta" onClick={close}>Залишити заявку</ContactDialogTrigger></nav>}</header>;
}
