"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const L = [["/work", "Portfolio"], ["/services", "Services"], ["/approach", "Approach"], ["/contact", "Contact"]];
export default function Menu() {
  const p = usePathname(), [o, setO] = useState(false);
  useEffect(() => setO(false), [p]);
  return (<>
    <button className="mb" aria-expanded={o} aria-controls="nav" onClick={() => setO(!o)}>{o ? "Close" : "Menu"}</button>
    <nav id="nav" className={o ? "open" : ""} aria-label="Main">
      {L.map(([h, t]) => <Link key={h} href={h} aria-current={p.startsWith(h) ? "page" : undefined}>{t}</Link>)}
    </nav></>);
}
