// Money is handled as integer minor units (BigInt), never floats.
export function toMinor(v) {
  const m = String(v ?? "").trim().replace(/,/g, "").match(/^(\d+)(?:\.(\d{1,2}))?$/);
  return m ? BigInt(m[1]) * 100n + BigInt((m[2] || "").padEnd(2, "0")) : null;
}
export const lineTotal = (qtyMinor, priceMinor) => (qtyMinor * priceMinor + 50n) / 100n; // quantity in hundredths, rounded half up
export const sum = (a) => a.reduce((x, y) => x + y, 0n);
const ab = (n) => (n < 0n ? -n : n);
export const dec = (n) => `${n < 0n ? "-" : ""}${ab(n) / 100n}.${(ab(n) % 100n).toString().padStart(2, "0")}`;
export const fmt = (n, cur = "KES") => `${n < 0n ? "-" : ""}${cur} ${(ab(n) / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${(ab(n) % 100n).toString().padStart(2, "0")}`;
