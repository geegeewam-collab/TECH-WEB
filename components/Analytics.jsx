"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
const ok = (v) => (v && /^[\w-]+$/.test(v) ? v : "");
const GA = ok(process.env.NEXT_PUBLIC_GA_ID), ADS = ok(process.env.NEXT_PUBLIC_GADS_ID), PIX = ok(process.env.NEXT_PUBLIC_META_PIXEL_ID);
// Nothing loads, and no banner shows, unless an ID is configured. Scripts load only after the visitor accepts.
export default function Analytics() {
  const [c, setC] = useState("wait");
  useEffect(() => { try { setC(localStorage.getItem("gg_consent") || "ask"); } catch { setC("no"); } }, []);
  if (!GA && !ADS && !PIX) return null;
  const pick = (v) => { try { localStorage.setItem("gg_consent", v); } catch {} setC(v); };
  return (<>
    {c === "yes" && (GA || ADS) && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${GA || ADS}`} strategy="afterInteractive" />
      <Script id="gtag" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());${GA ? `gtag('config','${GA}');` : ""}${ADS ? `gtag('config','${ADS}');` : ""}`}</Script></>}
    {c === "yes" && PIX && <Script id="fbq" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIX}');fbq('track','PageView');`}</Script>}
    {c === "ask" && <div className="consent" role="dialog" aria-label="Cookie choice"><p>We would like to use analytics cookies to understand which pages and ads bring enquiries. <a href="/privacy">Privacy</a></p><div><button className="btn sm" onClick={() => pick("yes")}>Accept</button><button className="btn sm q" onClick={() => pick("no")}>Decline</button></div></div>}</>);
}
