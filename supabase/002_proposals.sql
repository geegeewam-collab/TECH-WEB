-- Run after schema.sql: SQL Editor > New query > paste > Run.
create table if not exists clients (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  name text not null, contact_name text, email text, phone text, address text, notes text, lead_id uuid references leads(id)
);
create unique index if not exists clients_email_uq on clients (lower(email)) where email is not null;
create sequence if not exists proposal_seq;
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  number text not null unique default ('PR-' || lpad(nextval('proposal_seq')::text, 4, '0')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  client_id uuid not null references clients(id), lead_id uuid references leads(id),
  title text not null, summary text, scope text, deliverables text, exclusions text, payment_terms text, terms text,
  valid_until date, currency text not null default 'KES',
  status text not null default 'draft' check (status in ('draft','sent','accepted','declined','withdrawn')),
  version int not null default 0, token text unique, sent_at timestamptz, viewed_at timestamptz,
  decided_at timestamptz, decided_method text check (decided_method in ('client_link','manual')), decided_by text, decided_version int
);
create table if not exists proposal_items (
  id uuid primary key default gen_random_uuid(), proposal_id uuid not null references proposals(id) on delete cascade,
  position int not null, description text not null,
  quantity numeric(12,2) not null check (quantity > 0), unit_price numeric(14,2) not null check (unit_price >= 0)
);
-- What the client was sent, frozen. Later edits never change an earlier version.
create table if not exists proposal_versions (
  proposal_id uuid not null references proposals(id), version int not null, snapshot jsonb not null,
  sent_at timestamptz not null default now(), primary key (proposal_id, version)
);
create or replace function replace_items(pid uuid, items jsonb) returns void language plpgsql as $$
begin
  delete from proposal_items where proposal_id = pid;
  insert into proposal_items (proposal_id, position, description, quantity, unit_price)
  select pid, (r.ord - 1)::int, r.v->>'description', (r.v->>'quantity')::numeric, (r.v->>'unit_price')::numeric
  from jsonb_array_elements(items) with ordinality as r(v, ord);
end $$;
revoke execute on function replace_items(uuid, jsonb) from public, anon, authenticated;
alter table clients enable row level security; alter table proposals enable row level security;
alter table proposal_items enable row level security; alter table proposal_versions enable row level security;
