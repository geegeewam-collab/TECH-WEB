import { requireClient } from "../../../../../../lib/supabase";
import { invoicePdf } from "../../../../../../lib/pdf.mjs";
import { invoiceBook } from "../../../../../../lib/ledger";
import { toMinor, lineTotal, dec } from "../../../../../../lib/money.mjs";
import { brand } from "../../../../../../lib/settings";
export const dynamic = "force-dynamic";
export async function GET(_, { params }) {
  const { db, cid } = await requireClient(); const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const { rows } = await invoiceBook(db, (q) => q.eq("id", id).eq("client_id", cid).eq("status", "issued")); const r = rows?.[0]; if (!r) return new Response("Not found", { status: 404 });
  const { data: full } = await db.from("invoices").select("payment_instructions,invoice_items(description,quantity,unit_price,position)").eq("id", id).eq("client_id", cid).maybeSingle();
  const items = [...full.invoice_items].sort((a, b) => a.position - b.position).map((i) => ({ description: i.description, quantity: dec(toMinor(String(i.quantity))), unit_price: i.unit_price, total: lineTotal(toMinor(String(i.quantity)), toMinor(String(i.unit_price))) }));
  try { return new Response(await invoicePdf({ ...r, client: r.clients?.name, payment_instructions: full.payment_instructions, items }, (await brand()).name), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${r.number}.pdf"`, "Cache-Control": "private, no-store" } }); }
  catch (e) { console.error("portal invoice pdf failed", e?.message); return new Response("Could not create the PDF.", { status: 500 }); }
}
