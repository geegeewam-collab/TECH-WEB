import Link from "next/link";
import { WORK } from "../lib/site";
import Frame from "./Frame";
export default function WorkCards() {
  return (<div className="pf">{WORK.map((w) => (
    <Link key={w.slug} href={`/work/${w.slug}`} className="pc"><Frame w={w} />
      <div className="pm"><h3>{w.t}</h3><span><i className="dot" />{w.st} · {w.cat}</span></div></Link>))}</div>);
}
