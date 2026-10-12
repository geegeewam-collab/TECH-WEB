"use server";
import { redirect } from "next/navigation";
import { db } from "../../../lib/supabase";
export async function respond(fd) {
  const token = String(fd.get("token") || ""), sb = db(); if (!sb || !/^[\w-]{20,64}$/.test(token)) return;
  const r = String(fd.get("response")), name = String(fd.get("name") || "").trim().slice(0, 120), note = String(fd.get("note") || "").trim().slice(0, 1000);
  if (!["confirmed", "disputed"].includes(r) || name.length < 2 || (r === "disputed" && !note)) redirect(`/s/${token}?e=1`);
  const { data } = await sb.from("statements").update({ response: r, response_note: note || null, responded_at: new Date().toISOString(), responded_by: name }).eq("token", token).is("response", null).select("id");
  if (data?.length) await sb.from("audit_log").insert({ actor: `client: ${name}`, action: `statement.${r}`, entity: "statement", entity_id: data[0].id });
  redirect(`/s/${token}`);
}
