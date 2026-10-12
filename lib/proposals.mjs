import { toMinor, lineTotal, sum, dec } from "./money.mjs";
export const PSTATUS = { draft: "Draft", sent: "Sent", accepted: "Accepted", declined: "Declined", withdrawn: "Withdrawn", expired: "Expired" };
export function parseItems(fd) {
  const items = [], errors = [];
  for (let i = 0; i < 8; i++) {
    const d = String(fd.get(`d${i}`) || "").trim(); if (!d) continue;
    const q = toMinor(String(fd.get(`q${i}`) || "1")), p = toMinor(fd.get(`p${i}`));
    if (q === null || q <= 0n || p === null) { errors.push(`Line ${i + 1}: check quantity and price`); continue; }
    items.push({ description: d.slice(0, 300), quantity: dec(q), unit_price: dec(p), total: dec(lineTotal(q, p)) });
  }
  return { items, errors };
}
export const itemsTotalMinor = (rows) => sum(rows.map((r) => lineTotal(toMinor(String(r.quantity)), toMinor(String(r.unit_price)))));
export const totalOf = (items) => dec(sum(items.map((i) => toMinor(i.total))));
export const effectiveStatus = (p, today = new Date().toISOString().slice(0, 10)) => (p.status === "sent" && p.valid_until && p.valid_until < today ? "expired" : p.status);
export function buildSnapshot(p, client, items) {
  const { number, version, title, summary, scope, deliverables, exclusions, payment_terms, terms, valid_until, currency } = p;
  return { number, version, title, summary, scope, deliverables, exclusions, payment_terms, terms, valid_until, currency, client: { name: client.name, contact_name: client.contact_name, email: client.email }, items, total: totalOf(items) };
}
export function waNumber(phone) { const d = String(phone || "").replace(/\D/g, ""); return !d ? "" : d.startsWith("0") ? "254" + d.slice(1) : d; }
