"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";
import { assortmentMockData, type AssortmentCategory, type AssortmentProduct } from "@/lib/assortment";

type ModalState =
  | { type: "category"; mode: "add" | "edit"; category?: AssortmentCategory }
  | { type: "product"; mode: "add" | "edit"; product?: AssortmentProduct; categoryId?: AssortmentCategory["id"] }
  | { type: "delete"; entity: "category" | "product"; name: string }
  | null;

const inputClass = "admin-input";

export function AssortmentAdmin() {
  const [modal, setModal] = useState<ModalState>(null);
  const [notice, setNotice] = useState("");
  const categories = useMemo(() => [...assortmentMockData.categories].sort((a, b) => a.displayOrder - b.displayOrder), []);

  function showDemoNotice(message: string) {
    setModal(null);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 5000);
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar" aria-label="Адмін-навігація">
        <div className="admin-brand"><span className="admin-brand__mark">М</span><span><strong>М&apos;ЯСНИЙ</strong><small>Панель керування</small></span></div>
        <nav className="admin-nav">
          <a className="admin-nav__link is-active" href="/admin/assortment"><span aria-hidden="true">▦</span> Асортимент</a>
          <a className="admin-nav__link" href="/" target="_blank" rel="noreferrer"><span aria-hidden="true">↗</span> Переглянути сайт</a>
        </nav>
        <div className="admin-sidebar__footer"><span className="admin-status-dot" aria-hidden="true" /> Демонстраційний режим</div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar"><div className="admin-breadcrumb">Панель керування <span aria-hidden="true">/</span> <strong>Асортимент</strong></div><span className="admin-topbar__avatar" aria-label="Профіль адміністратора">А</span></header>
        <div className="admin-content">
          <div className="admin-page-heading"><div><p className="admin-eyebrow">Каталог магазину</p><h1>Асортимент</h1><p>Категорії та позиції, що відображаються на сторінці асортименту</p></div><button type="button" className="admin-button admin-button--primary" onClick={() => setModal({ type: "category", mode: "add" })}><span aria-hidden="true">＋</span> Додати категорію</button></div>

          {notice && <div className="admin-notice" role="status"><span aria-hidden="true">✓</span>{notice}<button type="button" aria-label="Закрити повідомлення" onClick={() => setNotice("")}>×</button></div>}

          <div className="admin-summary"><div><strong>{categories.length}</strong><span>Категорій</span></div><div><strong>{assortmentMockData.products.length}</strong><span>Позицій</span></div><div><strong>ОПУБЛІКОВАНО</strong><span>Статус каталогу</span></div></div>

          <div className="admin-category-list">
            {categories.map((category) => {
              const products = assortmentMockData.products.filter((product) => product.categoryId === category.id).sort((a, b) => a.displayOrder - b.displayOrder);
              return <section className="admin-category-card" key={category.id} aria-labelledby={`admin-category-${category.id}`}>
                <div className="admin-category-card__header"><div className="admin-category-title"><span className="admin-order-badge">{String(category.displayOrder).padStart(2, "0")}</span><div><h2 id={`admin-category-${category.id}`}>{category.name}</h2><p>{products.length} {products.length === 1 ? "позиція" : "позицій"}</p></div></div><div className="admin-row-actions"><button type="button" className="admin-icon-button" aria-label={`Редагувати категорію ${category.name}`} onClick={() => setModal({ type: "category", mode: "edit", category })}>Редагувати</button><button type="button" className="admin-icon-button admin-icon-button--danger" aria-label={`Видалити категорію ${category.name}`} onClick={() => setModal({ type: "delete", entity: "category", name: category.name })}>Видалити</button></div></div>
                <div className="admin-product-list">{products.map((product) => <ProductRow key={product.id} product={product} onEdit={() => setModal({ type: "product", mode: "edit", product })} onDelete={() => setModal({ type: "delete", entity: "product", name: product.name })} />)}</div>
                <button type="button" className="admin-add-row" onClick={() => setModal({ type: "product", mode: "add", categoryId: category.id })}><span aria-hidden="true">＋</span> Додати товар</button>
              </section>;
            })}
          </div>
        </div>
      </main>

      <AdminModal modal={modal} onClose={() => setModal(null)} onDemoSave={() => showDemoNotice("Збереження буде підключено після інтеграції Supabase.")} onDemoDelete={() => showDemoNotice("Видалення буде підключено після інтеграції Supabase.")} />
    </div>
  );
}

function ProductRow({ product, onEdit, onDelete }: { product: AssortmentProduct; onEdit: () => void; onDelete: () => void }) {
  return <div className="admin-product-row"><div className="admin-product-row__order">{String(product.displayOrder).padStart(2, "0")}</div><div className="admin-product-row__name"><strong>{product.name}</strong>{product.tag && <span>{product.tag}</span>}</div><div className="admin-product-row__price">{product.price}</div><div className="admin-row-actions"><button type="button" className="admin-icon-button" onClick={onEdit}>Редагувати</button><button type="button" className="admin-icon-button admin-icon-button--danger" onClick={onDelete}>Видалити</button></div></div>;
}

function AdminModal({ modal, onClose, onDemoSave, onDemoDelete }: { modal: ModalState; onClose: () => void; onDemoSave: () => void; onDemoDelete: () => void }) {
  if (!modal) return null;
  const title = modal.type === "delete" ? "Підтвердження видалення" : modal.type === "category" ? `${modal.mode === "add" ? "Додати" : "Редагувати"} категорію` : `${modal.mode === "add" ? "Додати" : "Редагувати"} товар`;
  return <Dialog.Root open onOpenChange={(open) => !open && onClose()}><Dialog.Portal><Dialog.Overlay className="admin-dialog-overlay" /><Dialog.Content className="admin-dialog" aria-describedby="admin-dialog-description"><div className="admin-dialog__header"><div><Dialog.Title>{title}</Dialog.Title><Dialog.Description id="admin-dialog-description">{modal.type === "delete" ? "Цю дію буде підключено після інтеграції даних." : "Демонстраційна форма структури майбутнього каталогу."}</Dialog.Description></div><Dialog.Close asChild><button type="button" className="admin-dialog__close" aria-label="Закрити">×</button></Dialog.Close></div>{modal.type === "delete" ? <DeleteForm modal={modal} onCancel={onClose} onConfirm={onDemoDelete} /> : modal.type === "category" ? <CategoryForm category={modal.category} onCancel={onClose} onSave={onDemoSave} /> : <ProductForm product={modal.product} categoryId={modal.categoryId} onCancel={onClose} onSave={onDemoSave} />}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}

function CategoryForm({ category, onCancel, onSave }: { category?: AssortmentCategory; onCancel: () => void; onSave: () => void }) {
  return <form className="admin-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}><label>Назва категорії<input className={inputClass} defaultValue={category?.name} placeholder="Наприклад: Яловичина" required /></label><label>Порядок показу<input className={inputClass} type="number" min="1" defaultValue={category?.displayOrder ?? 1} required /></label><FormActions onCancel={onCancel} /></form>;
}

function ProductForm({ product, categoryId, onCancel, onSave }: { product?: AssortmentProduct; categoryId?: AssortmentProduct["categoryId"]; onCancel: () => void; onSave: () => void }) {
  return <form className="admin-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}><label>Категорія<select className={inputClass} defaultValue={product?.categoryId ?? categoryId ?? "beef"}>{assortmentMockData.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Назва товару<input className={inputClass} defaultValue={product?.name} placeholder="Наприклад: Стейк Рібай" required /></label><label>Ціна<input className={inputClass} defaultValue={product?.price} placeholder="Наприклад: від 1 200 грн / кг" required /></label><label>Примітка / тег <span className="admin-form__optional">необов&apos;язково</span><input className={inputClass} defaultValue={product?.tag} placeholder="Наприклад: Для гриля" /></label><label>Порядок показу<input className={inputClass} type="number" min="1" defaultValue={product?.displayOrder ?? 1} required /></label><FormActions onCancel={onCancel} /></form>;
}

function DeleteForm({ modal, onCancel, onConfirm }: { modal: Extract<ModalState, { type: "delete" }>; onCancel: () => void; onConfirm: () => void }) {
  return <div className="admin-delete-confirm"><div className="admin-delete-confirm__icon" aria-hidden="true">!</div><p>Ви хочете видалити <strong>{modal.name}</strong>? Ця демонстраційна дія не змінить дані.</p><div className="admin-form__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onCancel}>Скасувати</button><button type="button" className="admin-button admin-button--danger" onClick={onConfirm}>Видалити</button></div></div>;
}

function FormActions({ onCancel }: { onCancel: () => void }) {
  return <div className="admin-form__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onCancel}>Скасувати</button><button type="submit" className="admin-button admin-button--primary">Зберегти</button></div>;
}
