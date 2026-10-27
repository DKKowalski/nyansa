"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { I } from "@/components/icons";
import { KnotMark, Wordmark } from "@/components/brand";
import { SlideArt, type SlideArtKind } from "@/components/art";
import { useApp } from "@/lib/store";

const SLIDES: { bg: string; t: string; s: string; art: SlideArtKind }[] = [
  { bg: "var(--sage)", t: "Every topic in the syllabus, made simple", s: "All BECE and WASSCE core subjects, explained with Ghanaian examples.", art: "syllabus" },
  { bg: "var(--butter)", t: "A plan that knows what you need next", s: "Nyansa finds your weak topics and builds today's plan around them.", art: "plan" },
  { bg: "var(--lilac)", t: "A tutor that's there whenever you're stuck", s: "Ask about any question. Get a hint, then the next step, until it clicks.", art: "tutor" },
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
          <div className="wart swap" key={i}><SlideArt kind={sl.art} /></div>
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
