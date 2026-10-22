-- DANGER: deletes ALL business data (leads, clients, proposals, projects, invoices, payments, statements, emails, audit log)
-- and restarts the numbering at 0001. Run it ONLY once, before real launch, to clear your test records.
-- It does not delete login accounts: remove test client logins from Supabase > Authentication > Users.
truncate table payment_allocations, payments, invoice_items, invoices, project_updates, projects, statements, proposal_versions, proposal_items, proposals, client_users, clients, leads, audit_log, email_log restart identity cascade;
alter sequence proposal_seq restart; alter sequence invoice_seq restart; alter sequence project_seq restart; alter sequence receipt_seq restart; alter sequence statement_seq restart;
