-- =====================================================================
-- Website Music — Normalized Supabase Schema (v2)
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → New query → Run.
-- Aman dijalankan ulang (idempotent).
-- Tabel lama `app_config` TIDAK disentuh (tetap sebagai backup).
-- =====================================================================

-- ---------- Helper: auto updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- 1. couple_profile (1 baris: id = 'main') ----------
create table if not exists public.couple_profile (
  id                 text primary key default 'main',
  pin_code           text not null default '1402',
  your_name          text,
  partner_name       text,
  your_avatar_url    text,
  partner_avatar_url text,
  love_note          text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------- 2. playlists ----------
create table if not exists public.playlists (
  id          text primary key,
  title       text not null,
  description text default '',
  cover_url   text default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- 3. tracks (PK komposit: track yang sama boleh ada di beberapa playlist) ----------
create table if not exists public.tracks (
  playlist_id text not null references public.playlists(id) on delete cascade,
  id          text not null,
  title       text not null,
  artist      text default '',
  album       text default '',
  memory      text default '',
  date_added  text default '',
  duration    text default 'Full',
  liked       boolean not null default false,
  cover_url   text default '',
  youtube_id  text,
  audio_url   text default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (playlist_id, id)
);
create index if not exists tracks_playlist_position_idx on public.tracks (playlist_id, position);

-- ---------- 4. polaroids (soft delete via deleted_at) ----------
create table if not exists public.polaroids (
  id           text primary key,
  image_url    text not null,
  caption      text default '',
  memory_date  text default '',
  location     text default '',
  position     integer not null default 0,
  deleted_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists polaroids_active_idx on public.polaroids (position) where deleted_at is null;

-- ---------- 5. jam_messages ----------
create table if not exists public.jam_messages (
  id          text primary key,
  sender      text not null,
  text        text not null,
  time_label  text default '',
  position    bigint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists jam_messages_position_idx on public.jam_messages (position);

-- ---------- Triggers updated_at ----------
do $$
declare t text;
begin
  foreach t in array array['couple_profile','playlists','tracks','polaroids','jam_messages'] loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s', t);
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$s
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------- RLS (akses anon setara kondisi sebelumnya) ----------
do $$
declare t text;
begin
  foreach t in array array['couple_profile','playlists','tracks','polaroids','jam_messages'] loop
    execute format('alter table public.%1$s enable row level security', t);
    execute format('drop policy if exists "%1$s_anon_all" on public.%1$s', t);
    execute format('create policy "%1$s_anon_all" on public.%1$s for all
                    to anon, authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ---------- Realtime ----------
do $$
declare t text;
begin
  foreach t in array array['couple_profile','playlists','tracks','polaroids','jam_messages'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- REPLICA IDENTITY FULL agar event DELETE membawa kolom PK lengkap
alter table public.tracks       replica identity full;
alter table public.playlists    replica identity full;
alter table public.jam_messages replica identity full;

-- ---------- Storage bucket untuk foto (avatar, polaroid, cover) ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read"  on storage.objects;
drop policy if exists "media_anon_insert"  on storage.objects;
drop policy if exists "media_anon_update"  on storage.objects;
drop policy if exists "media_anon_delete"  on storage.objects;

create policy "media_public_read" on storage.objects for select
  to anon, authenticated using (bucket_id = 'media');
create policy "media_anon_insert" on storage.objects for insert
  to anon, authenticated with check (bucket_id = 'media');
create policy "media_anon_update" on storage.objects for update
  to anon, authenticated using (bucket_id = 'media');
create policy "media_anon_delete" on storage.objects for delete
  to anon, authenticated using (bucket_id = 'media');
