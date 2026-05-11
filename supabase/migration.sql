-- Moonshine Mathematics — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push` if you wire up the CLI).

-- ─── posts ───────────────────────────────────────────────────────────────────

create table if not exists public.posts (
  id            text primary key,
  number        text not null,
  slug          text not null unique,
  title         text not null,
  subtitle      text not null default '',
  excerpt       text not null default '',
  date          date not null,
  reading_time  int  not null default 0,
  tag           text not null,
  status        text not null check (status in ('published','draft')) default 'draft',
  featured      boolean not null default false,
  views         int  not null default 0,
  body          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_date_idx   on public.posts (date desc);

-- auto-update updated_at on row updates
create or replace function public.posts_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.posts_set_updated_at();

-- ─── row level security ──────────────────────────────────────────────────────

alter table public.posts enable row level security;

drop policy if exists "posts: public reads published"   on public.posts;
drop policy if exists "posts: authenticated reads all"  on public.posts;
drop policy if exists "posts: authenticated inserts"    on public.posts;
drop policy if exists "posts: authenticated updates"    on public.posts;
drop policy if exists "posts: authenticated deletes"    on public.posts;

create policy "posts: public reads published"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

create policy "posts: authenticated reads all"
  on public.posts for select
  to authenticated
  using (true);

create policy "posts: authenticated inserts"
  on public.posts for insert
  to authenticated
  with check (true);

create policy "posts: authenticated updates"
  on public.posts for update
  to authenticated
  using (true) with check (true);

create policy "posts: authenticated deletes"
  on public.posts for delete
  to authenticated
  using (true);

-- ─── seed data ───────────────────────────────────────────────────────────────
-- Mirrors lib/data.ts so the site looks identical after the swap.

insert into public.posts (id, number, slug, title, subtitle, excerpt, date, reading_time, tag, status, featured, views) values
  ('p014','XIV','spectral-theorem-self-adjoint',
    'The Spectral Theorem, slowly',
    'On why self-adjoint operators are nothing more than oriented stretches.',
    'I have spent four nights with the spectral theorem, and I think I finally see it. It says something almost embarrassingly simple — and yet the proof, which I write out below, took me three notebook pages to convince myself of.',
    '2026-05-04', 14, 'Spectral Theory', 'published', true, 412),

  ('p013','XIII','determinants-as-volume',
    'Determinants are volume, signed',
    'How I stopped memorizing the cofactor formula.',
    'For a long time, the determinant was, for me, a procedure. You expanded along a row. You followed signs. You arrived at a number. The number was useful, somehow.',
    '2026-04-22', 9, 'Determinants', 'published', false, 318),

  ('p012','XII','dual-spaces-confusion',
    'Dual spaces: a brief crisis',
    'Three days lost, one diagram regained.',
    'Axler introduces V* in a few pages. It took me three nights to feel the weight of those pages. The trouble was not the definition — the definition is one line.',
    '2026-04-09', 11, 'Dual Spaces', 'published', false, 256),

  ('p011','XI','eigenvalues-fixed-points',
    'Eigenvalues as fixed directions',
    'Notes on what survives a transformation.',
    'An eigenvector is the part of a space the transformation cannot rotate. Everything else gets bent; this one direction is merely scaled.',
    '2026-03-27', 8, 'Eigenvalues', 'published', false, 489),

  ('p010','X','change-of-basis-rosetta',
    'Change of basis is a Rosetta stone',
    'The same operator, three alphabets.',
    'If you accept that vectors are not their coordinates, change of basis becomes the most natural operation in the world.',
    '2026-03-14', 7, 'Linear Maps', 'published', false, 201),

  ('p009','IX','rank-nullity-double-entry',
    'Rank–nullity, as bookkeeping',
    'Nothing is lost; dimension is a ledger.',
    'Dimensions are a conserved quantity in the way energy is. The kernel collects what is destroyed; the image collects what survives. The sum is the input.',
    '2026-02-28', 6, 'Linear Maps', 'published', false, 174),

  ('p008','VIII','inner-products-geometry',
    'Inner products gave me geometry back',
    'Why angles only exist after you choose a form.',
    'A vector space, by itself, has no notion of length, no notion of perpendicularity. You have to add structure for those words to mean anything.',
    '2026-02-12', 10, 'Inner Products', 'published', false, 297),

  ('p007','VII','polynomial-of-operator',
    'Polynomials of an operator',
    'On the algebra hiding inside a linear map.',
    'Once you can square a linear operator, you can polynomial it. Once you can polynomial it, half of the rest of the subject opens up.',
    '2026-01-30', 8, 'Operators', 'published', false, 188),

  ('p006','VI','axler-grudge',
    'A small grudge against Axler',
    'And why I forgive him by chapter four.',
    'There is a passage on page 47 where Axler refuses to use the word ''matrix'' until later in the book. The first time I read it I was annoyed.',
    '2026-01-12', 5, 'Notebook', 'published', false, 532),

  ('p005','V','linear-independence-intuition',
    'Linear independence is just non-redundancy',
    'The simplest idea, dressed in formal clothes.',
    'A set of vectors is linearly dependent when one of them can be written using the others. That is the entire content of the definition.',
    '2025-12-28', 7, 'Bases', 'published', false, 245),

  ('p004','IV','vector-spaces-not-arrows',
    'Vector spaces aren''t really about arrows',
    'Functions, polynomials, sequences — they all fit.',
    'The first time I saw the polynomial space P_n called a ''vector space'' I closed the book. By the end of the week I had reopened it.',
    '2025-12-15', 9, 'Vector Spaces', 'published', false, 366),

  ('p003','III','why-self-study',
    'Why I am studying alone',
    'Notes from before any of this began.',
    'I want to learn mathematics for the reason most people read poetry: because it gives shape to things that are otherwise shapeless.',
    '2025-11-30', 6, 'Notebook', 'published', false, 778),

  ('p015','XV','jordan-form-draft',
    'Jordan normal form, a first attempt',
    'Draft — too rough to publish.',
    'I do not yet understand the Jordan form. This post is mostly me trying to write down what I do not understand.',
    '2026-05-09', 12, 'Eigenvalues', 'draft', false, 0)

on conflict (id) do nothing;
