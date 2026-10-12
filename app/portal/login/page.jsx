import LoginForm from "../../../components/LoginForm";
import { portalLogin } from "../actions";
import { brand } from "../../../lib/settings";
export default async function PortalLogin({ searchParams }) {
  const sp = await searchParams;
  return (<div className="alog"><p className="mut">{(await brand()).name}</p><h1>Client portal</h1><p className="mut">Sign in to see your proposals, projects, invoices and statements.</p>
    {sp?.e === "config" && <p className="err">The portal is not available yet.</p>}<LoginForm action={portalLogin} /></div>);
}
