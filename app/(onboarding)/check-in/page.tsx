"use client";
import Link from "next/link";
import { TutorFace } from "@/components/brand";
import { CtaLink } from "@/components/ui";
import { examName, firstName, useApp, type Mood } from "@/lib/store";

const MOODS: [Mood, string, string][] = [["confident", "🤩", "Ready!"], ["okay", "🙂", "Okay"], ["nervous", "🫣", "Nervous"]];
const REPLY: Record<Mood, string> = {
  nervous: "That's normal. There are no marks here, and \"I don't know this yet\" is a fine answer.",
  okay: "Good. 8 quick questions, about 5 minutes. No marks, no pass or fail.",
  confident: "Let's go! 8 quick questions, about 5 minutes.",
};

/** D1 Diagnostic intro with the mood check-in. */
export default function CheckIn() {
  const { name, mood, exam, set } = useApp();
  return (
    <div className="scr white">
      <div className="top"><div className="grow" /><Link className="skip" href="/home">Later</Link></div>
      <div className="cols obc">
        <div className="col">
          <div className="today">Today</div>
          <div className="tutor"><TutorFace /><p>Hey {firstName(name)}! Let&apos;s find your starting point in Maths. How are you feeling about it?</p></div>
          <div className="moods">
            {MOODS.map(([v, e, l]) => (
              <button key={v} type="button" className="mood" aria-pressed={mood === v} onClick={() => set({ mood: v })}><span className="em">{e}</span><b>{l}</b></button>
            ))}
          </div>
          {mood && (
            <div className="tutor"><span className="face" style={{ visibility: "hidden" }}>N</span><p style={{ fontSize: 18, fontWeight: 400, color: "var(--ink-2)" }}>{REPLY[mood]}</p></div>
          )}
        </div>
        <div className="col w-only">
          <div className="gcard" style={{ background: "var(--ground)" }}>
            <b style={{ fontWeight: 500, fontSize: 18 }}>What to expect</b>
            <div className="keys" style={{ marginTop: 8 }}>
              <div><i>8</i>Questions across Number, Algebra, Geometry and Data</div>
              <div><i>5</i>Minutes, roughly. Pause any time.</div>
              <div><i>0</i>Marks. This only shapes your plan.</div>
              <div><i>?</i>&quot;I don&apos;t know this yet&quot; is always an option</div>
            </div>
          </div>
        </div>
      </div>
      <p className="small m-only" style={{ textAlign: "center", marginTop: "auto" }}>Predicted {examName(exam)} Maths grade: <b>after this check</b></p>
      <div className="cta" style={{ marginTop: 0 }}>
        <CtaLink href="/check-in/questions" ready={!!mood}>Start the 8 questions</CtaLink>
      </div>
    </div>
  );
}
