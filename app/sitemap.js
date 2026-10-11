import { SITE, SERVICES, WORK } from "../lib/site";
export default function sitemap() {
  const r = ["", "/services", "/work", "/approach", "/contact", ...SERVICES.map((s) => `/services/${s.slug}`), ...WORK.map((w) => `/work/${w.slug}`)];
  return r.map((p) => ({ url: SITE.url + p }));
}
