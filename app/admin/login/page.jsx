import LoginForm from "./LoginForm";
export default async function Login({ searchParams }) {
  const sp = await searchParams;
  return (<div className="alog"><h1>Admin sign in</h1>
    {sp?.e === "config" && <p className="err">The database is not configured yet. Add the Supabase variables in your hosting settings.</p>}<LoginForm /><p className="mut" style={{ marginTop: 16 }}>Trouble signing in? <a href="/api/health">Check the setup</a>.</p></div>);
}
