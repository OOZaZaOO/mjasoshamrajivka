export type AssortmentCategory = "all" | "beef" | "pork" | "poultry" | "grill";

export type AssortmentProduct = {
  id: string;
  name: string;
  category: Exclude<AssortmentCategory, "all" | "grill">;
  price: string;
  unit: string;
  tag?: string;
  status?: string;
  featured?: boolean;
};

export const assortmentCategories: Array<{ id: AssortmentCategory; label: string }> = [
  { id: "all", label: "Всі позиції" },
  { id: "beef", label: "Яловичина" },
  { id: "pork", label: "Свинина" },
  { id: "poultry", label: "Птиця" },
  { id: "grill", label: "Гриль" },
];

export const assortmentProducts: AssortmentProduct[] = [
  { id: "beef-ribeye", name: "Стейк Рібай", category: "beef", price: "1200", unit: "грн / кг", tag: "Для гриля", status: "Витримка 21 день", featured: true },
  { id: "beef-new-york", name: "Стейк Нью-Йорк", category: "beef", price: "950", unit: "грн / кг", tag: "Преміум", status: "Преміум", featured: true },
  { id: "beef-shoulder", name: "Лопатка", category: "beef", price: "", unit: "", status: "За запитом" },
  { id: "pork-neck", name: "Свиняча шийка", category: "pork", price: "289", unit: "грн / кг", tag: "Хіт", status: "Ідеально для шашлику", featured: true },
  { id: "pork-ribs", name: "Реберця", category: "pork", price: "", unit: "", status: "За запитом" },
  { id: "beef-mince", name: "Фарш яловичий (нежирний)", category: "beef", price: "380", unit: "грн / кг", tag: "Свіжий помел", status: "Свіжий помел" },
  { id: "pork-collar", name: "Свинячий ошийок", category: "pork", price: "290", unit: "грн / кг", tag: "Ідеально для шашлику", status: "Ідеально для шашлику" },
  { id: "turkey-fillet", name: "Філе індики", category: "poultry", price: "520", unit: "грн / кг", tag: "Дієтичне", status: "Дієтичне" },
];

export const assortmentSections: Array<{ category: Exclude<AssortmentCategory, "all" | "grill">; label: string; number: string }> = [
  { category: "beef", label: "Яловичина", number: "01" },
  { category: "pork", label: "Свинина", number: "02" },
  { category: "poultry", label: "Птиця", number: "03" },
];
