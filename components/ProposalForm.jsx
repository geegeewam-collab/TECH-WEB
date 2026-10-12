export default function ProposalForm({ p = {}, rows = [], clients, action, leadId }) {
  const T = (n, t, r = 3) => <label>{t}<textarea name={n} rows={r} defaultValue={p[n] || ""} /></label>;
  return (
    <form action={action} className="form wide">
      {p.id && <input type="hidden" name="id" value={p.id} />}{leadId && <input type="hidden" name="lead_id" value={leadId} />}
      <label>Client<select name="client_id" required defaultValue={p.client_id || ""}><option value="" disabled>Choose a client</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Title<input name="title" required maxLength={200} defaultValue={p.title || ""} /></label>
      {T("summary", "Summary: the problem and our understanding")}{T("scope", "Scope of work", 5)}{T("deliverables", "Deliverables")}{T("exclusions", "Exclusions (not included)")}
      <fieldset className="items"><legend>Pricing (KES)</legend>
        {[...Array(8)].map((_, i) => { const r = rows[i]; return (<div className="it" key={i}><input name={`d${i}`} placeholder="Description" aria-label={`Line ${i + 1} description`} defaultValue={r?.description || ""} /><input name={`q${i}`} placeholder="Qty" inputMode="decimal" aria-label="Quantity" defaultValue={r?.quantity ?? ""} /><input name={`p${i}`} placeholder="Unit price" inputMode="decimal" aria-label="Unit price" defaultValue={r?.unit_price ?? ""} /></div>); })}</fieldset>
      {T("payment_terms", "Payment terms and milestones (e.g. 50% deposit, 50% on launch)")}{T("terms", "Terms and conditions", 4)}
      <label>Valid until<input type="date" name="valid_until" defaultValue={p.valid_until || ""} /></label>
      <button className="btn">Save draft</button>
    </form>);
}
