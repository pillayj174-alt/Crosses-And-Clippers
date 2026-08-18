-- Crosses & Clippers V5 — Supabase schema
-- Run this in Supabase SQL Editor before using owner login/reviews/client database.

create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.reviews enable row level security;

-- Public visitors may submit reviews, but may only read approved reviews.
drop policy if exists "public can read approved reviews" on public.reviews;
create policy "public can read approved reviews"
on public.reviews for select
using (status = 'approved');

drop policy if exists "public can submit reviews" on public.reviews;
create policy "public can submit reviews"
on public.reviews for insert
with check (status = 'pending');

-- Authenticated owner/admin access.
-- For a single-owner site, the authenticated Supabase account is treated as the owner.
drop policy if exists "authenticated can read all reviews" on public.reviews;
create policy "authenticated can read all reviews"
on public.reviews for select
to authenticated
using (true);

drop policy if exists "authenticated can update reviews" on public.reviews;
create policy "authenticated can update reviews"
on public.reviews for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can delete reviews" on public.reviews;
create policy "authenticated can delete reviews"
on public.reviews for delete
to authenticated
using (true);

drop policy if exists "authenticated can read clients" on public.clients;
create policy "authenticated can read clients"
on public.clients for select
to authenticated
using (true);

drop policy if exists "authenticated can insert clients" on public.clients;
create policy "authenticated can insert clients"
on public.clients for insert
to authenticated
with check (true);

drop policy if exists "authenticated can update clients" on public.clients;
create policy "authenticated can update clients"
on public.clients for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can delete clients" on public.clients;
create policy "authenticated can delete clients"
on public.clients for delete
to authenticated
using (true);
