# GEEGEE TECH website + admin (Next.js 15, Supabase)

Brand, services, projects: `lib/site.js`. Colours: top of `app/globals.css`. Screenshots: `public/work/<slug>.png` (arverdor, el-suites).

## Run locally
    npm install
    cp .env.example .env.local   # fill in (Windows: copy)
    npm run dev
    npm test

## Set up the database and admin (once)
1. Create a free project at supabase.com. Copy the URL, anon key and service_role key (Project Settings > API).
2. SQL Editor > New query > paste `supabase/schema.sql` > Run.
3. Authentication > Sign In / Providers: turn OFF "Allow new users to sign up". Then Authentication > Users > Add user: your email + a strong password.
4. In Vercel > Settings > Environment Variables add everything from `.env.example` (ADMIN_EMAILS = the email from step 3). Redeploy.
5. Open `/admin/login`.

## How it works
- Contact form -> `/api/enquiry` validates, stores the lead (with UTM source, landing page, referrer), and only then reports success. The email alert is best effort; its result is stored on the lead and failures are flagged in the admin.
- Only server code reads the database (the browser key can read nothing). Every admin page and action re-checks the signed-in email against `ADMIN_EMAILS`.
- Changes to a lead are written to `audit_log`.

## Not built yet
Clients, proposals, projects, invoices, payments, statements, client portal, settings UI, analytics tags. The in-memory rate limit is best effort on serverless.
