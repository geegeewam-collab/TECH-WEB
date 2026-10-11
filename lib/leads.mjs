export const STATUSES = { new: "New", contacted: "Contacted", qualified: "Qualified", proposal_in_preparation: "Proposal in preparation", proposal_sent: "Proposal sent", won: "Won", lost: "Lost", archived: "Archived" };
const cut = (v, n) => String(v ?? "").trim().slice(0, n);
export function validateEnquiry(b = {}) {
  if (b.website) return { bot: true };
  const d = { name: cut(b.name, 120), email: cut(b.email, 160).toLowerCase(), business: cut(b.business, 160) || null, phone: cut(b.phone, 40) || null, message: cut(b.message, 3000) };
  if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || d.message.length < 10) return { error: "Please check your name, email and message." };
  const a = b.attribution && typeof b.attribution === "object" ? b.attribution : {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) d[k] = cut(a[k], 120) || null;
  d.landing_page = cut(a.landing_page, 300) || null; d.referrer = cut(a.referrer, 300) || null;
  return { data: d };
}
export function sourceLabel(l = {}) {
  if (l.utm_source) return l.utm_source;
  try { const h = new URL(l.referrer).hostname.replace(/^www\./, ""); if (h) return h; } catch {}
  return "Direct";
}
