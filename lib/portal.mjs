// Every portal query is scoped to the client id taken from the signed-in session, never from the browser.
export const scoped = (db, table, cols, cid) => db.from(table).select(cols).eq("client_id", cid);
export const portalProposals = (rows) => rows.filter((p) => ["sent", "accepted", "declined"].includes(p.status));
export const portalInvoices = (rows) => rows.filter((i) => i.status === "issued");
export const visibleUpdates = (ups = []) => ups.filter((u) => u.visible_to_client);
