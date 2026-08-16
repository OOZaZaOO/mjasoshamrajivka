create table if not exists assortment_categories (
  id text primary key,
  name text not null,
  display_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assortment_products (
  id text primary key,
  category_id text not null references assortment_categories(id) on delete cascade,
  name text not null,
  price text not null,
  tag text,
  display_order integer not null default 1,
  status text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assortment_categories_order_idx
  on assortment_categories (display_order, name);

create index if not exists assortment_products_category_order_idx
  on assortment_products (category_id, display_order, name);
