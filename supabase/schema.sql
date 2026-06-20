-- Supabase Database Schema for Onsite Teams ERP

-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('admin', 'supervisor', 'labor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);

-- 2. Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  budget numeric default 0,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;
create policy "Projects viewable by authenticated users" on public.projects for select to authenticated using (true);
create policy "Projects insertable by admin" on public.projects for insert to authenticated with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. Material Inventory Table
create table public.materials (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  quantity numeric default 0,
  unit text not null, -- e.g. Bags, Tons, Liters
  type text check (type in ('inward', 'outward')),
  logged_by uuid references public.profiles not null,
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.materials enable row level security;
create policy "Materials viewable by authenticated" on public.materials for select to authenticated using (true);
create policy "Materials insertable by authenticated" on public.materials for insert to authenticated with check (true);

-- 4. Expenses (Petty Cash) Table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  amount numeric not null,
  description text not null,
  logged_by uuid references public.profiles not null,
  date date default CURRENT_DATE not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;
create policy "Expenses viewable by authenticated" on public.expenses for select to authenticated using (true);
create policy "Expenses insertable by authenticated" on public.expenses for insert to authenticated with check (true);

-- 5. Daily Progress Reports (DPR)
create table public.dpr (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  summary text not null,
  logged_by uuid references public.profiles not null,
  date date default CURRENT_DATE not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.dpr enable row level security;
create policy "DPR viewable by authenticated" on public.dpr for select to authenticated using (true);
create policy "DPR insertable by authenticated" on public.dpr for insert to authenticated with check (true);
