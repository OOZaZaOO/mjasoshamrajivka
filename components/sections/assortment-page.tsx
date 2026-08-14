"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ContactDialog, ContactDialogTrigger } from "@/components/forms/contact-dialog";
import { Marquee } from "@/components/ui/marquee";
import { assortmentCategories, assortmentProducts, assortmentSections, type AssortmentCategory, type AssortmentProduct } from "@/lib/assortment";

function openProductRequest(product: AssortmentProduct) {
  window.dispatchEvent(new CustomEvent("open-contact-dialog", { detail: { productName: product.name } }));
}

function ProductRow({ product }: { product: AssortmentProduct }) {
  return (
    <li className="assortment-product">
      <button type="button" className="assortment-product__button" onClick={() => openProductRequest(product)}>
        <span className="assortment-product__main">
          <strong>{product.name}</strong>
          {product.tag && <span className="assortment-product__tag">{product.tag}</span>}
        </span>
        <span className="assortment-product__meta">
          {product.price ? <>від {product.price} {product.unit}</> : product.status}
        </span>
      </button>
      {product.status && product.price && <span className="assortment-product__mobile-status">{product.status}</span>}
    </li>
  );
}

export function AssortmentPage() {
  const [activeCategory, setActiveCategory] = useState<AssortmentCategory>("all");
  const visibleSections = useMemo(() => assortmentSections.filter((section) => activeCategory === "all" || activeCategory === section.category || activeCategory === "grill"), [activeCategory]);

  return (
    <>
      <div className="assortment-page">
        <section className="assortment-hero" aria-labelledby="assortment-title">
          <div className="assortment-hero__copy">
            <h1 id="assortment-title">СВІЖЕ НА<br />СЬОГОДНІ.</h1>
            <p>Наші м&apos;ясники щодня готують свіжі відруби. Якщо ви не впевнені, що саме підійде для вашої страви — ми завжди тут, щоб допомогти.</p>
            <ContactDialogTrigger className="assortment-button">Допоможіть обрати</ContactDialogTrigger>
          </div>
          <div className="assortment-hero__art">
            <span className="assortment-hero__cut">CUT/01</span>
            <div className="assortment-hero__masked-image"><Image src="/images/masnyi/assortment-steak.jpeg" alt="Свіжий стейк на дошці" fill priority sizes="(max-width: 767px) calc(100vw - 32px), 360px" /></div>
            <span className="assortment-hero__today">СЬОГОДНІ</span>
          </div>
        </section>

        <Marquee className="assortment-marquee" label="Категорії м'яса" speed={45}>
          <span>ЯЛОВИЧИНА</span><i aria-hidden="true">•</i><span>СВИНИНА</span><i aria-hidden="true">•</i><span>ПТИЦЯ</span><i aria-hidden="true">•</i><span>ДЛЯ ГРИЛЮ</span><i aria-hidden="true">•</i><span>НАБОРИ</span><i aria-hidden="true">•</i>
        </Marquee>

        <section className="assortment-catalog" aria-labelledby="catalog-title">
          <div className="assortment-category-nav" role="tablist" aria-label="Категорії асортименту">
            {assortmentCategories.map((category) => (
              <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? "is-active" : ""} onClick={() => setActiveCategory(category.id)}>{category.label}</button>
            ))}
          </div>
          <h2 id="catalog-title" className="sr-only">Каталог м&apos;яса</h2>
          <div className="assortment-sections">
            {visibleSections.map((section) => {
              const products = assortmentProducts.filter((product) => product.category === section.category);
              return <section key={section.category} className="assortment-section" aria-labelledby={`assortment-${section.category}`}>
                <div className="assortment-section__heading"><h3 id={`assortment-${section.category}`}>{section.label}</h3><span>{section.number}</span></div>
                <ul>{products.map((product) => <ProductRow key={product.id} product={product} />)}</ul>
              </section>;
            })}
          </div>
        </section>

        <section className="assortment-contact-cta" aria-labelledby="assortment-contact-title">
          <h2 id="assortment-contact-title">НЕ ЗНАЙШЛИ ПОТРІБНОГО?</h2>
          <p>Напишіть нам у Telegram. Ми можемо підготувати специфічні відруби<br className="desktop-only" /> на замовлення або підказати потрібний шматок до вашого приходу.</p>
          <a href="https://t.me/" target="_blank" rel="noreferrer" className="assortment-button assortment-button--light">Написати в Telegram</a>
        </section>
      </div>
      <ContactDialog />
    </>
  );
}
