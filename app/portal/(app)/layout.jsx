import Link from "next/link";
import { portalLogout } from "../actions";
import { requireClient } from "../../../lib/supabase";
import { brand } from "../../../lib/settings";
export default async function PortalApp({ children }) {
  const { client } = await requireClient();
  return (<><div className="atop"><strong>{(await brand()).name}</strong><span style={{ color: "var(--soft)" }}>{client?.name}</span><Link href="/portal/account" style={{ color: "var(--soft)" }}>Account</Link><form action={portalLogout}><button>Sign out</button></form></div><div className="abody">{children}</div></>);
}
