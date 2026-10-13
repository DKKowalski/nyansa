"use client";
import { useEffect, useRef, useState } from "react";
import { haptic } from "@/components/motion";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { StrandRow } from "@/components/viz";
import { MISTAKES } from "@/lib/content";

/** P6 Mistakes notebook: flashcard review; a mistake leaves after two right answers on different days.
 *  The card flips in 3D and can be swiped: right for "Got it", left for "Still learning". A flick is enough. */
export default function Mistakes() {
  const toast = useToast();
  const [fi, setFi] = useState(0);
  const [done, setDone] = useState(0);
  const [flip, setFlip] = useState(false);
  const [out, setOut] = useState<"left" | "right" | null>(null);
  const drag = useRef<{ x: number; t: number; id: number; dx: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const card = MISTAKES[fi % MISTAKES.length];

  const send = (ok: boolean) => {
    if (out) return;
    haptic(ok ? "success" : "tap");
    setOut(ok ? "right" : "left");
    timer.current = setTimeout(() => {
      setOut(null); setFlip(false); setFi((n) => n + 1); setDone((n) => Math.min(MISTAKES.length, n + 1));
      toast(ok ? "Nice. It comes back once more in 3 days." : "No problem. It comes back tomorrow.");
    }, 260);
  };

  const start = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current || out || (e.target as HTMLElement).closest("button")) return;
    drag.current = { x: e.clientX, t: Date.now(), id: e.pointerId, dx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.setAttribute("data-dragging", "");
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    d.dx = e.clientX - d.x;
    e.currentTarget.style.transform = `translateX(${d.dx}px) rotate(${d.dx * 0.05}deg)`;
  };
  const end = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current, el = e.currentTarget;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    el.removeAttribute("data-dragging");
    el.style.transform = ""; // hand back to CSS: it either flies out from here or settles back
    const velocity = Math.abs(d.dx) / Math.max(1, Date.now() - d.t);
    if (Math.abs(d.dx) > 100 || (Math.abs(d.dx) > 12 && velocity > 0.11)) send(d.dx > 0);
    else if (Math.abs(d.dx) < 6) { setFlip((f) => !f); haptic("tap"); } // a tap flips the card
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
            <div key={fi} className="fcard" data-flipped={flip ? "" : undefined} data-out={out ?? undefined}
              onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
              role="group" aria-label={flip ? `Answer: ${card.a}` : `Question: ${card.q}`}>
              <div className="fface">
                <div className="fc front">
                  <span className="lvl">{card.topic}</span>
                  <div className="t">{card.q}</div>
                  <span className="small">Missed {card.when}</span>
                  <button type="button" className="btn light" style={{ width: "auto", padding: "12px 20px" }} onClick={() => { haptic("tap"); setFlip(true); }}>Show answer</button>
                </div>
                <div className="fc back ans" aria-hidden={!flip}>
                  <span className="lvl" style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)" }}>{card.topic}</span>
                  <div className="t">{card.a}</div>
                  <span className="small" style={{ color: "#BFD9CB" }}>{card.why}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="small" style={{ textAlign: "center", margin: 0 }}>Swipe right if you knew it, left to see it again</p>
          <div className="cta" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 6 }}>
            <button type="button" className="btn light" style={{ color: "var(--clay)" }} onClick={() => send(false)}>Still learning</button>
            <button type="button" className="btn" onClick={() => send(true)}>Got it</button>
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
