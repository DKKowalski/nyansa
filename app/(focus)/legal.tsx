import Link from "next/link";
import { I } from "@/components/icons";

/** Plain-words summary page for the Terms and Privacy Policy, opened in a new tab from the sign-up forms. */
export function LegalPage({ title, points }: { title: string; points: [string, string[]][] }) {
  return (
    <div className="scr">
      <div className="top"><Link className="cbtn" href="/welcome" aria-label="Close"><I.close /></Link><div className="grow" /></div>
      <p className="hello">Nyansa</p>
      <h1 className="h-xl">{title}</h1>
      <div className="pcard bg-butter" style={{ cursor: "default" }}><span className="k">Draft summary. The full, reviewed text will be published here before launch.</span></div>
      <div className="gcard legal">
        {points.map(([h, items]) => (
          <section key={h} style={{ display: "grid", gap: 8 }}>
            <h2>{h}</h2>
            <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}
