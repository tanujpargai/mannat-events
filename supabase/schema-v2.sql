-- ============================================================
-- Mannat Events — Phase 2 Migration
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- NEW TABLE: menus (admin-managed meal items)
-- ============================================================
create table if not exists public.menus (
  id          uuid        not null default gen_random_uuid(),
  type        text        not null check (type in ('veg', 'non-veg')),
  name        text        not null,
  description text,
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id)
);

drop trigger if exists set_menus_updated_at on public.menus;
create trigger set_menus_updated_at
  before update on public.menus
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- NEW TABLE: decoration_themes (admin-managed, DB-driven images)
-- ============================================================
create table if not exists public.decoration_themes (
  id          uuid        not null default gen_random_uuid(),
  title       text        not null,
  description text,
  image_url   text,
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id)
);

drop trigger if exists set_themes_updated_at on public.decoration_themes;
create trigger set_themes_updated_at
  before update on public.decoration_themes
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- NEW TABLE: wedding_functions (seeded with 7 defaults)
-- ============================================================
create table if not exists public.wedding_functions (
  id          uuid        not null default gen_random_uuid(),
  name        text        not null,
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  primary key (id)
);

-- ============================================================
-- NEW TABLE: blocked_phones (anti-abuse)
-- ============================================================
create table if not exists public.blocked_phones (
  id          uuid        not null default gen_random_uuid(),
  phone       text        not null unique,
  reason      text,
  blocked_at  timestamptz not null default now(),
  blocked_by  uuid        references public.profiles (id) on delete set null,
  primary key (id)
);

-- ============================================================
-- ALTER: bookings table — drop old, add new columns
-- ============================================================

-- Drop columns superseded by new data model
alter table public.bookings drop column if exists guests;
alter table public.bookings drop column if exists meals;
alter table public.bookings drop column if exists event_type;
alter table public.bookings drop column if exists decoration_theme;
alter table public.bookings drop column if exists theme_colour;
alter table public.bookings drop column if exists room_category;
alter table public.bookings drop column if exists entertainment;
alter table public.bookings drop column if exists photography;
alter table public.bookings drop column if exists transportation;
alter table public.bookings drop column if exists special_requests;

-- Add new columns
alter table public.bookings
  add column if not exists customer_email  text,
  add column if not exists phone           text,
  add column if not exists baraat_style    text,
  add column if not exists decoration_theme_id uuid references public.decoration_themes (id) on delete set null,
  add column if not exists day_plans       jsonb not null default '[]'::jsonb,
  add column if not exists functions       jsonb not null default '[]'::jsonb,
  add column if not exists is_flagged      boolean not null default false;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.menus            enable row level security;
alter table public.decoration_themes enable row level security;
alter table public.wedding_functions enable row level security;
alter table public.blocked_phones   enable row level security;

-- Menus: public read of active items, admin full access
create policy "menus: public read active"
  on public.menus for select
  using (is_active = true);

create policy "menus: admin full access"
  on public.menus for all
  using (public.is_admin())
  with check (public.is_admin());

-- Decoration themes: public read of active items, admin full access
create policy "themes: public read active"
  on public.decoration_themes for select
  using (is_active = true);

create policy "themes: admin full access"
  on public.decoration_themes for all
  using (public.is_admin())
  with check (public.is_admin());

-- Wedding functions: public read of active items, admin full access
create policy "functions: public read active"
  on public.wedding_functions for select
  using (is_active = true);

create policy "functions: admin full access"
  on public.wedding_functions for all
  using (public.is_admin())
  with check (public.is_admin());

-- Blocked phones: admin only (service role for blacklist check in API)
create policy "blocked_phones: admin full access"
  on public.blocked_phones for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists menus_type_active_idx    on public.menus (type, sort_order) where is_active = true;
create index if not exists themes_active_order_idx  on public.decoration_themes (sort_order) where is_active = true;
create index if not exists functions_order_idx      on public.wedding_functions (sort_order) where is_active = true;
create index if not exists blocked_phones_phone_idx on public.blocked_phones (phone);
create index if not exists bookings_flagged_idx     on public.bookings (is_flagged) where is_flagged = true;

-- ============================================================
-- GRANTS
-- ============================================================
grant all    on public.menus             to authenticated;
grant all    on public.decoration_themes to authenticated;
grant all    on public.wedding_functions to authenticated;
grant all    on public.blocked_phones    to authenticated;
grant select on public.menus             to anon;
grant select on public.decoration_themes to anon;
grant select on public.wedding_functions to anon;

-- ============================================================
-- SEED: Wedding Functions
-- ============================================================
insert into public.wedding_functions (name, sort_order) values
  ('Mehendi',           1),
  ('Haldi',             2),
  ('Sangeet',           3),
  ('Wedding Ceremony',  4),
  ('Mandap Decoration', 5),
  ('Baraat',            6),
  ('Hath Teela',        7)
on conflict do nothing;

-- ============================================================
-- SEED: Decoration Themes (admin will upload image URLs later)
-- ============================================================
insert into public.decoration_themes (title, description, image_url, sort_order) values
  (
    'Floral Elegance',
    'A dreamy garden celebration with fresh blooms, soft pastel palettes, and floral archways that transform your venue into a romantic paradise.',
    null,
    1
  ),
  (
    'Royal Luxury',
    'Opulent gold and ivory regalia, dramatic drapery, and regal décor that creates an atmosphere of timeless grandeur fit for royalty.',
    null,
    2
  ),
  (
    'Traditional Indian',
    'Rich marigold garlands, vibrant reds, and intricate mandap craftsmanship celebrating the authentic beauty of Indian wedding traditions.',
    null,
    3
  ),
  (
    'Modern Minimalist',
    'Clean architectural lines, neutral tones with deliberate gold accents, and curated elements that let the love story be the centrepiece.',
    null,
    4
  )
on conflict do nothing;

-- ============================================================
-- SEED: Veg Menu Items
-- ============================================================
insert into public.menus (type, name, description, sort_order) values
  ('veg', 'Paneer Butter Masala',  'Cottage cheese in rich tomato-cream sauce',           1),
  ('veg', 'Dal Makhani',           'Slow-cooked black lentils with cream and butter',      2),
  ('veg', 'Veg Biryani',           'Fragrant basmati rice with vegetables and spices',     3),
  ('veg', 'Shahi Paneer',          'Paneer in royal cashew-cream gravy',                   4),
  ('veg', 'Aloo Gobi',             'Spiced potato and cauliflower',                        5),
  ('veg', 'Stuffed Paratha',       'Whole wheat flatbread with spiced filling',            6),
  ('veg', 'Palak Paneer',          'Cottage cheese in fresh spinach gravy',                7),
  ('veg', 'Chole Bhature',         'Spiced chickpeas with fried puffed bread',             8)
on conflict do nothing;

-- ============================================================
-- SEED: Non-Veg Menu Items
-- ============================================================
insert into public.menus (type, name, description, sort_order) values
  ('non-veg', 'Butter Chicken',     'Tender chicken in velvety tomato-butter sauce',      1),
  ('non-veg', 'Mutton Rogan Josh',  'Slow-braised lamb with Kashmiri spices',             2),
  ('non-veg', 'Chicken Biryani',    'Aromatic basmati rice layered with spiced chicken',  3),
  ('non-veg', 'Fish Curry',         'Fresh catch simmered in coastal masala',             4),
  ('non-veg', 'Seekh Kebab',        'Minced lamb skewers with herbs and spices',          5),
  ('non-veg', 'Chicken Tikka',      'Tandoor-roasted chicken with yogurt marinade',       6),
  ('non-veg', 'Prawn Masala',       'Plump prawns in spiced onion-tomato gravy',          7),
  ('non-veg', 'Mutton Biryani',     'Slow-cooked mutton layered in saffron basmati',      8)
on conflict do nothing;
