import test from "node:test";
import assert from "node:assert/strict";
import { buildStatement } from "../lib/statement.mjs";
import { dec, fmt } from "../lib/money.mjs";
const pay = (id, d, amt, rev = false) => ({ paymentId: id, paid_on: d, amount: amt, receipt_no: "RCT-" + id, method: "mpesa", reference: "X" + id, reversed: rev });
const inv = [
  { number: "INV-1", issue_date: "2026-01-01", due_date: "2026-01-15", total: 100000n, allocs: [pay(1, "2026-01-15", 30000n)] },
  { number: "INV-2", issue_date: "2026-02-01", due_date: "2026-02-15", total: 50000n, allocs: [pay(2, "2026-02-10", 20000n), pay(3, "2026-02-12", 5000n, true)] },
];
test("opening + charges - credits = closing, and matches invoiced minus paid", () => {
  const s = buildStatement({ invoices: inv, from: "2026-02-01", to: "2026-02-28" });
  assert.equal(s.opening, "70000"); assert.equal(s.charges, "50000"); assert.equal(s.credits, "20000"); assert.equal(s.closing, "100000");
  assert.equal(BigInt(s.opening) + BigInt(s.charges) - BigInt(s.credits), BigInt(s.closing));
  assert.equal(BigInt(s.closing), 150000n - 50000n);
});
test("running balance on each line follows the arithmetic", () => {
  const s = buildStatement({ invoices: inv, from: "2026-01-01", to: "2026-12-31" });
  assert.deepEqual(s.entries.map((e) => e.balance), ["100000", "70000", "120000", "100000"]);
});
test("reversed payments are excluded", () => { const s = buildStatement({ invoices: inv, from: "2026-02-01", to: "2026-02-28" }); assert.ok(!s.entries.some((e) => e.ref === "RCT-3")); });
test("overdue is measured at the statement end date", () => {
  assert.equal(buildStatement({ invoices: inv, from: "2026-01-01", to: "2026-01-10" }).overdue, "0");
  assert.equal(buildStatement({ invoices: inv, from: "2026-01-01", to: "2026-03-01" }).overdue, "100000");
});
test("negative amounts format correctly", () => { assert.equal(dec(-1050n), "-10.50"); assert.equal(fmt(-123456n), "-KES 1,234.56"); });
