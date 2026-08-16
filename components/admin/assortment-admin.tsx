"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AssortmentCategory, AssortmentData, AssortmentProduct } from "@/lib/assortment";

type ModalState =
  | { type: "category"; mode: "add" | "edit"; category?: AssortmentCategory }
  | { type: "product"; mode: "add" | "edit"; product?: AssortmentProduct; categoryId?: string }
  | { type: "delete"; entity: "category" | "product"; item: AssortmentCategory | AssortmentProduct }
  | null;

type CategoryPayload = { name: string; displayOrder: number };
type ProductPayload = { categoryId: string; name: string; price: string; tag: string; displayOrder: number };
const inputClass = "admin-input";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-zа-яіїєґ0-9]+/gi, "-").replace(/^-|-$/g, "") || "item";
}

export function AssortmentAdmin({ initialData }: { initialData: AssortmentData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [modal, setModal] = useState<ModalState>(null);
  const [notice, setNotice] = useState("");

  async function refreshData() {
    const response = await fetch("/api/admin/assortment", { cache: "no-store" });
    if (!response.ok) throw new Error("Не вдалося оновити асортимент");
    setData(await response.json() as AssortmentData);
  }

  async function saveCategory(category: AssortmentCategory | undefined, payload: CategoryPayload) {
    const response = await fetch(category ? `/api/admin/assortment/categories/${category.id}` : "/api/admin/assortment/categories", { method: category ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, ...(category ? {} : { id: `${slugify(payload.name)}-${Date.now()}` }) }) });
    if (!response.ok) throw new Error((await response.json() as { error?: string }).error || "Не вдалося зберегти категорію");
    await refreshData(); setModal(null); setNotice("Категорію збережено.");
  }

  async function saveProduct(product: AssortmentProduct | undefined, payload: ProductPayload) {
    const response = await fetch(product ? `/api/admin/assortment/products/${product.id}` : "/api/admin/assortment/products", { method: product ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, ...(product ? {} : { id: `${slugify(payload.name)}-${Date.now()}` }) }) });
    if (!response.ok) throw new Error((await response.json() as { error?: string }).error || "Не вдалося зберегти товар");
    await refreshData(); setModal(null); setNotice("Товар збережено.");
  }

  async function deleteItem() {
    if (!modal || modal.type !== "delete") return;
    const base = modal.entity === "category" ? "categories" : "products";
    const response = await fetch(`/api/admin/assortment/${base}/${modal.item.id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Не вдалося видалити запис");
    await refreshData(); setModal(null); setNotice("Запис видалено.");
  }

  return <div className="admin-app">
    <aside className="admin-sidebar" aria-label="Адмін-навігація"><div className="admin-brand"><span className="admin-brand__mark">М</span><span><strong>М&apos;ЯСНИЙ</strong><small>Панель керування</small></span></div><nav className="admin-nav"><a className="admin-nav__link is-active" href="/admin/assortment"><span aria-hidden="true">▦</span> Асортимент</a><a className="admin-nav__link" href="/" target="_blank" rel="noreferrer"><span aria-hidden="true">↗</span> Переглянути сайт</a></nav><div className="admin-sidebar__footer"><span className="admin-status-dot" aria-hidden="true" /> Підключено до Neon</div></aside>
    <main className="admin-main"><header className="admin-topbar"><div className="admin-breadcrumb">Панель керування <span aria-hidden="true">/</span> <strong>Асортимент</strong></div><div className="admin-topbar__actions"><span className="admin-topbar__avatar" aria-label="Профіль адміністратора">А</span><button type="button" className="admin-icon-button" onClick={async () => { await fetch("/api/admin/session", { method: "DELETE" }); router.push("/admin/sign-in"); router.refresh(); }}>Вийти</button></div></header><div className="admin-content">
      <div className="admin-page-heading"><div><p className="admin-eyebrow">Каталог магазину</p><h1>Асортимент</h1><p>Категорії та позиції, що відображаються на сторінці асортименту</p></div><button type="button" className="admin-button admin-button--primary" onClick={() => setModal({ type: "category", mode: "add" })}><span aria-hidden="true">＋</span> Додати категорію</button></div>
      {notice && <div className="admin-notice" role="status"><span aria-hidden="true">✓</span>{notice}<button type="button" aria-label="Закрити повідомлення" onClick={() => setNotice("")}>×</button></div>}
      <div className="admin-summary"><div><strong>{data.categories.length}</strong><span>Категорій</span></div><div><strong>{data.products.length}</strong><span>Позицій</span></div><div><strong>ОПУБЛІКОВАНО</strong><span>Статус каталогу</span></div></div>
      <div className="admin-category-list">{[...data.categories].sort((a, b) => a.displayOrder - b.displayOrder).map((category) => { const products = data.products.filter((product) => product.categoryId === category.id).sort((a, b) => a.displayOrder - b.displayOrder); return <section className="admin-category-card" key={category.id} aria-labelledby={`admin-category-${category.id}`}><div className="admin-category-card__header"><div className="admin-category-title"><span className="admin-order-badge">{String(category.displayOrder).padStart(2, "0")}</span><div><h2 id={`admin-category-${category.id}`}>{category.name}</h2><p>{products.length} {products.length === 1 ? "позиція" : "позицій"}</p></div></div><div className="admin-row-actions"><button type="button" className="admin-icon-button" aria-label={`Редагувати категорію ${category.name}`} onClick={() => setModal({ type: "category", mode: "edit", category })}>Редагувати</button><button type="button" className="admin-icon-button admin-icon-button--danger" aria-label={`Видалити категорію ${category.name}`} onClick={() => setModal({ type: "delete", entity: "category", item: category })}>Видалити</button></div></div><div className="admin-product-list">{products.map((product) => <ProductRow key={product.id} product={product} onEdit={() => setModal({ type: "product", mode: "edit", product })} onDelete={() => setModal({ type: "delete", entity: "product", item: product })} />)}</div><button type="button" className="admin-add-row" onClick={() => setModal({ type: "product", mode: "add", categoryId: category.id })}><span aria-hidden="true">＋</span> Додати товар</button></section>; })}</div>
    </div></main>
    <AdminModal modal={modal} categories={data.categories} onClose={() => setModal(null)} onSaveCategory={saveCategory} onSaveProduct={saveProduct} onDelete={deleteItem} />
  </div>;
}

function ProductRow({ product, onEdit, onDelete }: { product: AssortmentProduct; onEdit: () => void; onDelete: () => void }) { return <div className="admin-product-row"><div className="admin-product-row__order">{String(product.displayOrder).padStart(2, "0")}</div><div className="admin-product-row__name"><strong>{product.name}</strong>{product.tag && <span>{product.tag}</span>}</div><div className="admin-product-row__price">{product.price}</div><div className="admin-row-actions"><button type="button" className="admin-icon-button" onClick={onEdit}>Редагувати</button><button type="button" className="admin-icon-button admin-icon-button--danger" onClick={onDelete}>Видалити</button></div></div>; }

function AdminModal({ modal, categories, onClose, onSaveCategory, onSaveProduct, onDelete }: { modal: ModalState; categories: AssortmentCategory[]; onClose: () => void; onSaveCategory: (category: AssortmentCategory | undefined, payload: CategoryPayload) => Promise<void>; onSaveProduct: (product: AssortmentProduct | undefined, payload: ProductPayload) => Promise<void>; onDelete: () => Promise<void> }) {
  if (!modal) return null;
  const title = modal.type === "delete" ? "Підтвердження видалення" : modal.type === "category" ? `${modal.mode === "add" ? "Додати" : "Редагувати"} категорію` : `${modal.mode === "add" ? "Додати" : "Редагувати"} товар`;
  return <Dialog.Root open onOpenChange={(open) => !open && onClose()}><Dialog.Portal><Dialog.Overlay className="admin-dialog-overlay" /><Dialog.Content className="admin-dialog" aria-describedby="admin-dialog-description"><div className="admin-dialog__header"><div><Dialog.Title>{title}</Dialog.Title><Dialog.Description id="admin-dialog-description">{modal.type === "delete" ? "Цю дію буде застосовано до даних у Neon." : "Зміни одразу з’являться на публічній сторінці."}</Dialog.Description></div><Dialog.Close asChild><button type="button" className="admin-dialog__close" aria-label="Закрити">×</button></Dialog.Close></div>{modal.type === "delete" ? <DeleteForm modal={modal} onCancel={onClose} onConfirm={onDelete} /> : modal.type === "category" ? <CategoryForm category={modal.category} onCancel={onClose} onSave={(payload) => onSaveCategory(modal.category, payload)} /> : <ProductForm product={modal.product} categoryId={modal.categoryId} categories={categories} onCancel={onClose} onSave={(payload) => onSaveProduct(modal.product, payload)} />}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}

function CategoryForm({ category, onCancel, onSave }: { category?: AssortmentCategory; onCancel: () => void; onSave: (payload: CategoryPayload) => Promise<void> }) { return <form className="admin-form" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); await onSave({ name: String(form.get("name")), displayOrder: Number(form.get("displayOrder")) }); }}><label>Назва категорії<input name="name" className={inputClass} defaultValue={category?.name} placeholder="Наприклад: Яловичина" required /></label><label>Порядок показу<input name="displayOrder" className={inputClass} type="number" min="1" defaultValue={category?.displayOrder ?? 1} required /></label><FormActions onCancel={onCancel} /></form>; }

function ProductForm({ product, categoryId, categories, onCancel, onSave }: { product?: AssortmentProduct; categoryId?: string; categories: AssortmentCategory[]; onCancel: () => void; onSave: (payload: ProductPayload) => Promise<void> }) { return <form className="admin-form" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); await onSave({ categoryId: String(form.get("categoryId")), name: String(form.get("name")), price: String(form.get("price")), tag: String(form.get("tag") || ""), displayOrder: Number(form.get("displayOrder")) }); }}><label>Категорія<select name="categoryId" className={inputClass} defaultValue={product?.categoryId ?? categoryId}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Назва товару<input name="name" className={inputClass} defaultValue={product?.name} placeholder="Наприклад: Стейк Рібай" required /></label><label>Ціна<input name="price" className={inputClass} defaultValue={product?.price} placeholder="Наприклад: від 1 200 грн / кг" required /></label><label>Примітка / тег <span className="admin-form__optional">необов&apos;язково</span><input name="tag" className={inputClass} defaultValue={product?.tag} placeholder="Наприклад: Для гриля" /></label><label>Порядок показу<input name="displayOrder" className={inputClass} type="number" min="1" defaultValue={product?.displayOrder ?? 1} required /></label><FormActions onCancel={onCancel} /></form>; }

function DeleteForm({ modal, onCancel, onConfirm }: { modal: Extract<ModalState, { type: "delete" }>; onCancel: () => void; onConfirm: () => Promise<void> }) { return <div className="admin-delete-confirm"><div className="admin-delete-confirm__icon" aria-hidden="true">!</div><p>Ви хочете видалити <strong>{modal.item.name}</strong>? Цю дію буде застосовано до бази даних.</p><div className="admin-form__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onCancel}>Скасувати</button><button type="button" className="admin-button admin-button--danger" onClick={onConfirm}>Видалити</button></div></div>; }

function FormActions({ onCancel }: { onCancel: () => void }) { return <div className="admin-form__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onCancel}>Скасувати</button><button type="submit" className="admin-button admin-button--primary">Зберегти</button></div>; }
