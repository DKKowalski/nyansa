"use client";
import { I } from "@/components/icons";
import { CtaLink } from "@/components/ui";
import { SetupTop } from "@/components/shells";
import { examDate, examName, useApp } from "@/lib/store";

const PRIVATE = "Private candidate";

/** A3 Choose class (JHS/SHS year or private candidate). */
export default function Class() {
  const s = useApp();
  const { cls, exam, set } = s;
  const lv = exam === "WASSCE" ? "SHS" : "JHS";
  const exs = new Date(examDate(s) + "T00:00").toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const yearsLeft = cls === PRIVATE ? 0 : cls ? 3 - Number(cls.slice(-1)) : null;
  return (
    <div className="scr">
      <SetupTop step="class" />
      <div className="cols obc">
        <div className="col">
          <p className="hello">{examName(exam)}</p>
          <h1 className="h-xl">Which class are you in?</h1>
          <p className="lead">So we match the syllabus to where you are.</p>
          <div className="chips" style={{ flexWrap: "wrap" }}>
            {[1, 2, 3].map((n) => `${lv} ${n}`).map((c) => (
              <button key={c} type="button" className="chip" style={{ fontSize: 18, padding: "16px 26px" }} aria-pressed={cls === c} onClick={() => set({ cls: c })}>{c}</button>
            ))}
          </div>
          <button type="button" className="prow bg-white" aria-pressed={cls === PRIVATE} onClick={() => set({ cls: PRIVATE })}
            style={{ opacity: 1, boxShadow: cls === PRIVATE ? "inset 0 0 0 2.5px var(--ink)" : undefined }}>
            <span className="ico bg-butter"><I.person /></span>
            <span className="tx"><b>Private candidate</b><span>Re-sitting or studying outside school</span></span>
            <span className="end"><I.arrow /></span>
          </button>
          {cls?.endsWith("3") && (
            <div className="pcard bg-butter m-only" style={{ cursor: "default", padding: "14px 18px" }}>
              <span className="k">You&apos;re writing the {examName(exam)} this year. We&apos;ll focus your plan on exam topics first.</span>
            </div>
          )}
        </div>
        <div className="col w-only">
          <div className="gcard road">
            <b style={{ fontWeight: 500, fontSize: 18 }}>Your road to the {examName(exam)}</b>
            <div className="rstep on"><i><I.check /></i><span><b>Today</b><span>Set up and find your starting point</span></span></div>
            <div className={`rstep ${cls ? "on" : ""}`}><i>2</i><span>
              <b>{cls ? (yearsLeft === 0 ? "Exam-focused plan" : `${yearsLeft === 1 ? "One more year" : `${yearsLeft} more years`} of the syllabus`) : "Pick your class"}</b>
              <span>{cls ? (yearsLeft === 0 ? "Past questions and mocks come first" : "Learn new topics in order, review the old ones") : "We'll shape your plan around it"}</span>
            </span></div>
            <div className="rstep"><i>3</i><span><b>{examName(exam)} · {exs}</b><span>Mocks every week in the last 6 weeks</span></span></div>
          </div>
        </div>
      </div>
      <div className="cta">
        <CtaLink href="/setup/subjects" ready={!!cls}>Continue</CtaLink>
      </div>
    </div>
  );
}
