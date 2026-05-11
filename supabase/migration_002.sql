-- Moonshine Mathematics — extension: tags, activity, pages, storage
-- Run this in the Supabase SQL editor AFTER migration.sql.

-- ─── tags ────────────────────────────────────────────────────────────────────

create table if not exists public.tags (
  name text primary key,
  created_at timestamptz not null default now()
);

alter table public.tags enable row level security;

drop policy if exists "tags: public read" on public.tags;
drop policy if exists "tags: authenticated write" on public.tags;

create policy "tags: public read"
  on public.tags for select
  to anon, authenticated
  using (true);

create policy "tags: authenticated write"
  on public.tags for all
  to authenticated
  using (true) with check (true);

insert into public.tags (name) values
  ('Vector Spaces'), ('Linear Maps'), ('Bases'), ('Determinants'),
  ('Eigenvalues'), ('Inner Products'), ('Spectral Theory'),
  ('Dual Spaces'), ('Operators'), ('Notebook')
on conflict (name) do nothing;

-- ─── activity ────────────────────────────────────────────────────────────────

create table if not exists public.activity (
  id bigserial primary key,
  action text not null,
  what text not null,
  ts timestamptz not null default now()
);

create index if not exists activity_ts_idx on public.activity (ts desc);

alter table public.activity enable row level security;

drop policy if exists "activity: authenticated read"  on public.activity;
drop policy if exists "activity: authenticated write" on public.activity;

create policy "activity: authenticated read"
  on public.activity for select
  to authenticated
  using (true);

create policy "activity: authenticated write"
  on public.activity for insert
  to authenticated
  with check (true);

-- ─── pages (editable content like About) ─────────────────────────────────────

create table if not exists public.pages (
  slug text primary key,
  title text not null,
  content text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.pages_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at
  before update on public.pages
  for each row execute function public.pages_set_updated_at();

alter table public.pages enable row level security;

drop policy if exists "pages: public read" on public.pages;
drop policy if exists "pages: authenticated write" on public.pages;

create policy "pages: public read"
  on public.pages for select
  to anon, authenticated
  using (true);

create policy "pages: authenticated write"
  on public.pages for all
  to authenticated
  using (true) with check (true);

insert into public.pages (slug, title, content) values
  ('about', 'About this journal',
$$Moonshine Mathematics is a record of one person learning mathematics alone, in the small hours, mostly from books. I write here for the same reason a sailor keeps a log: to remember the route, to notice the weather, and so that — if I am ever lost — I can find my way back to where the trouble began.

> The name is a small private joke. Mathematicians use the word *moonshine* for results so unlikely they look like nonsense — the Monstrous Moonshine conjecture, between the Monster group and the j-function, is the famous example. I work mostly on linear algebra; I have nothing to add to that conjecture. But I like the word. It feels honest about the hour.

The current course of study is linear algebra. My principal text is Axler's *Linear Algebra Done Right*, with Strang as a counterweight when I want intuition more than rigor, and Halmos when I want neither but the cool relief of an older voice. I expect this volume of the journal to close around the spectral theorem and the singular value decomposition. After that — perhaps analysis, perhaps something stranger.

Posts here are not lessons. They are notebooks. They will sometimes be wrong. When they are wrong, I will try to mark it.

::: facts
Name | J. Calder
Begun | on the new moon, November 2025
Currently reading | Axler, *Linear Algebra Done Right*, 4th ed., ch. 7
Pace | roughly one entry per lunar cycle
Hours kept | 22:00 — 03:00, irregular
Correspondence | j.calder@moonshine.math
:::

If something here is wrong, please tell me. Slowly is the only way I know to learn, and being corrected is a part of going slowly.$$)
on conflict (slug) do nothing;

-- ─── storage bucket for media ────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media: public read"     on storage.objects;
drop policy if exists "media: authenticated insert" on storage.objects;
drop policy if exists "media: authenticated update" on storage.objects;
drop policy if exists "media: authenticated delete" on storage.objects;

create policy "media: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media: authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "media: authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

create policy "media: authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
