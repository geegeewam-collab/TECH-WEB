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
-- Run after 002_proposals.sql.
create sequence if not exists project_seq; create sequence if not exists invoice_seq;
create table if not exists projects (
  id uuid primary key default gen_random_uuid(), ref text not null unique default ('PRJ-' || lpad(nextval('project_seq')::text, 4, '0')),
  created_at timestamptz not null default now(), client_id uuid not null references clients(id),
  proposal_id uuid unique references proposals(id), title text not null, notes text,
  status text not null default 'planned' check (status in ('planned','in_progress','awaiting_client','on_hold','completed','cancelled'))
);
create table if not exists project_updates (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id),
  body text not null, visible_to_client boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(), number text unique, created_at timestamptz not null default now(), issued_at timestamptz,
  client_id uuid not null references clients(id), project_id uuid references projects(id), proposal_id uuid references proposals(id),
  status text not null default 'draft' check (status in ('draft','issued','void')),
  issue_date date, due_date date, currency text not null default 'KES', notes text, payment_instructions text
);
create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(), invoice_id uuid not null references invoices(id),
  position int not null, description text not null,
  quantity numeric(12,2) not null check (quantity > 0), unit_price numeric(14,2) not null check (unit_price >= 0)
);
create table if not exists payments (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  client_id uuid not null references clients(id), amount numeric(14,2) not null check (amount > 0), currency text not null default 'KES',
  paid_on date not null, method text not null check (method in ('bank','mpesa','cash','card','other')),
  reference text, note text, recorded_by text, idem text unique, reversed_at timestamptz, reversed_by text, reverse_reason text
);
create unique index if not exists payments_ref_uq on payments (method, lower(reference)) where reference is not null;
create table if not exists payment_allocations (
  id uuid primary key default gen_random_uuid(), payment_id uuid not null references payments(id),
  invoice_id uuid not null references invoices(id), amount numeric(14,2) not null check (amount > 0)
);
-- Issued invoices are frozen: their lines cannot change.
create or replace function guard_invoice_items() returns trigger language plpgsql as $$
declare s text;
begin
  select status into s from invoices where id = coalesce(new.invoice_id, old.invoice_id);
  if s <> 'draft' then raise exception 'invoice is not a draft'; end if;
  return coalesce(new, old);
end $$;
drop trigger if exists invoice_items_guard on invoice_items;
create trigger invoice_items_guard before insert or update or delete on invoice_items for each row execute function guard_invoice_items();
create or replace function issue_invoice(iid uuid) returns text language plpgsql as $$
declare n text;
begin
  if not exists (select 1 from invoice_items where invoice_id = iid) then raise exception 'no items'; end if;
  update invoices set status = 'issued', number = 'INV-' || lpad(nextval('invoice_seq')::text, 4, '0'), issue_date = coalesce(issue_date, current_date), issued_at = now()
    where id = iid and status = 'draft' returning number into n;
  if n is null then raise exception 'not a draft'; end if;
  return n;
end $$;
-- One transaction: locks the invoice, checks it is payable and not over-allocated, then records the payment and its allocation.
create or replace function record_payment(p_client uuid, p_amount numeric, p_currency text, p_paid_on date, p_method text, p_ref text, p_note text, p_by text, p_idem text, p_alloc jsonb)
returns uuid language plpgsql as $$
declare pid uuid; a record; inv_total numeric; inv_paid numeric; tot numeric := 0;
begin
  for a in select (v->>'invoice_id')::uuid as iid, (v->>'amount')::numeric as amt from jsonb_array_elements(p_alloc) v loop
    if a.amt <= 0 then raise exception 'bad allocation'; end if;
    perform 1 from invoices where id = a.iid and client_id = p_client and status = 'issued' and currency = p_currency for update;
    if not found then raise exception 'invoice not payable'; end if;
    select coalesce(sum(round(quantity * unit_price, 2)), 0) into inv_total from invoice_items where invoice_id = a.iid;
    select coalesce(sum(pa.amount), 0) into inv_paid from payment_allocations pa join payments pm on pm.id = pa.payment_id where pa.invoice_id = a.iid and pm.reversed_at is null;
    if inv_paid + a.amt > inv_total then raise exception 'over-allocation'; end if;
    tot := tot + a.amt;
  end loop;
  if tot > p_amount then raise exception 'allocations exceed payment'; end if;
  insert into payments (client_id, amount, currency, paid_on, method, reference, note, recorded_by, idem) values (p_client, p_amount, p_currency, p_paid_on, p_method, p_ref, p_note, p_by, p_idem) returning id into pid;
  insert into payment_allocations (payment_id, invoice_id, amount) select pid, (v->>'invoice_id')::uuid, (v->>'amount')::numeric from jsonb_array_elements(p_alloc) v;
  return pid;
end $$;
revoke execute on function issue_invoice(uuid), record_payment(uuid,numeric,text,date,text,text,text,text,text,jsonb) from public, anon, authenticated;
alter table projects enable row level security; alter table project_updates enable row level security; alter table invoices enable row level security;
alter table invoice_items enable row level security; alter table payments enable row level security; alter table payment_allocations enable row level security;
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
-- Run after 004_statements.sql.
create table if not exists client_users (
  user_id uuid primary key, client_id uuid not null references clients(id), email text not null, created_at timestamptz not null default now()
);
create index if not exists client_users_client on client_users (client_id);
alter table client_users enable row level security;
alter table statements add column if not exists portal_visible boolean not null default false;
-- Run after 005_portal.sql.
create table if not exists settings (key text primary key, value text, updated_at timestamptz not null default now());
alter table settings enable row level security;
-- Run after 006_settings.sql.
create table if not exists email_log (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  kind text not null, to_email text not null, subject text, entity text, entity_id uuid,
  status text not null default 'pending' check (status in ('pending','accepted','failed')),
  provider_id text, error text, sent_by text
);
alter table email_log enable row level security;
