import PDFDocument from "pdfkit";
import { fmt, toMinor } from "./money.mjs";
// Builds the PDF from the frozen snapshot, so it always matches what the client was sent.
export function proposalPdf(s, brand) {
  return new Promise((res, rej) => {
    const d = new PDFDocument({ size: "A4", margin: 56 }), b = [];
    d.on("data", (c) => b.push(c)); d.on("end", () => res(Buffer.concat(b))); d.on("error", rej);
    d.fontSize(10).fillColor("#4F6358").text(brand.toUpperCase());
    d.moveDown(0.5).fontSize(24).fillColor("#0C3B2E").text(s.title);
    d.fontSize(10).fillColor("#4F6358").text(`${s.number} - Version ${s.version}${s.valid_until ? ` - Valid until ${s.valid_until}` : ""}`).text(`Prepared for ${s.client.name}`);
    const sec = (h, t) => { if (t) d.moveDown(1).fontSize(12).fillColor("#0C3B2E").text(h).moveDown(0.3).fontSize(10).fillColor("#222222").text(t); };
    sec("Summary", s.summary); sec("Scope of work", s.scope); sec("Deliverables", s.deliverables); sec("Exclusions", s.exclusions);
    d.moveDown(1).fontSize(12).fillColor("#0C3B2E").text("Pricing").moveDown(0.3).fontSize(10).fillColor("#222222");
    s.items.forEach((i) => d.text(`${i.description}   (${i.quantity} x ${fmt(toMinor(i.unit_price), s.currency)})   ${fmt(toMinor(i.total), s.currency)}`));
    d.moveDown(0.5).fontSize(12).text(`Total: ${fmt(toMinor(s.total), s.currency)}`);
    sec("Payment terms", s.payment_terms); sec("Terms", s.terms); d.end();
  });
}
export function invoicePdf(inv, brand) {
  return new Promise((res, rej) => {
    const d = new PDFDocument({ size: "A4", margin: 56 }), b = [], c = inv.currency;
    d.on("data", (x) => b.push(x)); d.on("end", () => res(Buffer.concat(b))); d.on("error", rej);
    d.fontSize(10).fillColor("#4F6358").text(brand.toUpperCase()); d.moveDown(0.5).fontSize(24).fillColor("#0C3B2E").text(inv.status === "draft" ? "Invoice (draft)" : "Invoice");
    d.fontSize(10).fillColor("#4F6358").text(`${inv.number || "Not yet issued"}${inv.issue_date ? ` - Issued ${inv.issue_date}` : ""}${inv.due_date ? ` - Due ${inv.due_date}` : ""}`).text(`Billed to ${inv.client}`);
    d.moveDown(1).fontSize(12).fillColor("#0C3B2E").text("Items").moveDown(0.3).fontSize(10).fillColor("#222222");
    inv.items.forEach((i) => d.text(`${i.description}   (${i.quantity} x ${fmt(toMinor(String(i.unit_price)), c)})   ${fmt(i.total, c)}`));
    d.moveDown(0.5).fontSize(12).text(`Total: ${fmt(inv.total, c)}`).fontSize(10).text(`Paid: ${fmt(inv.paid, c)}`).fontSize(12).text(`Outstanding: ${fmt(inv.out, c)}`);
    if (inv.payment_instructions) d.moveDown(1).fontSize(12).fillColor("#0C3B2E").text("How to pay").moveDown(0.3).fontSize(10).fillColor("#222222").text(inv.payment_instructions);
    d.end();
  });
}
export function statementPdf(s, brand, client, number) {
  return new Promise((res, rej) => {
    const d = new PDFDocument({ size: "A4", margin: 56 }), b = [], c = s.currency, m = (x) => fmt(BigInt(x), c);
    d.on("data", (x) => b.push(x)); d.on("end", () => res(Buffer.concat(b))); d.on("error", rej);
    d.fontSize(10).fillColor("#4F6358").text(brand.toUpperCase()); d.moveDown(0.5).fontSize(24).fillColor("#0C3B2E").text("Statement of account");
    d.fontSize(10).fillColor("#4F6358").text(`${number} - ${s.from} to ${s.to}`).text(client);
    d.moveDown(1).fontSize(10).fillColor("#222222").text(`Opening balance: ${m(s.opening)}`);
    s.entries.forEach((e) => d.text(`${e.date}  ${e.ref || ""}  ${e.desc}   Charge ${m(e.debit)}   Paid ${m(e.credit)}   Balance ${m(e.balance)}`));
    d.moveDown(0.5).text(`Charges: ${m(s.charges)}   Payments: ${m(s.credits)}`).fontSize(12).text(`Closing balance at ${s.to}: ${m(s.closing)}`);
    if (BigInt(s.overdue) > 0n) d.fontSize(10).text(`Of which overdue: ${m(s.overdue)}`);
    d.moveDown(1).fontSize(9).fillColor("#4F6358").text("Please tell us if anything here looks different from your own records."); d.end();
  });
}
export function receiptPdf(r, brand) {
  return new Promise((res, rej) => {
    const d = new PDFDocument({ size: "A4", margin: 56 }), b = [];
    d.on("data", (x) => b.push(x)); d.on("end", () => res(Buffer.concat(b))); d.on("error", rej);
    d.fontSize(10).fillColor("#4F6358").text(brand.toUpperCase()); d.moveDown(0.5).fontSize(24).fillColor("#0C3B2E").text("Payment receipt");
    d.fontSize(10).fillColor("#4F6358").text(`${r.receipt_no} - ${r.paid_on}`).text(`Received from ${r.client}`);
    d.moveDown(1).fontSize(14).fillColor("#222222").text(`Amount received: ${fmt(r.amount, r.currency)}`).fontSize(10).text(`Method: ${r.method}${r.reference ? ` (${r.reference})` : ""}`);
    r.applied.forEach((a) => d.text(`Applied to ${a.number}: ${fmt(a.amount, r.currency)}`)); d.end();
  });
}
