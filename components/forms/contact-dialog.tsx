"use client";

import { useEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import Link from "next/link";

type ContactDialogEvent = CustomEvent<{ productName?: string }>;

let openContactDialog: (() => void) | null = null;

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState("");
  const closeButton = useRef<HTMLButtonElement>(null);
  openContactDialog = () => setOpen(true);

  useEffect(() => {
    const openDialog = (event: Event) => {
      const productName = (event as ContactDialogEvent).detail?.productName;
      setPrefillMessage(productName ? `Цікавить: ${productName}` : "");
      setOpen(true);
    };
    window.addEventListener("open-contact-dialog", openDialog);
    return () => window.removeEventListener("open-contact-dialog", openDialog);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`contact-dialog-backdrop${open ? " is-open" : ""}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title">
        <div className="contact-dialog__header">
          <div>
            <p className="eyebrow">М&apos;ЯСНИЙ</p>
            <h2 id="contact-dialog-title">Залишити заявку</h2>
          </div>
          <button ref={closeButton} type="button" className="dialog-close" onClick={() => setOpen(false)} aria-label="Закрити форму">×</button>
        </div>
        <ContactForm key={prefillMessage} initialMessage={prefillMessage} />
        <p className="contact-dialog__privacy">Натискаючи кнопку, ви погоджуєтесь з <Link href="/privacy">політикою конфіденційності</Link>.</p>
      </div>
    </div>
  );
}

export function ContactDialogTrigger({ children, className = "", onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...props} type="button" className={className} onClick={(event) => { onClick?.(event); openContactDialog?.(); window.dispatchEvent(new CustomEvent("open-contact-dialog")); }}>{children}</button>;
}
