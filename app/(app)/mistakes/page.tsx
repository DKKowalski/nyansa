"use client";
import { useState } from "react";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { StrandRow } from "@/components/viz";
import { MISTAKES } from "@/lib/content";

/** P6 Mistakes notebook: flashcard review; a mistake leaves after two right answers on different days. */
export default function Mistakes() {
  const toast = useToast();
  const [fi, setFi] = useState(0);
  const [done, setDone] = useState(0);
  const [flip, setFlip] = useState(false);
  const card = MISTAKES[fi % MISTAKES.length];
  const next = (ok: boolean) => {
    setFlip(false); setFi(fi + 1); setDone(Math.min(MISTAKES.length, done + 1));
    toast(ok ? "Nice. It comes back once more in 3 days." : "No problem. It comes back tomorrow.");
  };
  return (
    <div className="scr">
      <div className="top"><BackLink href="/practice" /><div className="grow" /><span className="lvl">{done} of {MISTAKES.length} reviewed</span></div>
      <p className="hello">Mistakes notebook</p>
      <h1 className="h-xl">Review your mistakes</h1>
      <div className="cols">
        <div className="col">
          <div className="fstack">
            <div className="fc b1" /><div className="fc b2" />
            <div className={`fc ${flip ? "ans" : ""}`} key={`${fi}-${flip}`} aria-live="polite">
              <span className="lvl" style={flip ? { color: "#fff", borderColor: "rgba(255,255,255,.3)" } : undefined}>{card.topic}</span>
              <div className="t">{flip ? card.a : card.q}</div>
              <span className="small" style={flip ? { color: "#BFD9CB" } : undefined}>{flip ? card.why : `Missed ${card.when}`}</span>
              {!flip && <button type="button" className="btn light" style={{ width: "auto", padding: "12px 20px" }} onClick={() => setFlip(true)}>Show answer</button>}
            </div>
          </div>
          <div className="cta" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 6 }}>
            <button type="button" className="btn light" style={{ color: "var(--clay)" }} onClick={() => next(false)}>Still learning</button>
            <button type="button" className="btn" onClick={() => next(true)}>Got it</button>
          </div>
        </div>
        <div className="col">
          <div className="gcard" style={{ padding: "10px 20px" }}>
            <b style={{ fontWeight: 500, fontSize: 18, marginTop: 8 }}>By topic</b>
            {([["Algebra", 3], ["Number", 2], ["Geometry", 1]] as const).map(([t, k]) => <StrandRow key={t} name={t} value={`${k} due`} pct={k * 30} />)}
          </div>
          <div className="pcard bg-butter" style={{ cursor: "default" }}><span className="k">How it works</span><span className="n" style={{ fontSize: 17, fontWeight: 400 }}>A mistake leaves the notebook after you get it right twice, a few days apart.</span></div>
        </div>
      </div>
    </div>
  );
}
