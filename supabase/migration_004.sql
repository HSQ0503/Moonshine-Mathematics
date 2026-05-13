-- Journal-level settings (singleton row).
-- Run in the Supabase SQL editor.

create table if not exists public.journal_settings (
  id int primary key check (id = 1),
  author_name text not null default 'J. Calder',
  author_initials text not null default 'JC',
  updated_at timestamptz not null default now()
);

create or replace function public.journal_settings_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists journal_settings_updated_at on public.journal_settings;
create trigger journal_settings_updated_at
  before update on public.journal_settings
  for each row execute function public.journal_settings_set_updated_at();

alter table public.journal_settings enable row level security;

drop policy if exists "settings: public read"        on public.journal_settings;
drop policy if exists "settings: authenticated write" on public.journal_settings;

create policy "settings: public read"
  on public.journal_settings for select
  to anon, authenticated
  using (true);

create policy "settings: authenticated write"
  on public.journal_settings for all
  to authenticated
  using (true) with check (true);

insert into public.journal_settings (id) values (1)
on conflict (id) do nothing;
