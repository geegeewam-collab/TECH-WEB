import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "./supabase";
import { SITE } from "./site";
export const FIELDS = ["brand_name", "description", "contact_email", "whatsapp", "payment_instructions", "payment_terms_days"];
const load = unstable_cache(async () => { const d = db(); if (!d) return {}; const { data } = await d.from("settings").select("key,value"); return Object.fromEntries((data || []).map((r) => [r.key, r.value])); }, ["settings"], { revalidate: 60, tags: ["settings"] });
// Business details come from the Settings page (database), falling back to lib/site.js and environment variables.
export async function brand() {
  let s = {}; try { s = await load(); } catch {}
  return { name: s.brand_name || SITE.name, desc: s.description || SITE.desc, email: s.contact_email || SITE.email, whatsapp: s.whatsapp || SITE.whatsapp,
    paymentInstructions: s.payment_instructions || process.env.PAYMENT_INSTRUCTIONS || "", termsDays: parseInt(s.payment_terms_days || process.env.PAYMENT_TERMS_DAYS || "14", 10) || 14, raw: s };
}
