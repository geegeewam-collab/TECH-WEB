-- Run once in Supabase: SQL Editor > New query > paste > Run.
create extension if not exists pgcrypto;
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null, business text, phone text,
  message text not null check (char_length(message) >= 10),
  status text not null default 'new' check (status in ('new','contacted','qualified','proposal_in_preparation','proposal_sent','won','lost','archived')),
  follow_up_on date, last_contacted_at timestamptz, notes text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, landing_page text, referrer text,
  notify_status text not null default 'pending' check (notify_status in ('pending','sent','failed','skipped')), notify_error text
);
create index if not exists leads_status_created on leads (status, created_at desc);
create table if not exists audit_log (
  id bigint generated always as identity primary key, at timestamptz not null default now(),
  actor text, action text not null, entity text, entity_id text, detail jsonb
);
-- No policies on purpose: the browser key can read nothing. Only server code (service key) touches data.
alter table leads enable row level security;
alter table audit_log enable row level security;
