-- Run after 006_settings.sql.
create table if not exists email_log (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  kind text not null, to_email text not null, subject text, entity text, entity_id uuid,
  status text not null default 'pending' check (status in ('pending','accepted','failed')),
  provider_id text, error text, sent_by text
);
alter table email_log enable row level security;
