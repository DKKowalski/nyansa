"use client";
import Link from "next/link";
import { useState } from "react";
import { I } from "@/components/icons";
import { PhoneTop } from "@/components/shells";
import { Gauge, StrandRow, Trend } from "@/components/viz";
import { Num, Segmented } from "@/components/motion";
import { PQ } from "@/lib/content";
import { examName, firstName, useApp } from "@/lib/store";

const WEEK: [string, number][] = [["Mon", 20], ["Tue", 35], ["Wed", 0], ["Thu", 30], ["Fri", 45], ["Sat", 25], ["Sun", 10]];
const ACTIVITY = [
  { bg: "bg-lilac", icon: <I.practice />, b: "Practice: Set 2", t: "Linear equations · today", sc: "set2" },
  { bg: "bg-sage", icon: <I.book />, b: "Lesson finished", t: "Linear equations · today", sc: "5 cards" },
  { bg: "bg-butter", icon: <I.clock />, b: "Maths Mock 1", t: "Yesterday", sc: "Grade 4" },
  { bg: "bg-clay", icon: <I.check />, b: "Diagnostic: Maths", t: "Monday", sc: "5/8" },
];

/** R1 Progress: predicted grade trend, study time, mastery, strengths and weaknesses, recent activity. */
export default function Progress() {
  const { name, exam, pans, psetDone } = useApp();
  // The set the student just did, if any; otherwise the sample history.
  const set2 = psetDone ? `${PQ.filter((q, i) => pans[i] === q.a).length}/${PQ.length}` : "4/5";
  const [range, setRange] = useState(0);
  return (
    <div className="scr">
      <PhoneTop><Link className="cbtn" href="/settings" aria-label="Settings"><I.settings /></Link></PhoneTop>
      <p className="hello">{firstName(name)} · {examName(exam)}</p>
      <h1 className="h-xl">Your progress</h1>
      <Segmented label="Range" style={{ maxWidth: 420 }} value={range} onChange={setRange}
        options={["Week", "Month", "All time"].map((x, i) => ({ value: i, label: x }))} />
      <div className="cols">
        <div className="col">
          <div className="gcard">
            <div className="hd"><div><b>Predicted Maths grade</b><span>Diagnostic → now · 1 is best</span></div><span className="lvl" style={{ background: "var(--sage)", borderColor: "transparent" }}>↑ 2 grades</span></div>
            <Trend />
          </div>
          <div className="gcard">
            <div className="hd"><div><b>Study time</b><span>2 h 45 min this week · goal 3 h 30 min</span></div></div>
            <div className="wbars grow" style={{ marginTop: 12 }}>
              {WEEK.map(([d, m], i) => <div key={d} className={i === 6 ? "today" : ""}><span className="pillbar"><i style={{ height: `${(m / 45) * 100}%` }} /></span>{d}</div>)}
            </div>
          </div>
          <div className="gcard grow" style={{ padding: "10px 20px" }}>
            <b style={{ fontWeight: 500, fontSize: 18, marginTop: 8 }}>Strengths and weaknesses</b>
            {([["Number", 0.83], ["Algebra", 0.42], ["Geometry", 0.1], ["Data", 0]] as const).map(([t, v]) => <StrandRow key={t} name={t} value={`${Math.round(v * 100)}%`} pct={Math.max(3, v * 100)} />)}
          </div>
        </div>
        <div className="col">
          <div className="duo">
            <div className="stat bg-sage"><div className="tp"><span className="ico"><I.check /></span>Mastered</div><div className="v"><b>4</b><span>of 42 topics</span></div><span className="ar"><I.up /></span></div>
            <div className="stat bg-butter"><div className="tp"><span className="ico"><I.flame width={18} height={18} /></span>Streak</div><div className="v"><b>5</b><span>days</span></div><span className="ar"><I.up /></span></div>
          </div>
          <div className="gcard"><div className="hd"><div><b>Syllabus covered</b><span>All 4 core subjects</span></div></div><Gauge pct={24} msg="A good start. Keep going!" sweep><Num value={24} from={0} suffix="%" /></Gauge></div>
          <div className="gcard" style={{ padding: "6px 20px" }}>
            <b style={{ fontWeight: 500, fontSize: 18, marginTop: 12 }}>Recent activity</b>
            {ACTIVITY.map((a) => <div key={a.b} className="act"><span className={`ic ${a.bg}`}>{a.icon}</span><span className="tx"><b>{a.b}</b><span>{a.t}</span></span><span className="sc">{a.sc === "set2" ? set2 : a.sc}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
