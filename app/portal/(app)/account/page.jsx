import Link from "next/link";
import PasswordForm from "../../../../components/PasswordForm";
import { changePassword } from "../../actions";
export default function Account() {
  return (<><p><Link href="/portal">← Back</Link></p><h1>Account</h1><PasswordForm action={changePassword} /></>);
}
