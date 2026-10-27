"use client";
import { Deco, I } from "@/components/icons";
import { SetupTop, useNextStep } from "@/components/shells";
import type { Exam as ExamT } from "@/lib/content";
import { firstName, useApp } from "@/lib/store";

const EXAMS: { v: ExamT; bg: string; k: string; n: string; facts: string[] }[] = [
  { v: "BECE", bg: "bg-sage", k: "End of JHS", n: "Basic Education Certificate Exam", facts: ["Written in June", "Grades 1 to 9", "Ends JHS"] },
  { v: "WASSCE", bg: "bg-lilac", k: "End of SHS", n: "West African Senior School Certificate", facts: ["Written from May", "Grades A1 to F9", "Ends SHS"] },
];

/** A3 Choose exam. */
export default function Exam() {
  const next = useNextStep();
  const { exam, name, set } = useApp();
  return (
    <div className="scr">
      <SetupTop />
      <p className="hello">Hello, {firstName(name)}</p>
      <h1 className="h-xl">Which exam are you writing?</h1>
      <div className="grid2 examgrid">
        {EXAMS.map(({ v, bg, k, n, facts }) => (
          <button key={v} type="button" className={`pcard ${bg}`} aria-pressed={exam === v} style={{ minHeight: 190 }}
            onClick={() => exam !== v && set({ exam: v, cls: null, date: "" })}>
            <Deco />
            <span className="ico"><I.cap /></span>
            <span className="tag">4 core subjects</span>
            <span className="k">{k}</span>
            <span className="n">{v}<br /><span style={{ fontSize: 16, fontWeight: 300 }}>{n}</span></span>
            <span className="w-only facts">{facts.map((f) => <span key={f}>{f}</span>)}</span>
            <span className="go">{exam === v ? <I.check /> : <I.arrow />}</span>
          </button>
        ))}
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={!exam} onClick={() => next()}>Continue</button>
      </div>
    </div>
  );
}
