"use client";

import Image from "next/image";
import Link from "next/link";
import { ContactDialog, ContactDialogTrigger } from "@/components/forms/contact-dialog";
import { Marquee } from "@/components/ui/marquee";

const dinnerCards = [
  { title: "ШВИДКА ВЕЧЕРЯ", image: "/images/masnyi/dinner.jpeg", className: "dinner-card--wide", position: "center" },
  { title: "ГРИЛЬ ІЗ ДРУЗЯМИ", className: "dinner-card--friends" },
  { title: "ДОМАШНЯ КУХНЯ", className: "dinner-card--home" },
  { title: "ХОЧУ ЩОСЬ ОСОБЛИВЕ", image: "/images/masnyi/home.jpeg", className: "dinner-card--special", position: "center" },
];

export function MasnyiHome() {
  return (
    <>
      <section className="masnyi-hero" aria-labelledby="hero-title">
        <div className="masnyi-hero__image" aria-hidden="true"><Image src="/images/masnyi/hero.png" alt="" fill priority sizes="100vw" /></div>
        <div className="masnyi-hero__content">
          <div className="masnyi-hero__copy">
            <h1 id="hero-title">М&apos;ЯСО, ЯКЕ<br />ЗНАЄ СВІЙ<br />ВІДРІЗ.</h1>
            <div className="hero-actions">
              <Link href="/assortment" className="masnyi-button masnyi-button--red">ОБРАТИ М&apos;ЯСО</Link>
              <ContactDialogTrigger className="masnyi-button masnyi-button--outline">ЗАЛИШИТИ ЗАЯВКУ</ContactDialogTrigger>
            </div>
          </div>
        </div>
        <div className="masnyi-hero__mobile" aria-labelledby="mobile-hero-title">
          <h1 id="mobile-hero-title"><span>СВІЖЕ.</span><span>ЩОДНЯ.</span><span>М&apos;ЯСО.</span></h1>
          <div className="masnyi-hero__mobile-image"><Image src="/images/masnyi/mobile-hero.jpeg" alt="Dry aged steak" fill sizes="calc(100vw - 40px)" /></div>
          <div className="masnyi-hero__mobile-tag">[ DRY AGED 21 DAYS ]</div>
          <ContactDialogTrigger className="masnyi-hero__mobile-cta">ЗАМОВИТИ ЗАРАЗ <span aria-hidden="true">→</span></ContactDialogTrigger>
        </div>
      </section>

      <Marquee className="masnyi-marquee" label="Прайм біф — локальні ферми" speed={45}><span className="marquee-copy marquee-copy--desktop">СВІЖЕ МʼЯСО <span className="marquee__separator" aria-hidden="true">·</span></span><span className="marquee-copy marquee-copy--mobile"><b>ПРАЙМ БІФ</b><i>+++</i><b>ЛОКАЛЬНІ ФЕРМИ</b></span></Marquee>

      <span id="how-it-works" className="mobile-anchor-target" aria-hidden="true" />
      <section id="dinner" className="dinner-section" aria-labelledby="dinner-title">
        <div className="dinner-section__inner">
          <h2 id="dinner-title">ЩО БУДЕ НА ВЕЧЕРЮ?</h2>
          <div className="dinner-grid">
            {dinnerCards.map((card) => (
              <Link key={card.title} href="/assortment" className={`dinner-card ${card.className}`}>
                {card.image && <Image src={card.image} alt="" fill sizes="(max-width: 767px) 100vw, 70vw" style={{ objectFit: "cover", objectPosition: card.position }} />}
                {card.image && <div className="dinner-card__overlay" aria-hidden="true" />}
                <h3>{card.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="masnyi-mobile-sticky-cta"><ContactDialogTrigger>ЗАЛИШИТИ ЗАЯВКУ <span aria-hidden="true">↗</span></ContactDialogTrigger></div>
      <ContactDialog />
    </>
  );
}
