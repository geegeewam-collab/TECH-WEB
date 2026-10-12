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
