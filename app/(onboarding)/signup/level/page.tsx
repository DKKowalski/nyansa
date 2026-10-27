"use client";
import { Deco, I } from "@/components/icons";
import { SetupTop, useNextStep } from "@/components/shells";
import { LEVELS, levelDefaults } from "@/lib/account";
import { useApp } from "@/lib/store";

/** A3 Student sign-up: level of school. It decides the exam (JHS → BECE, SHS → WASSCE) and the class list. */
export default function Level() {
  const { level, set } = useApp();
  const next = useNextStep();
  return (
    <div className="scr">
      <SetupTop />
      <p className="hello">Create your account</p>
      <h1 className="h-xl">What level are you at?</h1>
      <p className="lead">So your lessons match where you are in school. You can change it later.</p>
      <div className="grid2 levelgrid">
        {LEVELS.map(({ v, bg, n, k, tag }) => (
          <button key={v} type="button" className={`pcard ${bg}`} aria-pressed={level === v}
            onClick={() => { set({ level: v, role: "student", date: "", ...(level === v ? {} : levelDefaults(v)) }); next(); }}>
            <Deco />
            <span className="tag">{tag}</span>
            <span className="ico"><I.cap /></span>
            <span className="n">{n}</span>
            <span className="k">{k}</span>
            <span className="go">{level === v ? <I.check /> : <I.arrow />}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
