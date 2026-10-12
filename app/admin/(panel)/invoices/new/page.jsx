import { requireAdmin } from "../../../../../lib/supabase";
import { createManualInvoice } from "../../../billing-actions";
export const dynamic = "force-dynamic";
export default async function NewInvoice({ searchParams }) {
  const { db } = await requireAdmin(); const sp = await searchParams;
  const { data: clients } = await db.from("clients").select("id,name").order("name");
  return (<><h1>New invoice</h1><p className="mut">For work that is not from a proposal. It starts as a draft you can review before issuing.</p>{sp?.e && <p className="err">Choose a client and fill in at least one valid line.</p>}
    <form action={createManualInvoice} className="form wide"><label>Client<select name="client_id" required defaultValue=""><option value="" disabled>Choose a client</option>{clients?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <fieldset className="items"><legend>Lines (KES)</legend>{[...Array(8)].map((_, i) => <div className="it" key={i}><input name={`d${i}`} placeholder="Description" aria-label={`Line ${i + 1} description`} /><input name={`q${i}`} placeholder="Qty" inputMode="decimal" aria-label="Quantity" /><input name={`p${i}`} placeholder="Unit price" inputMode="decimal" aria-label="Unit price" /></div>)}</fieldset>
      <label>Due date (blank = your standard payment terms)<input type="date" name="due_date" /></label><label>Note for the client<textarea name="notes" rows={2} maxLength={1000} /></label><button className="btn">Create draft invoice</button></form></>);
}
