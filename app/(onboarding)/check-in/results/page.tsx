"use client";
import { I } from "@/components/icons";
import { useToast } from "@/components/toast";
import { CtaLink } from "@/components/ui";
import { Gauge, StrandRow } from "@/components/viz";
import { Num } from "@/components/motion";
import { QUESTIONS, STRANDS, TOPIC } from "@/lib/content";
import { correctCount, examName, gradeOf, strandScores, useApp, weakest } from "@/lib/store";

/** D3 Diagnostic results: readiness, rough grade, strands strong → weak, and what comes first. */
export default function Results() {
  const { answers, exam } = useApp();
  const toast = useToast();
  const sc = strandScores(answers), total = correctCount(answers);
  const pct = Math.round((total / QUESTIONS.length) * 100);
  const first = TOPIC[weakest(sc)[0]];
  return (
    <div className="scr">
      <div className="top">
        <div className="grow"><p className="hello" style={{ margin: 0 }}>Maths starting point</p></div>
        <button type="button" className="cbtn" aria-label="Share" onClick={() => toast("Sharing comes later")}><I.up /></button>
      </div>
      <div className="cols obc">
        <div className="col">
          <div className="gcard">
            <div className="hd"><div><b>Exam readiness</b><span>Based on 8 questions</span></div><span className="cbtn sm" style={{ background: "var(--ground)" }}><I.up /></span></div>
            <Gauge pct={pct} sweep><Num value={pct} from={0} suffix="%" /></Gauge>
          </div>
          <div className="gcard">
            <span className="small" style={{ color: "var(--ink-2)" }}>Predicted {examName(exam)} Maths grade</span>
            <div className="big"><b><Num value={gradeOf(total)} from={9} /></b><span>1 is best · target 1<br />Sharper as you practise</span></div>
          </div>
        </div>
        <div className="col">
          <div className="gcard grow" style={{ padding: "16px 20px" }}>
            <div className="hd" style={{ marginBottom: 4 }}><b>By area</b><span style={{ fontSize: 14.5, color: "var(--ink-2)" }}>Strong → weak</span></div>
            {STRANDS.slice().sort((x, y) => sc[y.name] - sc[x.name]).map(({ name }) => (
              <StrandRow key={name} name={name} value={`${Math.round(sc[name] * 100)}%`} pct={Math.max(4, sc[name] * 100)} />
            ))}
          </div>
          <div className="pcard bg-butter w-only" style={{ cursor: "default" }}>
            <span className="k">Up first in your plan</span>
            <span className="n" style={{ fontSize: 22 }}>{first[0]}</span>
            <span className="small" style={{ color: "var(--ink-2)" }}>{first[1]}</span>
          </div>
        </div>
      </div>
      <div className="cta"><CtaLink href="/home">Build my study plan</CtaLink></div>
    </div>
  );
}
