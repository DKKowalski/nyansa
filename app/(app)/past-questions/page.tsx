"use client";
import Link from "next/link";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { PASTQ } from "@/lib/content";

/** P4 Past questions: WAEC questions by year and paper, filtered to a topic. */
export default function PastQuestions() {
  const toast = useToast();
  const small = { padding: "12px 16px", fontSize: 15, width: "auto" } as const;
  return (
    <div className="scr">
      <div className="top"><BackLink href="/practice" /><div className="grow" /><button type="button" className="cbtn" aria-label="Search" onClick={() => toast("Search comes later")}><I.search /></button></div>
      <h1 className="h-xl">Past questions</h1>
      <div className="chips">
        {["Linear equations", "All years", "Paper 1", "Paper 2"].map((x, i) => <button key={x} type="button" className="chip" aria-pressed={i === 0} onClick={() => toast("Filters come in the build")}>{x}</button>)}
      </div>
      <div className="grid2">
        {PASTQ.map((x) => (
          <div key={x.q} className="pq2">
            <div className="ft"><span className="yr">{x.y}</span><span className="lvl">{x.p}</span>{x.seen && <span className="lvl" style={{ background: "var(--sage)", borderColor: "transparent" }}>Done ✓</span>}</div>
            <div className="t">{x.q}</div>
            <div className="ft">
              {x.p === "Paper 2"
                ? <Link className="btn" style={small} href="/theory">Answer and get marked</Link>
                : <button type="button" className="btn light" style={small} onClick={() => toast("Opens as a practice question")}>Try it</button>}
              <button type="button" className="btn text" style={{ width: "auto", fontSize: 15 }} onClick={() => toast("Shows the full worked solution")}>Solution</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
