"use server";
import { redirect } from "next/navigation";
import { db } from "../../../lib/supabase";
export async function decide(fd) {
  const token = String(fd.get("token") || ""), sb = db();
  if (!sb || !/^[\w-]{20,64}$/.test(token)) return;
  const { data: p } = await sb.from("proposals").select("id,status,version,valid_until").eq("token", token).maybeSingle();
  if (!p) return;
  const dec = String(fd.get("decision")), name = String(fd.get("name") || "").trim().slice(0, 120), today = new Date().toISOString().slice(0, 10);
  if (p.status !== "sent" || (p.valid_until && p.valid_until < today) || Number(fd.get("version")) !== p.version) redirect(`/p/${token}`);
  if (!["accepted", "declined"].includes(dec) || name.length < 2 || (dec === "accepted" && !fd.get("ack"))) redirect(`/p/${token}?e=1`);
  const { data: u } = await sb.from("proposals").update({ status: dec, decided_at: new Date().toISOString(), decided_method: "client_link", decided_by: name, decided_version: p.version }).eq("id", p.id).eq("status", "sent").eq("version", p.version).select("id");
  if (u?.length) await sb.from("audit_log").insert({ actor: `client: ${name}`, action: `proposal.${dec}`, entity: "proposal", entity_id: p.id, detail: { version: p.version, method: "client_link" } });
  redirect(`/p/${token}`);
}
