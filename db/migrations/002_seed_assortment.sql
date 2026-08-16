insert into assortment_categories (id, name, display_order)
values
  ('beef', 'Яловичина', 1),
  ('pork', 'Свинина', 2),
  ('poultry', 'Птиця', 3)
on conflict (id) do nothing;

insert into assortment_products (id, category_id, name, price, tag, display_order, status, featured)
values
  ('beef-ribeye', 'beef', 'Стейк Рібай', 'від 1 200 грн / кг', 'Для гриля', 1, 'Витримка 21 день', true),
  ('beef-new-york', 'beef', 'Стейк Нью-Йорк', 'від 950 грн / кг', 'Преміум', 2, null, true),
  ('beef-shoulder', 'beef', 'Лопатка', 'За запитом', null, 3, null, false),
  ('beef-mince', 'beef', 'Фарш яловичий (нежирний)', 'від 380 грн / кг', 'Свіжий помел', 4, null, false),
  ('pork-neck', 'pork', 'Свиняча шийка', 'від 289 грн / кг', 'Хіт', 1, 'Ідеально для шашлику', true),
  ('pork-ribs', 'pork', 'Реберця', 'За запитом', null, 2, null, false),
  ('pork-collar', 'pork', 'Свинячий ошийок', '290 грн / кг', 'Ідеально для шашлику', 3, null, false),
  ('turkey-fillet', 'poultry', 'Філе індики', '520 грн / кг', 'Дієтичне', 1, null, false)
on conflict (id) do nothing;
