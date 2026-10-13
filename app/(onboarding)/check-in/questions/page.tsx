"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { Ticks } from "@/components/viz";
import { QUESTIONS } from "@/lib/content";
import { useApp } from "@/lib/store";

/** D2 Diagnostic questions: one at a time, no right/wrong feedback, "I don't know this yet" allowed. */
export default function Questions() {
  const router = useRouter();
  const { answers, set } = useApp();
  const [qi, setQi] = useState(0);
  const q = QUESTIONS[qi], a = answers[qi], n = QUESTIONS.length, per = 3;
  const pick = (v: number) => set({ answers: { ...answers, [qi]: v } });
  return (
    <div className="scr">
      <div className="top">
        <button type="button" className="cbtn" aria-label="Back" onClick={() => (qi > 0 ? setQi(qi - 1) : router.push("/check-in"))}><I.back /></button>
        <Ticks n={n * per} on={qi * per} now={qi * per} label={`Question ${qi + 1} of ${n}`} />
        <span className="small" style={{ fontWeight: 500, color: "var(--ink)" }}>{qi + 1}/{n}</span>
      </div>
      <div className="cols obc" key={qi}>
        <div className="col">
          <div className="q qbig"><span className="k"><span className="pill">Maths</span>{q.strand}</span><div className="t">{q.q}</div></div>
        </div>
        <div className="col">
          <div className="ans">
            {q.opts.map((o, i) => (
              <button key={i} type="button" aria-pressed={a === i} onClick={() => pick(i)}><span className="l">{"ABCD"[i]}</span>{o}</button>
            ))}
          </div>
          <button type="button" className="idk" aria-pressed={a === -1} onClick={() => pick(-1)}>I don&apos;t know this yet</button>
        </div>
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={a === undefined} onClick={() => (qi < n - 1 ? setQi(qi + 1) : router.push("/check-in/results"))}>
          {qi === n - 1 ? "See my results" : "Next question"}
        </button>
      </div>
    </div>
  );
}
