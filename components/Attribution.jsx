"use client";
import { useEffect } from "react";
// Remembers where a visitor first came from (UTM tags, landing page) so the enquiry can carry it.
export default function Attribution() {
  useEffect(() => { try {
    if (localStorage.getItem("gg_attr")) return;
    const q = new URLSearchParams(location.search), a = { landing_page: location.pathname, referrer: document.referrer };
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((k) => { if (q.get(k)) a[k] = q.get(k); });
    localStorage.setItem("gg_attr", JSON.stringify(a));
  } catch {} }, []);
  return null;
}
