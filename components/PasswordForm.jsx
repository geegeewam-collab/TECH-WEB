"use client";
import { useActionState } from "react";
export default function PasswordForm({ action }) {
  const [s, act, pending] = useActionState(action, {});
  return (<form action={act} className="form"><h2>Change your password</h2>
    <label>Current password<input name="current" type="password" required autoComplete="current-password" /></label>
    <label>New password (at least 10 characters)<input name="next" type="password" required minLength={10} autoComplete="new-password" /></label>
    <button className="btn" disabled={pending}>{pending ? "Saving…" : "Change password"}</button>{s?.ok && <p className="ok" role="status">Password changed.</p>}{s?.error && <p className="err" role="alert">{s.error}</p>}</form>);
}
