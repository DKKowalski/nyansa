"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { THEORY } from "@/lib/content";
import { useApp } from "@/lib/store";

/** P5 Theory answer marking: marks per step against a WAEC-style scheme. Sample marking until AI is connected. */
export default function Theory() {
  const toast = useToast();
  const router = useRouter();
  const startChat = useApp((s) => s.startChat);
  const [ans, setAns] = useState(THEORY.sample);
  const [marked, setMarked] = useState(false);
  const got = THEORY.points.filter((p) => p.ok).length;
  return (
    <div className="scr">
      <div className="top"><BackLink href="/practice" /><div className="grow" /><span className="lvl">Paper 2 · {THEORY.marks} marks</span></div>
      <div className="cols">
        <div className="col">
          <div className="q"><span className="k"><span className="yr">{THEORY.year}</span>BECE Maths · Theory</span><h1 className="t" style={{ margin: 0, fontWeight: 400 }}>{THEORY.q}</h1></div>
          {marked ? (
            <div className="gcard"><span className="small" style={{ color: "var(--ink-2)" }}>Your working</span><pre style={{ margin: "6px 0 0", font: "inherit", fontSize: 17, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{ans}</pre></div>
          ) : (<>
            <textarea className="ta" aria-label="Your working" value={ans} onChange={(e) => setAns(e.target.value)} />
            <div style={{ display: "flex", gap: 8 }}><button type="button" className="mflag" onClick={() => toast("Photo upload comes after the beta")}><I.camera width={18} height={18} /> Upload a photo instead</button></div>
            <div className="cta"><button type="button" className="btn" disabled={!ans.trim()} onClick={() => setMarked(true)}>Mark my answer</button></div>
          </>)}
        </div>
        <div className="col">
          {marked ? (<>
            <div className="gcard" role="status">
              <span className="small" style={{ color: "var(--ink-2)" }}>AI marking against the WAEC scheme</span>
              <div className="big"><b>{got}<span style={{ fontSize: 40, color: "var(--muted)" }}>/{THEORY.marks}</span></b><span>So close! One slip at the end.</span></div>
            </div>
            <div className="marks">
              {THEORY.points.map((p) => (
                <div key={p.b} className="mk">
                  <span className="ic" style={{ background: p.ok ? "var(--leaf)" : "var(--clay)" }}>{p.ok ? <I.check /> : <I.close />}</span>
                  <span className="tx"><b>{p.b}</b><span>{p.t}</span></span><span className="m">{p.m}</span>
                </div>
              ))}
            </div>
            <p className="small">AI-marked, may not be exact. <button type="button" className="linkbtn" onClick={() => toast("Thanks. A teacher will check this marking.")}>Disagree? Flag it</button></p>
            <div className="cta" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <button type="button" className="btn light" onClick={() => setMarked(false)}>Try again</button>
              <button type="button" className="btn" onClick={() => { startChat(3); router.push("/tutor"); }}>Ask the tutor</button>
            </div>
          </>) : (
            <div className="pcard bg-sage" style={{ cursor: "default" }}><span className="k">How marking works</span><span className="n" style={{ fontSize: 17, fontWeight: 400 }}>Type your working line by line, or upload a photo. You get marks for each step, like a WAEC examiner gives them, plus a model answer.</span></div>
          )}
        </div>
      </div>
    </div>
  );
}
