import { db } from "../../../../lib/supabase";
import { statementPdf } from "../../../../lib/pdf.mjs";
import { brand } from "../../../../lib/settings";
export const dynamic = "force-dynamic";
export async function GET(_, { params }) {
  const { token } = await params, sb = db();
  if (!sb || !/^[\w-]{20,64}$/.test(token)) return new Response("Not found", { status: 404 });
  const { data: s } = await sb.from("statements").select("number,snapshot").eq("token", token).maybeSingle(); if (!s) return new Response("Not found", { status: 404 });
  try { return new Response(await statementPdf(s.snapshot, (await brand()).name, s.snapshot.client.name, s.number), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${s.number}.pdf"`, "Cache-Control": "private, no-store" } }); }
  catch (e) { console.error("statement pdf failed", e?.message); return new Response("Could not create the PDF.", { status: 500 }); }
}
