# GEEGEE TECH — Local run, Git and Vercel launch

## A. Extract the project

1. Download `GEEGEE-TECH-Website.zip`.
2. Right-click the ZIP and choose **Extract All**.
3. Open the extracted `GEEGEE-TECH-Website` folder.

## B. Run it on your computer

1. Make sure Node.js 18 or newer is installed.
2. In File Explorer, open the extracted project folder.
3. Click the address bar, type `cmd`, and press Enter. This opens Command Prompt in the correct folder.
4. Type:

   ```bash
   npm run dev
   ```

5. Open this address in Chrome: `http://localhost:4173`.
6. Leave Command Prompt running while you view the website. To stop it, return to Command Prompt and press `Ctrl + C`.

No `npm install` is needed because the project has no third-party package dependencies.

## C. Configure the enquiry form

Before sharing the live site, open:

`site/assets/js/config.js`

Replace the empty `contactEmail` value with the real company email. Do not put a made-up address here. Save and test the contact form in the browser.

The form opens the visitor's email application with the completed message. The visitor still needs to send it. To receive submissions directly on a web form, configure a trusted HTTPS form endpoint in `formEndpoint` and test it.

## D. Update the production domain

After choosing the final domain, replace `YOUR-DOMAIN.example` in:

- `site/robots.txt`
- `site/sitemap.xml`

Do not leave the example domain in the live website.

## E. Build the production version

Run:

```bash
npm run build
```

This creates the static production site inside `dist/`.

To test that exact build locally:

```bash
npm run preview
```

Open `http://localhost:4174`.

## F. Push to GitHub

In Command Prompt, from the project folder:

```bash
git init
git add .
git commit -m "Initial GEEGEE TECH website"
```

Create an empty repository on GitHub, then follow the repository's instructions to connect and push. They typically look like:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example GitHub URL with your own repository URL.

## G. Deploy with Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository you just pushed.
3. Keep the build command as `npm run build`.
4. Keep the output directory as `dist`.
5. Deploy.
6. Add your actual domain in Vercel when ready.

The included `vercel.json` supplies the build and output settings.

## Final launch checklist

- [ ] Add the real company email or a tested form endpoint.
- [ ] Replace the example domain in `robots.txt` and `sitemap.xml`.
- [ ] Confirm all project names, descriptions and statuses are approved for public display.
- [ ] Test all navigation links on desktop and mobile.
- [ ] Test the contact form on a device with an email application configured, or use a form endpoint.
- [ ] Run `npm run build` and `npm run preview` before pushing the final changes.
- [ ] Add the domain and verify the deployed pages after the first Vercel deployment.
