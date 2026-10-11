import Attribution from "../components/Attribution";
import { SITE } from "../lib/site";
import "./globals.css";
export const metadata = { metadataBase: new URL(SITE.url), title: { default: `${SITE.name} | Websites, systems and automation`, template: `%s | ${SITE.name}` }, description: SITE.desc, openGraph: { title: SITE.name, description: SITE.desc, type: "website" } };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }) {
  return (<html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
  </head><body><a className="skip" href="#main">Skip to content</a>{children}<Attribution /></body></html>);
}
