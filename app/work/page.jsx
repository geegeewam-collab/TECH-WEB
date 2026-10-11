import WorkCards from "../../components/WorkCards";
import Closing from "../../components/Closing";
export const metadata = { title: "Portfolio", description: "Selected projects." };
export default function Work() {
  return (<><div className="w pg"><h1>Portfolio</h1><p className="lead">Only real projects appear here. Results are published only once they have been measured.</p></div>
    <section><div className="w"><WorkCards /></div></section><Closing /></>);
}
