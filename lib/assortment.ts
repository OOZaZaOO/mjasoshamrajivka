export type AssortmentCategoryId = string;

export type AssortmentCategory = {
  id: AssortmentCategoryId;
  name: string;
  displayOrder: number;
  /** Hydrated relation for UI consumers; mock/Supabase storage may keep this normalized. */
  products?: AssortmentProduct[];
};

export type AssortmentProduct = {
  id: string;
  categoryId: AssortmentCategoryId;
  name: string;
  price: string;
  tag?: string;
  displayOrder: number;
  status?: string;
  featured?: boolean;
};

export type AssortmentData = {
  categories: AssortmentCategory[];
  products: AssortmentProduct[];
};

export const assortmentCategories: Array<{ id: "all" | AssortmentCategoryId; label: string }> = [
  { id: "all", label: "Всі позиції" },
  { id: "beef", label: "Яловичина" },
  { id: "pork", label: "Свинина" },
  { id: "poultry", label: "Птиця" },
  { id: "grill", label: "Гриль" },
];

export const assortmentMockData: AssortmentData = {
  categories: [
    { id: "beef", name: "Яловичина", displayOrder: 1 },
    { id: "pork", name: "Свинина", displayOrder: 2 },
    { id: "poultry", name: "Птиця", displayOrder: 3 },
  ],
  products: [
    { id: "beef-ribeye", categoryId: "beef", name: "Стейк Рібай", price: "від 1 200 грн / кг", tag: "Для гриля", displayOrder: 1, status: "Витримка 21 день", featured: true },
    { id: "beef-new-york", categoryId: "beef", name: "Стейк Нью-Йорк", price: "від 950 грн / кг", tag: "Преміум", displayOrder: 2, featured: true },
    { id: "beef-shoulder", categoryId: "beef", name: "Лопатка", price: "За запитом", displayOrder: 3 },
    { id: "beef-mince", categoryId: "beef", name: "Фарш яловичий (нежирний)", price: "від 380 грн / кг", tag: "Свіжий помел", displayOrder: 4 },
    { id: "pork-neck", categoryId: "pork", name: "Свиняча шийка", price: "від 289 грн / кг", tag: "Хіт", displayOrder: 1, status: "Ідеально для шашлику", featured: true },
    { id: "pork-ribs", categoryId: "pork", name: "Реберця", price: "За запитом", displayOrder: 2 },
    { id: "pork-collar", categoryId: "pork", name: "Свинячий ошийок", price: "290 грн / кг", tag: "Ідеально для шашлику", displayOrder: 3 },
    { id: "turkey-fillet", categoryId: "poultry", name: "Філе індики", price: "520 грн / кг", tag: "Дієтичне", displayOrder: 1 },
  ],
};

export const assortmentProducts = assortmentMockData.products;

export const assortmentSections = assortmentMockData.categories.map((category) => ({
  category: category.id,
  label: category.name,
  number: String(category.displayOrder).padStart(2, "0"),
}));
