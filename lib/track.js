"use client";
// Called only after the server confirms an enquiry was saved. Sends no personal data.
export function trackLead() {
  try {
    const ads = process.env.NEXT_PUBLIC_GADS_ID, label = process.env.NEXT_PUBLIC_GADS_LABEL;
    if (window.gtag) { window.gtag("event", "generate_lead"); if (ads && label) window.gtag("event", "conversion", { send_to: `${ads}/${label}` }); }
    if (window.fbq) window.fbq("track", "Lead");
  } catch {}
}
