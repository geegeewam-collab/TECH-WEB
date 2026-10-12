import { db } from "../../../../lib/supabase";
import { proposalPdf } from "../../../../lib/pdf.mjs";
import { brand } from "../../../../lib/settings";
export const dynamic = "force-dynamic";
export async function GET(_, { params }) {
  const { token } = await params, sb = db();
  if (!sb || !/^[\w-]{20,64}$/.test(token)) return new Response("Not found", { status: 404 });
  const { data: p } = await sb.from("proposals").select("id,status,version").eq("token", token).maybeSingle();
  if (!p || p.status === "draft") return new Response("Not found", { status: 404 });
  const { data: v } = await sb.from("proposal_versions").select("snapshot").eq("proposal_id", p.id).eq("version", p.version).maybeSingle();
  if (!v) return new Response("Not found", { status: 404 });
  try {
    const pdf = await proposalPdf(v.snapshot, (await brand()).name);
    return new Response(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${v.snapshot.number}.pdf"`, "Cache-Control": "private, no-store" } });
  } catch (e) { console.error("pdf failed", e?.message); return new Response("Could not create the PDF.", { status: 500 }); }
}
