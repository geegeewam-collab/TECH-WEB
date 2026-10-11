import fs from "fs";
import path from "path";
// Shows public/work/<slug>.(png|jpg|webp) if you add one; otherwise an abstract browser frame.
export default function Frame({ w }) {
  const f = ["png", "jpg", "jpeg", "webp"].map((e) => `${w.slug}.${e}`).find((n) => fs.existsSync(path.join(process.cwd(), "public", "work", n)));
  return (
    <div className="fr">
      <div className="fb"><i /><i /><i /><span>{w.url.replace(/^https?:\/\//, "")}</span></div>
      {f ? <img src={`/work/${f}`} alt={`${w.t} website`} loading="lazy" /> : <div className="fm"><strong>{w.t}</strong><u /><u style={{ width: "60%" }} /><b /></div>}
    </div>);
}
