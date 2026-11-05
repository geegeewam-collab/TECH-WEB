# GEEGEE TECH — Website

A dark, premium, multi-page website for GEEGEE TECH. The project is intentionally dependency-free: it uses plain HTML, CSS and JavaScript, plus a small Node.js development server and build script. No framework install or external image service is required.

## Included pages

- `/` — Home
- `/capabilities/` — Services and capabilities
- `/work/` — Selected work with category filters
- `/work/mpingo-os/` — Mpingo OS project page
- `/work/skoola/` — Skoola project page
- `/work/safari-companion/` — Safari Companion project page
- `/work/commerce-booking/` — Commerce and bookings project page
- `/studio/` — Company story and principles
- `/approach/` — Project process
- `/contact/` — Project enquiry form

## Visual asset policy

The website uses only the supplied presentation artwork for its background imagery. The selected file is the original `1.png` from the ZIP, copied without editing into `site/assets/backgrounds/`. It is the cleanest composition in the supplied archive without baked-in presentation text or portrait photography. The remaining slides contain baked-in presentation headlines, body copy, placeholder details or portrait photography, so they were not used as website backgrounds. The same exact composition is reused across pages with different CSS positioning and cropping.

The supplied PNGs are flattened images. The complete compositions can be repositioned, scaled and cropped with CSS. Individual chrome rings cannot be moved independently without the original layered/editable artwork.

There are no stock photos, generated images, external image URLs, or remote font dependencies in this project. The logo is drawn as inline vector markup, with standalone SVG mark and wordmark-lockup files included in `site/assets/brand/`; the favicon is also an SVG.

## Requirements

- Node.js 18 or newer
- npm (included with Node.js)
- A modern browser

There are no third-party npm packages to install.

## Run locally

Open a terminal in this project folder and run:

```bash
npm run dev
```

Then open `http://localhost:4173` in your browser. Keep the terminal open while using the local site. Press `Ctrl + C` to stop the server.

## Build and preview

```bash
npm run build
npm run preview
```

The production-ready static site is generated in `dist/`. The preview server runs at `http://localhost:4174`.

## Before publishing

1. Open `site/assets/js/config.js`.
2. Set `contactEmail` to the real business email address that should receive project enquiries. Example:

   ```js
   window.GG_SITE_CONFIG = {
     contactEmail: "hello@your-real-domain.com",
     formEndpoint: ""
   };
   ```

3. Save the file and test the contact form. With `contactEmail` configured, submitting the form validates the fields and opens the visitor's email application with the enquiry prepared. The visitor must press Send in that email application.
4. Alternatively, configure a secure HTTPS form endpoint from a form provider in `formEndpoint`. The form sends JSON to that endpoint. Use an endpoint you control and test its response before launch.
5. Replace `YOUR-DOMAIN.example` in `site/robots.txt` and `site/sitemap.xml` with the real production domain.
6. Review every portfolio project description and status before publishing. The project pages deliberately avoid invented client testimonials, statistics and claims of completed commercial outcomes.

**Contact form note:** a static website cannot deliver email by itself. A real recipient email or configured form endpoint is required for direct submission. The current form remains usable as an enquiry-drafting tool until that configuration is added.

## Deploy to Vercel

This project is configured for Vercel as a static site.

1. Create a Git repository and push this project folder.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel reads the included `vercel.json`. Confirm the build command is `npm run build` and the output directory is `dist`.
4. Deploy. No environment variables or third-party package installation are required for the base site.
5. Add the real domain in Vercel and then update the sitemap and robots file with that domain.

You can also test the production build locally with `npm run build` followed by `npm run preview`.

## Editing common content

- Company email and form endpoint: `site/assets/js/config.js`
- Page copy and structure: the relevant `site/**/index.html` file
- Design tokens, typography, layout and responsive behaviour: `site/assets/css/styles.css`
- Navigation, filters, mobile menu and reveal effects: `site/assets/js/main.js`
- Contact form behaviour: `site/assets/js/contact.js`
- Original background artwork: `site/assets/backgrounds/1.png`
- Standalone logo files: `site/assets/brand/geegee-tech-symbol.svg` and `geegee-tech-lockup.svg`

## Project structure

```text
GEEGEE-TECH-Website/
├── site/
│   ├── index.html
│   ├── capabilities/index.html
│   ├── work/index.html
│   ├── work/*/index.html
│   ├── studio/index.html
│   ├── approach/index.html
│   ├── contact/index.html
│   └── assets/
│       ├── backgrounds/
│       ├── css/
│       └── js/
├── scripts/
│   ├── build.mjs
│   └── serve.mjs
├── package.json
├── vercel.json
└── LAUNCH-GUIDE.md
```
