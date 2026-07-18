-- ==========================================================
-- SUPABASE BACKEND DATABASE SCHEMA
-- NetVentures Magazine — Production-Ready
-- ==========================================================

-- Enable extensions if needed (e.g. UUID generation)
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ----------------------------------------------------------
create table public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;

-- RLS Policies
create policy "Allow public read access to categories" 
    on public.categories for select 
    using (true);

create policy "Allow authenticated users to insert categories" 
    on public.categories for insert 
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update categories" 
    on public.categories for update 
    using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete categories" 
    on public.categories for delete 
    using (auth.role() = 'authenticated');


-- ----------------------------------------------------------
-- 2. TAGS TABLE
-- ----------------------------------------------------------
create table public.tags (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.tags enable row level security;

-- RLS Policies
create policy "Allow public read access to tags" 
    on public.tags for select 
    using (true);

create policy "Allow authenticated users to insert tags" 
    on public.tags for insert 
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete tags" 
    on public.tags for delete 
    using (auth.role() = 'authenticated');


-- ----------------------------------------------------------
-- 3. ARTICLES TABLE
-- ----------------------------------------------------------
create table public.articles (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    content text not null,
    excerpt text,
    category text,
    tags text[] default '{}'::text[],
    status text default 'draft'::text check (status in ('draft', 'published')),
    featured_image text,
    seo_title text,
    meta_description text,
    canonical_url text,
    reading_time integer default 5,
    views integer default 0,
    author text default 'Elena Rostova'::text,
    faq jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.articles enable row level security;

-- RLS Policies
create policy "Allow public read access to published articles" 
    on public.articles for select 
    using (status = 'published');

create policy "Allow authenticated users read access to all articles" 
    on public.articles for select 
    using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert articles" 
    on public.articles for insert 
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update articles" 
    on public.articles for update 
    using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete articles" 
    on public.articles for delete 
    using (auth.role() = 'authenticated');


-- ----------------------------------------------------------
-- 4. SITE SETTINGS TABLE
-- ----------------------------------------------------------
create table public.site_settings (
    id text primary key check (id = 'global'),
    site_name text not null default 'NetVentures',
    site_description text,
    contact_email text,
    logo_url text,
    footer_text text,
    affiliate_disclosure text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.site_settings enable row level security;

-- RLS Policies
create policy "Allow public read access to site_settings" 
    on public.site_settings for select 
    using (true);

create policy "Allow authenticated users to upsert site_settings" 
    on public.site_settings for insert 
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update site_settings" 
    on public.site_settings for update 
    using (auth.role() = 'authenticated');


-- ----------------------------------------------------------
-- 5. NEWSLETTER SUBSCRIBERS TABLE
-- ----------------------------------------------------------
create table public.newsletter_subscribers (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.newsletter_subscribers enable row level security;

-- RLS Policies
create policy "Allow anyone to subscribe to newsletter" 
    on public.newsletter_subscribers for insert 
    with check (true);

create policy "Allow authenticated users to view subscribers list" 
    on public.newsletter_subscribers for select 
    using (auth.role() = 'authenticated');


-- ----------------------------------------------------------
-- 6. STORAGE BUCKETS CONFIGURATION (MEDIA)
-- ----------------------------------------------------------
-- Note: Create the public storage bucket named 'media' if it doesn't exist.
-- Create bucket automatically:
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Drop policies if they exist to prevent duplication errors
drop policy if exists "Public read access to media" on storage.objects;
drop policy if exists "Authenticated upload to media" on storage.objects;
drop policy if exists "Authenticated delete from media" on storage.objects;

-- 1. Allow public read access to media files
create policy "Public read access to media"
  on storage.objects for select
  using ( bucket_id = 'media' );

-- 2. Allow authenticated uploads to media bucket
create policy "Authenticated upload to media"
  on storage.objects for insert
  with check ( bucket_id = 'media' and auth.role() = 'authenticated' );

-- 3. Allow authenticated deletions from media bucket
create policy "Authenticated delete from media"
  on storage.objects for delete
  using ( bucket_id = 'media' and auth.role() = 'authenticated' );


-- ----------------------------------------------------------
-- 7. SEED DATA FOR FIRST INITIALIZATION
-- ----------------------------------------------------------
insert into public.categories (id, name, slug, description) values
('f9b8a7c6-e5d4-4c3b-2a1b-000000000001', 'AI Tools', 'ai-tools', 'Deep dives and reviews of cutting-edge AI utilities transforming business.'),
('f9b8a7c6-e5d4-4c3b-2a1b-000000000002', 'Automation', 'automation', 'Tutorials on connecting APIs and building seamless workflow pipelines.'),
('f9b8a7c6-e5d4-4c3b-2a1b-000000000003', 'Digital Marketing', 'digital-marketing', 'Advanced strategies for SEO, traffic generation, and Generative Engine Optimization.'),
('f9b8a7c6-e5d4-4c3b-2a1b-000000000004', 'SaaS Reviews', 'saas-reviews', 'Unbiased reviews of the software tools shaping the digital economy.'),
('f9b8a7c6-e5d4-4c3b-2a1b-000000000005', 'Case Studies', 'case-studies', 'Real-world reports, earnings, and strategies from successful online founders.')
on conflict (slug) do nothing;

insert into public.tags (name, slug) values
('Make Money Online', 'make-money-online'),
('Passive Income', 'passive-income'),
('Affiliate Marketing', 'affiliate-marketing'),
('Productivity', 'productivity'),
('Blogging', 'blogging'),
('Freelancing', 'freelancing')
on conflict (slug) do nothing;

insert into public.site_settings (id, site_name, site_description, contact_email, logo_url, footer_text, affiliate_disclosure) values
('global', 'NetVentures', 'The premium online business magazine and resource center for making money online, AI tools, SaaS reviews, and digital automation.', 'editor@netventures.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=40&q=80', '© 2026 NetVentures. Premium digital business strategies and insights.', 'Affiliate Disclosure: Some of the links on this website are affiliate links, meaning we may earn a small commission if you make a purchase through them, at no extra cost to you. We only recommend products we have personally tested and trust.')
on conflict (id) do nothing;
