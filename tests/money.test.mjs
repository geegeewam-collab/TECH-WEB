import test from "node:test";
import assert from "node:assert/strict";
import { toMinor, lineTotal, sum, dec, fmt } from "../lib/money.mjs";
import { parseItems, totalOf, effectiveStatus, buildSnapshot, waNumber } from "../lib/proposals.mjs";
test("parses amounts exactly, rejects junk", () => { assert.equal(toMinor("1,500.5"), 150050n); assert.equal(toMinor("0.1"), 10n); assert.equal(toMinor("12.345"), null); assert.equal(toMinor("-5"), null); assert.equal(toMinor("abc"), null); });
test("no floating point drift", () => { const t = sum([toMinor("0.10"), toMinor("0.20")]); assert.equal(dec(t), "0.30"); });
test("line totals round half up", () => { assert.equal(dec(lineTotal(toMinor("1.5"), toMinor("0.05"))), "0.08"); assert.equal(dec(lineTotal(toMinor("3"), toMinor("33.33"))), "99.99"); });
test("formats KES with separators", () => assert.equal(fmt(toMinor("1234567.5")), "KES 1,234,567.50"));
const fd = (o) => ({ get: (k) => o[k] ?? null });
test("items parse, blank rows skipped, bad rows reported", () => {
  const r = parseItems(fd({ d0: "Website", q0: "2", p0: "15000", d1: "", d2: "Bad", p2: "x" }));
  assert.equal(r.items.length, 1); assert.equal(r.items[0].total, "30000.00"); assert.equal(r.errors.length, 1); assert.equal(totalOf(r.items), "30000.00");
});
test("sent proposals past their date count as expired", () => { assert.equal(effectiveStatus({ status: "sent", valid_until: "2026-01-01" }, "2026-02-01"), "expired"); assert.equal(effectiveStatus({ status: "accepted", valid_until: "2026-01-01" }, "2026-02-01"), "accepted"); });
test("snapshot freezes content and total", () => {
  const items = [{ description: "A", quantity: "1.00", unit_price: "100.00", total: "100.00" }];
  const s = buildSnapshot({ number: "PR-1", version: 1, title: "T", currency: "KES" }, { name: "C" }, items); items[0].total = "999.00";
  assert.equal(s.total, "100.00");
});
test("Kenyan numbers become WhatsApp format", () => { assert.equal(waNumber("0791 813 484"), "254791813484"); assert.equal(waNumber("+254791813484"), "254791813484"); });
