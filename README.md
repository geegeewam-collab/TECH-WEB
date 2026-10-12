# GEEGEE TECH: website + business system (Next.js 15 + Supabase)

Public site, `/admin` (leads, clients, proposals, projects, invoices, payments, receipts, statements, emails, settings) and `/portal` (clients).

## Deploy once
1. **Supabase** (new, dedicated project): SQL Editor > paste all of `supabase/setup.sql` > Run (safe to run again).
   Authentication > Sign In / Providers > turn OFF "Allow new users to sign up".
   Authentication > Users > Add user: your email + strong password, tick "Auto confirm user".
2. **Vercel** > Settings > Environment Variables (then redeploy):
   - Required: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS` (the email from step 1).
   - Optional: `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL` (email alerts and "Email to client"; needs a verified domain to reach clients); `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GADS_ID`, `NEXT_PUBLIC_GADS_LABEL`, `NEXT_PUBLIC_META_PIXEL_ID` (ads; load only after the visitor accepts cookies).
3. Open `/admin/login`, then **Settings**: business name, contact email, WhatsApp (digits, e.g. 2547...), payment instructions, payment days. The launch checklist on that page shows what is still missing.
4. Add project screenshots as `public/work/arverdor.png` and `public/work/el-suites.png`.

## Daily use
Lead > Create client and proposal > Send > share the link (WhatsApp / email) > client accepts > Create project / Create draft invoice > Issue > Record payment > Receipt. Statements: pick a client and dates, preview, publish to the portal or share. Clients: open a client > Create a portal login, and send the credentials on WhatsApp. `/portal/login` for clients.

## Rules built in
Money uses exact integer arithmetic. Issued invoices are frozen by a database trigger. Payments are checked and saved in one database transaction (no over-payment, no duplicate reference, no double-click duplicates); mistakes are reversed with a reason, never deleted. Sent proposals and generated statements are frozen versions. Portal queries are filtered by the signed-in client's id. Important changes are in `audit_log`.

## Local
    npm install
    npm run dev
    npm test

## Limits
No automatic M-Pesa or bank matching; payments are entered by hand. Client acceptance is a recorded agreement, not a legal e-signature. Privacy and terms pages are drafts and need review. Proposal and statement links work for anyone who holds them. The rate limit on the contact form is in memory.
