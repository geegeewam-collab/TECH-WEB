import { requireAdmin } from "../../../../../lib/supabase";
import { receiptPdf } from "../../../../../lib/pdf.mjs";
import { toMinor } from "../../../../../lib/money.mjs";
import { brand } from "../../../../../lib/settings";
export const dynamic = "force-dynamic";
export async function GET(_, { params }) {
  const { db } = await requireAdmin(); const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const { data: p } = await db.from("payments").select("*, clients(name), payment_allocations(amount,invoices(number))").eq("id", id).maybeSingle();
  if (!p) return new Response("Not found", { status: 404 });
  if (p.reversed_at) return new Response("This payment was reversed, so no receipt can be issued.", { status: 409 });
  try { return new Response(await receiptPdf({ receipt_no: p.receipt_no, paid_on: p.paid_on, client: p.clients.name, amount: toMinor(String(p.amount)), currency: p.currency, method: p.method, reference: p.reference, applied: p.payment_allocations.map((a) => ({ number: a.invoices.number, amount: toMinor(String(a.amount)) })) }, (await brand()).name), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${p.receipt_no}.pdf"`, "Cache-Control": "private, no-store" } }); }
  catch (e) { console.error("receipt pdf failed", e?.message); return new Response("Could not create the PDF.", { status: 500 }); }
}
