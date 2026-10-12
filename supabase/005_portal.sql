-- Run after 004_statements.sql.
create table if not exists client_users (
  user_id uuid primary key, client_id uuid not null references clients(id), email text not null, created_at timestamptz not null default now()
);
create index if not exists client_users_client on client_users (client_id);
alter table client_users enable row level security;
alter table statements add column if not exists portal_visible boolean not null default false;
