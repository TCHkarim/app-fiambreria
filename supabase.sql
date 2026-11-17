-- Ejecutar en Supabase > SQL Editor
create table settings(key text primary key, value text);
create table projects(id uuid default gen_random_uuid() primary key, title text not null, category text, year int, description text, image_url text, video_url text, credits text, created_at timestamptz default now());
create table services(id uuid default gen_random_uuid() primary key, title text not null, description text);
create table team(id uuid default gen_random_uuid() primary key, name text not null, role text, bio text, photo_url text);
create table messages(id uuid default gen_random_uuid() primary key, name text not null, email text not null, company text, project_type text, budget text, message text not null, created_at timestamptz default now());
do $$ declare t text; begin foreach t in array array['settings','projects','services','team','messages'] loop
 execute format('alter table %I enable row level security',t);
 execute format('create policy "admin all" on %I for all to authenticated using(true) with check(true)',t);
end loop;
foreach t in array array['settings','projects','services','team'] loop
 execute format('create policy "public read" on %I for select to anon using(true)',t);
end loop; end $$;
create policy "public send" on messages for insert to anon with check(length(name)<120 and length(email)<160 and length(message) between 5 and 4000);
insert into storage.buckets(id,name,public) values('media','media',true);
create policy "media read" on storage.objects for select using(bucket_id='media');
create policy "media write" on storage.objects for all to authenticated using(bucket_id='media') with check(bucket_id='media');
