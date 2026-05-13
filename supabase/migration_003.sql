-- Seed the home page row so the lede on / is editable from /admin.
-- Idempotent: safe to run multiple times.

insert into public.pages (slug, title, content) values
  ('home', 'Journal', 'Notes on linear algebra by J. Calder. Work in progress, read at your own risk.')
on conflict (slug) do nothing;
