"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { Ticks } from "@/components/viz";
import { haptic } from "@/components/motion";
import { PQ } from "@/lib/content";
import { useApp } from "@/lib/store";

/** P1 Practice question → P2 feedback: a green or red panel slides up with the explanation. */
/** Next keeps recent routes mounted (React Activity), which would carry the question position into a new
 *  attempt. Keying on the attempt starts each one fresh while "continue" keeps its place. */
export default function PracticeQuestionPage() {
  const attempt = useApp((s) => s.pattempt);
  return <PracticeQuestion key={attempt} />;
}

function PracticeQuestion() {
  const router = useRouter();
  const { pans, set, startChat } = useApp();
  const [pi, setPi] = useState(0);
  const [checked, setChecked] = useState(false);
  const q = PQ[pi], a = pans[pi], ok = a === q.a, last = pi === PQ.length - 1;
  const ask = () => { startChat(pi); router.push("/tutor"); };
  const next = () => {
    setChecked(false);
    if (!last) setPi(pi + 1);
    else { set({ psetDone: true }); router.push("/practice/summary"); }
  };
  const optStyle = (i: number): React.CSSProperties | undefined =>
    !checked ? undefined : i === q.a ? { background: "#DDEFE3", color: "var(--ink)" } : i === a && !ok ? { background: "#FBE3DC", color: "var(--ink)" } : undefined;

  return (
    <>
      <div className="scr" style={checked ? { paddingBottom: 260 } : undefined}>
        <div className="top">
          <BackLink href="/practice/sets" label="Close" />
          <Ticks n={PQ.length * 4} on={pi * 4} now={pi * 4} label={`Question ${pi + 1} of ${PQ.length}`} />
          <span className="small" style={{ fontWeight: 500, color: "var(--ink)" }}>{pi + 1}/{PQ.length}</span>
        </div>
        <div className="q in-next" key={pi}><span className="k"><span className={`lvl ${q.lv === "Advanced" ? "adv" : ""}`}>{q.lv}</span>Set 2</span><div className="t">{q.q}</div></div>
        <div className="ans in-next" key={`a${pi}`}>
          {q.opts.map((o, i) => (
            <button key={i} type="button" aria-pressed={a === i} disabled={checked} style={optStyle(i)} onClick={() => set({ pans: { ...pans, [pi]: i } })}>
              <span className="l">{"ABCD"[i]}</span>{o}
            </button>
          ))}
        </div>
        {!checked && (
          <div className="cta">
            <button type="button" className="btn" disabled={a === undefined} onClick={() => { if (ok) haptic("success"); setChecked(true); }}>Check answer</button>
            <button type="button" className="btn text" onClick={ask}>I&apos;m stuck, ask the tutor</button>
          </div>
        )}
      </div>
      {checked && (
        <div className={`fb ${ok ? "ok" : "no"}`} role="status">
          <div className="hd"><span className="ic">{ok ? <I.check /> : <I.close />}</span>{ok ? "Correct!" : "Not quite"}</div>
          <p>{!ok && <>The answer is <b>{q.opts[q.a]}</b>. </>}{q.why}</p>
          <div className="row">
            <button type="button" className="btn light" onClick={ask}>Ask tutor why</button>
            <button type="button" className="btn" onClick={next} autoFocus>{last ? "See results" : "Continue"}</button>
          </div>
        </div>
      )}
    </>
  );
}
