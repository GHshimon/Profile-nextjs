-- ============================================================
-- 1. Tables
-- ============================================================

create table public.categories (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,
  name        text        not null,
  description text        not null default '',
  "order"     integer     not null default 0
);

create table public.works (
  id            uuid        primary key default gen_random_uuid(),
  category_id   uuid        not null references public.categories(id) on delete cascade,
  slug          text        not null unique,
  number        text        not null,
  title         text        not null,
  description   text        not null default '',
  detail        text        not null default '',
  tags          text[]      not null default '{}',
  color         text        not null default '',
  "order"       integer     not null default 0,
  published     boolean     not null default false,
  created_at    timestamptz not null default now(),
  thumbnail_url text
);

-- ============================================================
-- 2. Row Level Security
-- ============================================================

alter table public.categories enable row level security;
alter table public.works      enable row level security;

-- 公開ユーザー: 読み取りのみ
create policy "public_read_categories"
  on public.categories for select
  using (true);

create policy "public_read_published_works"
  on public.works for select
  using (published = true);

-- 認証済み (管理者): 全操作
create policy "auth_all_categories"
  on public.categories for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth_all_works"
  on public.works for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- 3. Storage — works-thumbnails バケット
-- ============================================================

insert into storage.buckets (id, name, public)
values ('works-thumbnails', 'works-thumbnails', true)
on conflict (id) do nothing;

create policy "public_read_thumbnails"
  on storage.objects for select
  using (bucket_id = 'works-thumbnails');

create policy "auth_upload_thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'works-thumbnails' and auth.role() = 'authenticated');

create policy "auth_delete_thumbnails"
  on storage.objects for delete
  using (bucket_id = 'works-thumbnails' and auth.role() = 'authenticated');
