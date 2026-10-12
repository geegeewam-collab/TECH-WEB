import test from "node:test";
import assert from "node:assert/strict";
import { allocatedPaid, invoiceState, pctOf, receivable } from "../lib/billing.mjs";
const issued = { status: "issued", due_date: "2026-03-01" };
test("states: partial, paid, overdue, draft", () => {
  assert.equal(invoiceState(issued, 1000n, 0n, "2026-02-01"), "issued");
  assert.equal(invoiceState(issued, 1000n, 400n, "2026-02-01"), "partial");
  assert.equal(invoiceState(issued, 1000n, 1000n, "2026-04-01"), "paid");
  assert.equal(invoiceState(issued, 1000n, 400n, "2026-04-01"), "overdue");
  assert.equal(invoiceState({ status: "draft" }, 1000n, 0n, "2026-04-01"), "draft");
});
test("reversed payments are not counted", () => assert.equal(allocatedPaid([{ amount: 500, payments: { reversed_at: null } }, { amount: 300, payments: { reversed_at: "2026-01-01" } }]), 50000n));
test("percentage invoices round half up", () => { assert.equal(pctOf(10000n, 50), 5000n); assert.equal(pctOf(10001n, 50), 5001n); assert.equal(pctOf(333n, 33), 110n); });
test("receivables exclude drafts, voids and settled invoices", () => assert.equal(receivable([{ state: "draft", out: 5n }, { state: "void", out: 6n }, { state: "paid", out: 0n }, { state: "overdue", out: 700n }, { state: "partial", out: 300n }]), 1000n));
