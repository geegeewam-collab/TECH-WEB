import test from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry, STATUSES } from "../lib/leads.mjs";
const ok = { name: " Amina ", email: "A@Example.com", message: "I need a booking website." };
test("accepts and normalises a valid enquiry", () => { const r = validateEnquiry(ok); assert.equal(r.data.name, "Amina"); assert.equal(r.data.email, "a@example.com"); assert.equal(r.data.phone, null); });
test("rejects bad email, short message, missing name", () => {
  assert.ok(validateEnquiry({ ...ok, email: "nope" }).error); assert.ok(validateEnquiry({ ...ok, message: "short" }).error); assert.ok(validateEnquiry({ ...ok, name: " " }).error);
});
test("honeypot is flagged as a bot", () => assert.equal(validateEnquiry({ ...ok, website: "x" }).bot, true));
test("keeps UTM data and caps its length", () => {
  const r = validateEnquiry({ ...ok, attribution: { utm_source: "google", utm_campaign: "x".repeat(500), landing_page: "/services" } });
  assert.equal(r.data.utm_source, "google"); assert.equal(r.data.utm_campaign.length, 120); assert.equal(r.data.utm_medium, null);
});
test("ignores a non-object attribution", () => assert.equal(validateEnquiry({ ...ok, attribution: "<script>" }).data.utm_source, null));
test("lead statuses match the database", () => assert.deepEqual(Object.keys(STATUSES), ["new", "contacted", "qualified", "proposal_in_preparation", "proposal_sent", "won", "lost", "archived"]));
