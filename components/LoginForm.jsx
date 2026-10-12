"use client";
import { useActionState } from "react";
export default function LoginForm({ action }) {
  const [s, act, pending] = useActionState(action, {});
  return (<form action={act} className="form"><label>Email<input name="email" type="email" required autoComplete="username" /></label>
    <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
    <button className="btn" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>{s?.error && <p className="err" role="alert">{s.error}</p>}</form>);
}
