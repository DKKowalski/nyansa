"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { I } from "@/components/icons";
import { KnotMark, LogoBare, Wordmark } from "@/components/brand";
import { useApp } from "@/lib/store";

const pill = (on: boolean): React.CSSProperties => ({ background: on ? "var(--ink)" : "#fff", color: on ? "#fff" : "var(--ink)", borderRadius: 999, padding: "9px 14px", fontSize: 14 });

const SLIDES: { bg: string; t: string; s: string; art: () => React.ReactNode }[] = [
  {
    bg: "var(--sage)", t: "Every topic in the syllabus, made simple", s: "All BECE and WASSCE core subjects, explained with Ghanaian examples.",
    art: () => (<>
      <div className="wfrag" style={{ left: 22, right: 22, top: 34, padding: "16px 16px 14px", display: "grid", gap: 10 }}>
        <span style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 300 }}>Mathematics · Algebra</span>
        <b style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.01em" }}>Linear equations</b>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-end" }}>
          <div><span style={{ fontSize: 12, color: "var(--muted)" }}>Lessons</span><div style={{ fontSize: 30, fontWeight: 300, lineHeight: 1 }}>6</div></div>
          <div><span style={{ fontSize: 12, color: "var(--muted)" }}>Questions</span><div style={{ fontSize: 30, fontWeight: 300, lineHeight: 1 }}>40</div></div>
          <span style={{ marginLeft: "auto", width: 46, height: 46, borderRadius: "50%", background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center" }}><I.up width={22} /></span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 22, top: 212, display: "flex", gap: 8, flexWrap: "wrap", right: 22 }}>
        {["English", "Maths", "Science", "Social Studies"].map((x, i) => <span key={x} style={pill(i === 1)}>{x}</span>)}
      </div>
      <div className="wfrag" style={{ left: 22, width: 200, bottom: 30, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center", borderRadius: 999 }}>
        <span style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--butter)", display: "grid", placeItems: "center", fontWeight: 600 }}>x</span>
        <span style={{ fontSize: 14, lineHeight: 1.2 }}><b style={{ fontWeight: 500 }}>Worked example</b><br /><span style={{ color: "var(--muted)" }}>2x + 3 = 11</span></span>
      </div>
      <div className="wfrag" style={{ right: 22, bottom: 44, width: 86, height: 86, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--forest)" }}><LogoBare size={54} /></div>
    </>),
  },
  {
    bg: "var(--butter)", t: "A plan that knows what you need next", s: "Nyansa finds your weak topics and builds today's plan around them.",
    art: () => (<>
      <div className="wfrag" style={{ left: 22, top: 30, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "var(--clay)" }}><I.flame width={26} height={26} /></span>
        <span style={{ lineHeight: 1.1 }}><b style={{ fontSize: 22, fontWeight: 600 }}>12</b><br /><span style={{ fontSize: 13, color: "var(--ink-2)" }}>day streak</span></span>
      </div>
      <div className="wfrag" style={{ right: 22, top: 30, padding: "12px 14px", width: 120 }}>
        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>BECE in</span><div style={{ fontSize: 32, fontWeight: 300, lineHeight: 1.05 }}>238</div><span style={{ fontSize: 13, color: "var(--muted)" }}>days</span>
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 132, background: "var(--forest-deep)", color: "#fff", borderRadius: 26, padding: 18, display: "grid", gap: 10, boxShadow: "0 18px 30px -16px rgba(10,63,44,.6)" }}>
        <span style={{ justifySelf: "start", background: "var(--gold)", color: "var(--ink)", fontSize: 11.5, fontWeight: 600, letterSpacing: ".06em", padding: "4px 10px", borderRadius: 999 }}>UP NEXT · TODAY</span>
        <b style={{ fontSize: 23, fontWeight: 500, letterSpacing: "-.01em" }}>Fractions and ratio</b>
        <div style={{ display: "flex", gap: 3, height: 20, alignItems: "center" }}>
          {Array.from({ length: 26 }, (_, i) => <i key={i} style={{ flex: i === 9 ? "0 0 4px" : 1, height: i === 9 ? 22 : 14, borderRadius: 3, background: i === 9 ? "#fff" : i < 9 ? "#8FD19E" : "rgba(255,255,255,.14)" }} />)}
        </div>
        <span style={{ background: "#fff", color: "var(--ink)", borderRadius: 14, padding: 11, textAlign: "center", fontWeight: 500 }}>Start lesson</span>
      </div>
      <div className="wfrag" style={{ left: 22, right: 22, bottom: 24, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, borderRadius: 999 }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--leaf)", color: "#fff", display: "grid", placeItems: "center" }}><I.check width={14} height={14} /></span>
        <span style={{ flex: 1, fontSize: 14.5 }}>Review: 6 mistakes from Monday</span><span style={{ fontSize: 13, color: "var(--muted)" }}>5 min</span>
      </div>
    </>),
  },
  {
    bg: "var(--lilac)", t: "A tutor that's there whenever you're stuck", s: "Ask about any question. Get a hint, then the next step, until it clicks.",
    art: () => (<>
      <div style={{ position: "absolute", left: 22, right: 22, top: 30, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--forest)", display: "grid", placeItems: "center", flex: "none" }}><LogoBare size={30} /></span>
        <span style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-.01em" }}>Hey Ama! New day, new topics. How are you feeling?</span>
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 150, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {[["🤩", "Ready!"], ["🙂", "Okay"], ["🫣", "Nervous"]].map(([e, l], i) => (
          <span key={l} className="wfrag" style={{ position: "static", padding: "14px 12px", display: "grid", gap: 10, boxShadow: i === 0 ? "inset 0 0 0 2.5px var(--ink)" : undefined }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>{e}</span><b style={{ fontWeight: 500 }}>{l}</b>
          </span>
        ))}
      </div>
      <div className="wfrag" style={{ right: 22, bottom: 84, padding: "10px 14px", background: "var(--ink)", color: "#fff", borderRadius: "18px 18px 4px 18px", fontSize: 15 }}>I don&apos;t get question 4</div>
      <div className="wfrag" style={{ left: 22, bottom: 24, padding: "10px 14px", borderRadius: "18px 18px 18px 4px", fontSize: 15, maxWidth: 240 }}>Let&apos;s try a hint first: what is 11 − 3?</div>
    </>),
  },
];

/** A1 Welcome: three short slides, then sign up as a student or a parent, or sign in. */
export default function Welcome() {
  const [i, setI] = useState(0);
  const set = useApp((s) => s.set);
  const sl = SLIDES[i], last = i === SLIDES.length - 1;
  const goTo = (n: number) => setI(Math.max(0, Math.min(SLIDES.length - 1, n)));
  // Swipe with a finger or drag with a mouse; taps on buttons and links stay taps.
  const startX = useRef<number | null>(null);
  const swipe = {
    onPointerDown: (e: React.PointerEvent) => { if (!(e.target as HTMLElement).closest("a, button")) startX.current = e.clientX; },
    onPointerUp: (e: React.PointerEvent) => {
      if (startX.current === null) return;
      const dx = e.clientX - startX.current;
      startX.current = null;
      if (Math.abs(dx) > 40) setI((n) => Math.max(0, Math.min(SLIDES.length - 1, n + (dx < 0 ? 1 : -1))));
    },
    onPointerCancel: () => { startX.current = null; },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(i + 1);
      else if (e.key === "ArrowLeft") goTo(i - 1);
    },
  };
  const dots = (
    <div className="dots" role="group" aria-label="Slides">
      {SLIDES.map((_, j) => (
        <button key={j} type="button" className="wdot" aria-label={`Slide ${j + 1} of ${SLIDES.length}`} aria-current={j === i ? "true" : undefined} onClick={() => goTo(j)}>
          <i className={j === i ? "on" : ""} />
        </button>
      ))}
    </div>
  );
  return (
    <div className="scr welcome">
      <div className="top" style={{ minHeight: 44 }}>
        <Wordmark size={34} /><div className="grow" />
        {!last && <button type="button" className="skip" onClick={() => setI(SLIDES.length - 1)}>Skip</button>}
      </div>
      <div className="wgrid" role="region" aria-roledescription="carousel" aria-label="About Nyansa" {...swipe}>
        <div className="wpanel" style={{ background: sl.bg }}>
          <svg className="knotbg" viewBox="0 0 100 100" aria-hidden="true"><KnotMark color="#ffffff" /></svg>
          <div className="wart swap" key={i}>{sl.art()}</div>
        </div>
        <div className="wtext">
          <div className="swap" key={i} style={{ display: "grid", gap: 14 }}>
            <h1 className="wtitle">{sl.t}</h1>
            <p className="wsub">{sl.s}</p>
          </div>
          {last ? (<>
            <div className="wnav" style={{ marginTop: 8 }}>
              {dots}
              <button type="button" className="wnext ghost" onClick={() => goTo(i - 1)} aria-label="Previous slide"><I.back /></button>
            </div>
            <div className="cta" style={{ marginTop: "auto" }}>
              <Link className="btn" href="/signup/level" onClick={() => set({ role: "student" })}>I&apos;m a student</Link>
              <Link className="btn light" href="/signup/parent" onClick={() => set({ role: "parent" })}><I.people />I&apos;m a parent or guardian</Link>
              <Link className="btn text" href="/signin">I already have an account · <b style={{ fontWeight: 500 }}>Sign in</b></Link>
            </div>
          </>) : (
            <div className="wnav">
              {dots}
              <div className="wbtns">
                {i > 0 && <button type="button" className="wnext ghost" onClick={() => goTo(i - 1)} aria-label="Previous slide"><I.back /></button>}
                <button type="button" className="wnext" onClick={() => goTo(i + 1)} aria-label="Next slide"><I.arrow /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
