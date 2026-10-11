import Link from "next/link";
import { logout } from "../actions";
import { SITE } from "../../../lib/site";
export default function Panel({ children }) {
  return (<><div className="atop"><strong>{SITE.name} admin</strong><nav aria-label="Admin"><Link href="/admin">Overview</Link><Link href="/admin/leads">Leads</Link></nav>
    <form action={logout}><button>Sign out</button></form></div><div className="abody">{children}</div></>);
}
