"use client";
import Link from "next/link";
import { KnotMark } from "@/components/brand";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { StrandRow } from "@/components/viz";
import { MAP } from "@/lib/content";

const XS = [170, 252, 170, 88]; // zig-zag x positions of topic nodes on the 340px path

/** L2 Syllabus journey: units as a winding path with kente unit pills and a "you are here" marker. */
export default function Journey() {
  const toast = useToast();
  let y = 0, ti = 0;
  const pts: [number, number, string][] = [];
  const nodes: React.ReactNode[] = [];
  MAP.forEach((it, idx) => {
    if ("u" in it) {
      nodes.push(<div key={idx} className="unit" style={{ top: y }}><span className="kente" /><span className="tx"><b>{it.u} · {it.name}</b><span>{it.sub}</span></span><span className="pc">{it.pc}</span></div>);
      y += 84;
      return;
    }
    const x = XS[ti % 4], cy = y + 40, left = x > 200;
    pts.push([x, cy, it.s]);
    const icon = it.s === "m" ? <I.check /> : it.s === "cur" ? "▶" : it.s === "o" ? "½" : it.sym ?? "•";
    const nodeProps = { className: `node ${it.s}`, style: { left: x - 32, top: cy - 32 }, "aria-label": `${it.t}: ${it.k}` };
    nodes.push(
      it.id
        ? <Link key={idx} href={`/learn/mathematics/${it.id}`} {...nodeProps}>{icon}</Link>
        : <button key={idx} type="button" {...nodeProps} onClick={() => toast(`${it.t}: open Linear equations for the sample`)}>{icon}</button>,
      <div key={`l${idx}`} className="nlabel" style={{ top: cy - 18, ...(left ? { left: x - 46 - 126, textAlign: "right" } : { left: x + 46 }) }}><b>{it.t}</b><span>{it.k}</span></div>,
    );
    if (it.s === "cur") nodes.push(<span key="here" className="here" style={{ left: x, top: cy - 64 }}>You are here</span>);
    y += 96; ti++;
  });
  const ci = pts.findIndex((p) => p[2] === "cur");
  let d = `M${pts[0][0]} ${pts[0][1]}`, done = d;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    const seg = ` C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`;
    d += seg; if (i <= ci) done += seg;
  }

  return (
    <div className="scr">
      <div className="top"><BackLink href="/learn" /><div className="grow" /><button type="button" className="cbtn" aria-label="Search" onClick={() => toast("Search comes later")}><I.search /></button></div>
      <p className="hello">Mathematics · BECE</p>
      <h1 className="h-xl">Your journey</h1>
      <div className="chips">
        <span className="chip icon"><I.filter /></span>
        {["All units", "Number", "Algebra", "Geometry", "Data"].map((x, i) => <button key={x} type="button" className="chip" aria-pressed={i === 0} onClick={() => toast("Filtering by strand comes later")}>{x}</button>)}
      </div>
      <div className="cols">
        <div className="col">
          <div className="chain" style={{ height: y }}>
            {[[18, 300], [300, 620], [14, 980], [296, 1240]].map(([x, yy]) => (
              <svg key={yy} style={{ position: "absolute", left: x, top: yy, opacity: 0.12 }} width="44" height="44" viewBox="0 0 100 100" aria-hidden="true"><KnotMark color="#0F6B4A" /></svg>
            ))}
            <svg className="road" width="340" height={y} aria-hidden="true">
              <path d={d} fill="none" stroke="#DCDFD9" strokeWidth="12" strokeLinecap="round" strokeDasharray="2 18" />
              <path d={done} fill="none" stroke="#0F6B4A" strokeOpacity=".35" strokeWidth="12" strokeLinecap="round" />
            </svg>
            {nodes}
          </div>
        </div>
        <div className="col w-only">
          <div className="hero">
            <span className="live">UP NEXT</span><h3>Linear equations</h3>
            <div className="meta"><span><I.book />6 lessons</span><span><I.practice />40 questions</span></div>
            <Link href="/learn/mathematics/linear-equations">Open topic</Link>
          </div>
          <div className="gcard" style={{ padding: "12px 20px" }}>
            <div className="hd" style={{ margin: "6px 0" }}><b>Strand mastery</b></div>
            {([["Number", 0.83], ["Algebra", 0.42], ["Geometry", 0.1], ["Data", 0]] as const).map(([n, v]) => <StrandRow key={n} name={n} value={`${Math.round(v * 100)}%`} pct={Math.max(3, v * 100)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
