-- Run after 003_billing.sql.
create sequence if not exists receipt_seq; create sequence if not exists statement_seq;
alter table payments add column if not exists receipt_no text unique default ('RCT-' || lpad(nextval('receipt_seq')::text, 4, '0'));
create table if not exists statements (
  id uuid primary key default gen_random_uuid(),
  number text not null unique default ('ST-' || lpad(nextval('statement_seq')::text, 4, '0')),
  created_at timestamptz not null default now(), created_by text, client_id uuid not null references clients(id),
  period_from date not null, period_to date not null check (period_to >= period_from),
  snapshot jsonb not null, token text not null unique, viewed_at timestamptz,
  response text check (response in ('confirmed','disputed')), response_note text, responded_at timestamptz, responded_by text
);
alter table statements enable row level security;
