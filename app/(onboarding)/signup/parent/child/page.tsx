"use client";
import { CORE } from "@/lib/content";
import { Art } from "@/components/art";
import { SetupTop, useNextStep } from "@/components/shells";
import { useToast } from "@/components/toast";
import { useDraft } from "../draft";

/** G1 Parent adds a child: first name, exam and class. A login is made for them on the next screen. */
export default function AddChild() {
  const [k, put] = useDraft();
  const toast = useToast();
  const next = useNextStep();
  const lv = k.exam === "WASSCE" ? "SHS" : "JHS";
  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <h1 className="h-xl">Add a child</h1>
          <input className="input" aria-label="Child's first name" placeholder="Child's first name, e.g. Ama" value={k.name} onChange={(e) => put({ name: e.target.value })} />
          <div className="sec"><h3>Exam</h3></div>
          <div className="chips" style={{ flexWrap: "wrap" }}>
            {(["BECE", "WASSCE"] as const).map((x) => <button key={x} type="button" className="chip" aria-pressed={k.exam === x} onClick={() => put({ exam: x, cls: "" })}>{x}</button>)}
          </div>
          <div className="sec"><h3>Class</h3></div>
          <div className="chips" style={{ flexWrap: "wrap" }}>
            {[`${lv} 1`, `${lv} 2`, `${lv} 3`, "Private candidate"].map((x) => <button key={x} type="button" className="chip" aria-pressed={k.cls === x} onClick={() => put({ cls: x })}>{x}</button>)}
          </div>
          <div className="sec"><h3>Subjects</h3></div>
          <div className="chips" style={{ flexWrap: "wrap" }}>
            {CORE.map(({ name }) => <button key={name} type="button" className="chip" aria-pressed="true" onClick={() => toast("All 4 core subjects are included for now")}>{name}</button>)}
          </div>
        </div>
        <div className="col w-only"><Art kind="family" /></div>
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={!k.name.trim() || !k.cls} onClick={() => next()}>Continue</button>
      </div>
    </div>
  );
}
