import Link from "next/link";
import { logout } from "../actions";
import { brand } from "../../../lib/settings";
export default async function Panel({ children }) {
  return (<><div className="atop"><strong>{(await brand()).name} admin</strong><nav aria-label="Admin"><Link href="/admin">Overview</Link><Link href="/admin/leads">Leads</Link><Link href="/admin/clients">Clients</Link><Link href="/admin/proposals">Proposals</Link><Link href="/admin/projects">Projects</Link><Link href="/admin/invoices">Invoices</Link><Link href="/admin/statements">Statements</Link><Link href="/admin/emails">Emails</Link><Link href="/admin/settings">Settings</Link></nav>
    <form action={logout}><button>Sign out</button></form></div><div className="abody">{children}</div></>);
}
