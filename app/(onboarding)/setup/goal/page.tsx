"use client";
import { useState } from "react";
import { Segmented } from "@/components/motion";
import { I } from "@/components/icons";
import { SetupTop, useNextStep } from "@/components/shells";
import { daysLeft, examDate, useApp } from "@/lib/store";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEK: [string, number][] = [["M", 1], ["T", 1], ["W", 0.6], ["T", 1], ["F", 1], ["S", 1.4], ["S", 0.4]];
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** A5 Exam date (pre-filled with the expected sitting) and daily goal. */
export default function Goal() {
  const next = useNextStep();
  const s = useApp();
  const date = examDate(s);
  const d0 = new Date(date + "T00:00:00");
  const [[y, m], setYM] = useState<[number, number]>([d0.getFullYear(), d0.getMonth()]);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const shift = (k: number) => { setDir(k > 0 ? "next" : "prev"); setYM(([yy, mm]) => { const t = new Date(yy, mm + k, 1); return [t.getFullYear(), t.getMonth()]; }); };

  const lead = (new Date(y, m, 1).getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate();
  const left = daysLeft(s), hrs = Math.round((left * s.minutes) / 60);
  return (
    <div className="scr">
      <SetupTop />
      <h1 className="h-l">Exam date and daily goal</h1>
      <div className="cols obc">
        <div className="col">
          <div className="cal bg-sage">
            <div className="hd">
              <span className="cbtn sm"><I.cal /></span>
              <span className="m" aria-live="polite">{MONTHS[m]} {y}</span>
              <button type="button" className="cbtn sm ghost" aria-label="Previous month" onClick={() => shift(-1)}><I.chevL /></button>
              <button type="button" className="cbtn sm ghost" aria-label="Next month" onClick={() => shift(1)}><I.chevR /></button>
            </div>
            <div className={`grid in-${dir}`} key={`${y}-${m}`}>
              {["M", "T", "W", "T", "F", "S", "S"].map((x, i) => <span key={i} className="dow">{x}</span>)}
              {Array.from({ length: lead }, (_, i) => <span key={`o${i}`} className="d out">{new Date(y, m, i - lead + 1).getDate()}</span>)}
              {Array.from({ length: dim }, (_, i) => {
                const day = iso(y, m, i + 1);
                const near = Math.abs((Date.parse(day) - d0.getTime()) / 864e5) < 5 && day !== date && date.slice(0, 7) === day.slice(0, 7);
                return (
                  <button key={day} type="button" className={`d ${day === date ? "sel" : near ? "wk" : ""}`} aria-label={`${i + 1} ${MONTHS[m]}`} aria-pressed={day === date} onClick={() => s.set({ date: day })}>{i + 1}</button>
                );
              })}
            </div>
          </div>
          <p className="small">Change it when WAEC publishes the timetable.</p>
        </div>
        <div className="col">
          <div className="sec"><h3>Study time each day</h3></div>
          <Segmented label="Study time each day" value={s.minutes} onChange={(mn) => s.set({ minutes: mn })}
            options={[15, 30, 60, 90].map((mn) => ({ value: mn, label: `${mn} min` }))} />
          <p className="small m-only">That&apos;s about <b>{hrs} hours</b> of study before the exam.</p>
          <div className="gcard w-only" style={{ flexDirection: "column" }}>
            <span className="small">Before your exam you&apos;ll study</span>
            <div className="big"><b>{hrs}</b><span>hours<br />{left} days × {s.minutes} min</span></div>
            <span className="small" style={{ marginTop: 8 }}>A typical week</span>
            <div className="wbars" style={{ height: 120 }}>
              {WEEK.map(([d, f], i) => <div key={i}><span className="pillbar" style={{ height: 90 }}><i style={{ height: `${Math.min(100, ((f * s.minutes) / 90) * 100)}%` }} /></span>{d}</div>)}
            </div>
            <span className="small">Shorter on busy days, longer at weekends. The plan adjusts as you go.</span>
          </div>
        </div>
      </div>
      <div className="cta"><button type="button" className="btn" onClick={() => next()}>Continue</button></div>
    </div>
  );
}
