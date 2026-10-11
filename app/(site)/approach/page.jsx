import { PROCESS } from "../../../lib/site";
import Closing from "../../../components/Closing";
export const metadata = { title: "Approach", description: "How the studio works." };
export default function Approach() {
  return (<><div className="w pg"><h1>How we work</h1><p className="lead">Five stages, with scope and terms agreed in writing before the next one begins.</p></div>
    <section><div className="w"><div className="proc">{PROCESS.map((p, i) => <div key={p[0]}><small>0{i + 1}</small><h3>{p[0]}</h3><p>{p[1]}</p></div>)}</div></div></section><Closing /></>);
}
