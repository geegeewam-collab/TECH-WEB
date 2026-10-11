# GEEGEE STUDIOS website (Next.js 15)

Brand name, services, projects and process live in `lib/site.js`. Colours are CSS variables at the top of `app/globals.css`.

## Run locally
    npm install
    npm run dev        # http://localhost:3000

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. Import the repo in Vercel (framework: Next.js, no settings needed).
3. Add the variables from `.env.example` under Project Settings > Environment Variables, then redeploy.

## Enquiry form
`/api/enquiry` validates input server-side, blocks bots (honeypot) and rate-limits, then emails you through Resend.
Without `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` and `ENQUIRY_FROM_EMAIL` it returns an honest "not set up" error and the form shows it. Nothing is stored in a database yet: the email is the only record, so adding a database is the first upgrade.
The rate limit is in memory (best effort on serverless).

## Not included yet
Privacy and terms pages, studio/founder page, FAQ, client portal, admin and invoicing, analytics.
