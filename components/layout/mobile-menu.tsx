"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ContactDialogTrigger } from "@/components/forms/contact-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const menuItems = [
  { label: "Головна", href: "/" },
  { label: "Асортимент", href: "/assortment" },
  { label: "Контакти", href: "#footer" },
];

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        ref={triggerRef}
        type="button"
        className="masnyi-menu-button"
        aria-label={open ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <SheetContent
        id="mobile-menu-panel"
        className="mobile-sheet"
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus(); }}
      >
        <SheetTitle className="sr-only">Мобільне меню</SheetTitle>
        <div className="mobile-sheet__inner">
          <nav className="mobile-sheet__nav" aria-label="Мобільна навігація">
            {menuItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className="mobile-sheet__link"
                  aria-current={item.href === "/" && pathname === "/" ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="mobile-sheet__footer">
            <div className="mobile-sheet__contacts" aria-label="Контактна інформація">
              <a href="tel:+380000000000">[ТЕЛЕФОН]</a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer">[INSTAGRAM]</a>
              <span>[ВАШЕ МІСТО]</span>
            </div>
            <SheetClose asChild>
              <ContactDialogTrigger className="mobile-sheet__cta">Залишити заявку <span aria-hidden="true">↗</span></ContactDialogTrigger>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
