-- Currents fields for the home-page widget.
-- Idempotent: safe to run multiple times.

alter table public.journal_settings add column if not exists currents_reading  text default '';
alter table public.journal_settings add column if not exists currents_research text default '';
alter table public.journal_settings add column if not exists currents_writing  text default '';
