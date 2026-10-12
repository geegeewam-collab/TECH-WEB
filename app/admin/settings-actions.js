"use server";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "../../lib/supabase";
import { FIELDS } from "../../lib/settings";
export async function saveSettings(fd) {
  const { user, db } = await requireAdmin();
  const v = Object.fromEntries(FIELDS.map((k) => [k, String(fd.get(k) || "").trim().slice(0, k === "payment_instructions" || k === "description" ? 1000 : 160)]));
  const days = parseInt(v.payment_terms_days || "14", 10);
  if ((v.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.contact_email)) || (v.whatsapp && !/^\d{8,15}$/.test(v.whatsapp)) || (v.payment_terms_days && !(days >= 1 && days <= 180))) redirect("/admin/settings?e=1");
  const { error } = await db.from("settings").upsert(FIELDS.map((k) => ({ key: k, value: v[k] || null, updated_at: new Date().toISOString() })));
  if (error) redirect("/admin/settings?e=2");
  await db.from("audit_log").insert({ actor: user.email, action: "settings.update", entity: "settings" });
  revalidateTag("settings"); revalidatePath("/", "layout"); redirect("/admin/settings?saved=1");
}
