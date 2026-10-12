import Link from "next/link";
import { PST } from "../../../../lib/billing.mjs";
import { requireAdmin } from "../../../../lib/supabase";
export const dynamic = "force-dynamic";
export default async function Projects() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("projects").select("id,ref,title,status,clients(name)").order("created_at", { ascending: false }).limit(100);
  return (<><h1>Projects</h1><p className="mut">Create a project from an accepted proposal.</p>
    {error ? <p className="err">Could not load projects. Have you run supabase/003_billing.sql?</p> : data.length === 0 ? <p className="mut">No projects yet.</p> :
      <div className="scroll"><table className="at"><tbody>{data.map((p) => <tr key={p.id}><td><Link href={`/admin/projects/${p.id}`}>{p.title}</Link><small>{p.ref}</small></td><td>{p.clients?.name}</td><td><span className="bd">{PST[p.status]}</span></td></tr>)}</tbody></table></div>}</>);
}
