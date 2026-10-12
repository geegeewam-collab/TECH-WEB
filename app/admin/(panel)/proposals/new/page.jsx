import { requireAdmin } from "../../../../../lib/supabase";
import ProposalForm from "../../../../../components/ProposalForm";
import { saveProposal } from "../../../proposal-actions";
export const dynamic = "force-dynamic";
export default async function NewProposal({ searchParams }) {
  const { db } = await requireAdmin();
  const sp = await searchParams;
  const { data: clients } = await db.from("clients").select("id,name").order("name");
  return (<><h1>New proposal</h1>{sp?.e && <p className="err">Check the client, title and pricing lines, then try again.</p>}
    {clients?.length ? <ProposalForm p={{ client_id: sp?.client }} clients={clients} action={saveProposal} /> : <p className="mut">Create a client first (Clients, then New client).</p>}</>);
}
