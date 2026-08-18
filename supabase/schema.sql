create extension if not exists pgcrypto;

create table if not exists public.clients(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  rating int not null check(rating between 1 and 5),
  comment text not null,
  status text not null default 'pending' check(status in('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.appointments(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service text not null,
  date date not null,
  time time not null,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.reviews enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "public approved reviews" on public.reviews;
drop policy if exists "public submit reviews" on public.reviews;
drop policy if exists "authenticated reviews" on public.reviews;
drop policy if exists "authenticated clients" on public.clients;
drop policy if exists "public appointments insert" on public.appointments;
drop policy if exists "authenticated appointments" on public.appointments;

create policy "public approved reviews" on public.reviews for select using(status='approved');
create policy "public submit reviews" on public.reviews for insert with check(status='pending');
create policy "authenticated reviews" on public.reviews for all to authenticated using(true) with check(true);
create policy "public client insert" on public.clients for insert with check(true);
create policy "authenticated clients" on public.clients for all to authenticated using(true) with check(true);
create policy "public appointments insert" on public.appointments for insert with check(true);
create policy "authenticated appointments" on public.appointments for all to authenticated using(true) with check(true);

-- Create the owner in Supabase Authentication > Users.
-- Then use that email/password in the site's OWNER LOGIN.
