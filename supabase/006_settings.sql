-- Run after 005_portal.sql.
create table if not exists settings (key text primary key, value text, updated_at timestamptz not null default now());
alter table settings enable row level security;
