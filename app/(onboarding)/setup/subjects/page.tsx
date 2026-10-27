"use client";
import { I } from "@/components/icons";
import { SetupTop, useNextStep } from "@/components/shells";
import { StatRow } from "@/components/viz";
import { CORE } from "@/lib/content";
import { subjectsOf, useApp } from "@/lib/store";

/** A4 Subjects: all 4 core subjects on by default; electives come later. */
export default function Subjects() {
  const next = useNextStep();
  const { subjects, toggleSubject } = useApp();
  const sel = subjectsOf(subjects);
  const tot = CORE.filter((c) => sel.includes(c.name)).reduce((t, c) => t + c.topics, 0);
  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <h1 className="h-xl">Your custom syllabus</h1>
          <p className="lead">The 4 core subjects. Electives come later.</p>
          <div className="grid2">
            {CORE.map(({ name, abbr, bg }) => {
              const on = sel.includes(name);
              return (
                <button key={name} type="button" className={`prow ${bg}`} aria-pressed={on} onClick={() => toggleSubject(name)}>
                  <span className="ico">{abbr}</span>
                  <span className="tx"><b>{name}</b><span>{on ? "In your plan" : "Tap to add back"}</span></span>
                  <span className="end">{on ? <I.check /> : "+"}</span>
                </button>
              );
            })}
          </div>
          <p className="small">All 4 core subjects are on. Tap one to remove it. Electives come later.</p>
        </div>
        <div className="col w-only">
          <div className="gcard">
            <span className="small">Your syllabus at a glance</span>
            <div className="big" style={{ margin: "4px 0 6px" }}><b style={{ fontSize: 72 }}>{tot}</b><span>topics across<br />{sel.length} subject{sel.length === 1 ? "" : "s"}</span></div>
            {CORE.map(({ name, abbr, bg, topics }) => (
              <StatRow key={name} icon={abbr} iconBg={bg} label={name} value={`${topics} topics`} pct={sel.includes(name) ? (topics / 46) * 100 : 0} style={sel.includes(name) ? undefined : { opacity: 0.35 }} />
            ))}
            <span className="small" style={{ marginTop: 8 }}>About {Math.round(tot * 0.75)} hours of lessons and practice in total.</span>
          </div>
        </div>
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={!sel.length} onClick={() => next()}>Continue</button>
      </div>
    </div>
  );
}
