import test from "node:test";
import assert from "node:assert/strict";
import { scoped, portalProposals, portalInvoices, visibleUpdates } from "../lib/portal.mjs";
test("portal queries are always filtered by the session's client id", () => {
  const calls = []; const fake = { from: (t) => ({ select: (c) => ({ eq: (k, v) => { calls.push([t, c, k, v]); return {}; } }) }) };
  scoped(fake, "invoices", "id", "CLIENT-A"); assert.deepEqual(calls[0], ["invoices", "id", "client_id", "CLIENT-A"]);
});
test("clients never see drafts, withdrawn proposals, void invoices or private notes", () => {
  assert.deepEqual(portalProposals([{ status: "draft" }, { status: "sent" }, { status: "withdrawn" }, { status: "accepted" }]).map((p) => p.status), ["sent", "accepted"]);
  assert.deepEqual(portalInvoices([{ status: "draft" }, { status: "issued" }, { status: "void" }]).map((i) => i.status), ["issued"]);
  assert.equal(visibleUpdates([{ visible_to_client: false, body: "private" }, { visible_to_client: true, body: "ok" }]).length, 1);
});
