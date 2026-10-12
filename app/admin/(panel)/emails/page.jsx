import { requireAdmin } from "../../../../lib/supabase";
import { sendDocEmail } from "../../email-actions";
export const dynamic = "force-dynamic";
const LABEL = { pending: "Not completed", accepted: "Accepted by email provider", failed: "Failed" };
export default async function Emails() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("email_log").select("*").order("created_at", { ascending: false }).limit(100);
  return (<><h1>Email activity</h1><p className="mut">"Accepted" means the email provider took the message. It does not prove the client received or read it.</p>
    {error ? <p className="err">Could not load. Have you run the setup SQL?</p> : data.length === 0 ? <p className="mut">No emails sent yet.</p> :
      <div className="scroll"><table className="at"><tbody>{data.map((e) => <tr key={e.id}><td>{e.subject}<small>{e.to_email} · {new Date(e.created_at).toLocaleString("en-KE")}</small></td><td><span className={`bd${e.status === "failed" ? " bad" : ""}`}>{LABEL[e.status]}</span>{e.error && <small>{e.error}</small>}</td>
        <td>{e.status !== "accepted" && <form action={sendDocEmail}><input type="hidden" name="kind" value={e.kind} /><input type="hidden" name="id" value={e.entity_id} /><button className="btn sm q">Retry</button></form>}</td></tr>)}</tbody></table></div>}</>);
}
