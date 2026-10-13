"use client";
import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { useToast } from "@/components/toast";
import { Sheet } from "@/components/ui";
import { Ticks } from "@/components/viz";
import { haptic } from "@/components/motion";
import { MQ } from "@/lib/content";
import { MOCK_SECONDS, useApp } from "@/lib/store";

const fmt = (sec: number) => {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return `${h ? `${h}:${String(m).padStart(2, "0")}` : m}:${String(s).padStart(2, "0")}`;
};

function Legend() {
  return (
    <div className="legend">
      <span><i style={{ background: "var(--sage)" }} />Answered</span>
      <span><i style={{ background: "var(--butter)" }} />Flagged</span>
      <span><i style={{ background: "var(--white)", boxShadow: "inset 0 0 0 1px #ccc" }} />Not yet</span>
    </div>
  );
}

/** M2 Mock exam: hideable timer, flag for review, question grid, answers autosaved on the device. */
export default function MockExam() {
  const router = useRouter();
  const toast = useToast();
  const { mans, mflag, mockEndsAt, set, startMock } = useApp();
  const [mi, setMiRaw] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const setMi = (i: number) => { setDir(i < mi ? "prev" : "next"); setMiRaw(i); };
  const [hide, setHide] = useState(false);
  const [grid, setGrid] = useState(false);
  const [tick, setTick] = useState<number | null>(null);
  const clock = useApp((s) => s.now);

  // Opened directly (not from M1): start a fresh paper. Mount-only, so submitting never restarts it.
  useEffect(() => { if (!useApp.getState().mockEndsAt) startMock(); }, [startMock]);
  const t = tick ?? clock;
  const left = mockEndsAt && t ? Math.max(0, Math.round((mockEndsAt - t) / 1000)) : MOCK_SECONDS;

  const submit = () => { setGrid(false); set({ mockEndsAt: null }); router.push("/mocks/results"); };
  const timeUp = useEffectEvent(() => { toast("Time is up. Your paper was submitted."); submit(); });
  useEffect(() => {
    const t = setInterval(() => {
      const end = useApp.getState().mockEndsAt;
      setTick(Date.now());
      if (end && Date.now() >= end) timeUp();
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const n = MQ.length, q = MQ[mi], a = mans[mi], flagged = mflag.includes(mi);
  const go = (i: number) => { setMi(i); setGrid(false); };
  const qGrid = (
    <div className="qgrid">
      {MQ.map((_, i) => (
        <button key={i} type="button" className={i === mi ? "c" : mflag.includes(i) ? "f" : mans[i] !== undefined ? "a" : ""} aria-label={`Question ${i + 1}`} aria-current={i === mi || undefined} onClick={() => go(i)}>{i + 1}</button>
      ))}
    </div>
  );

  return (
    <div className="scr">
      <div className="mbar">
        <button type="button" className="cbtn" aria-label="Leave the exam" onClick={() => { toast("Your answers are saved. The timer keeps running."); router.push("/mocks"); }}><I.close /></button>
        <div className="grow" style={{ flex: 1 }}><b style={{ fontWeight: 500 }}>Maths Mock 1</b><br /><span className="small">Paper 1 · {Object.keys(mans).length} of {n} answered</span></div>
        <button type="button" className="timer" data-low={mockEndsAt && left < 300 ? "" : undefined} aria-label={hide ? "Show timer" : "Hide timer"} onClick={() => setHide(!hide)}><I.clock /><span>{hide ? "Hidden" : fmt(left)}</span></button>
      </div>
      <Ticks n={n * 3} on={mi * 3} now={mi * 3} label={`Question ${mi + 1} of ${n}`} />
      <div className="cols">
        <div className={`col in-${dir}`} key={mi}>
          <div className="q"><span className="k"><span className="pill">Question {mi + 1}</span>{q.strand ?? "Algebra"}</span><div className="t">{q.q}</div></div>
          <div className="ans">
            {q.opts.map((o, i) => <button key={i} type="button" aria-pressed={a === i} onClick={() => set({ mans: { ...mans, [mi]: i } })}><span className="l">{"ABCD"[i]}</span>{o}</button>)}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button type="button" className="mflag" aria-pressed={flagged} onClick={() => { haptic("tap"); set({ mflag: flagged ? mflag.filter((x) => x !== mi) : [...mflag, mi] }); }}>▲ {flagged ? "Flagged" : "Flag for review"}</button>
            <div style={{ flex: 1 }} />
            <button type="button" className="mflag m-only" onClick={() => setGrid(true)}>All questions</button>
          </div>
          <div className="cta" style={{ gridTemplateColumns: "1fr 1.6fr" }}>
            <button type="button" className="btn light" disabled={mi === 0} onClick={() => setMi(mi - 1)}>Previous</button>
            {mi === n - 1
              ? <button type="button" className="btn" onClick={submit}>Finish and submit</button>
              : <button type="button" className="btn" onClick={() => setMi(mi + 1)}>Next</button>}
          </div>
        </div>
        <div className="col w-only">
          <div className="gcard"><b style={{ fontWeight: 500 }}>Questions</b><div style={{ marginTop: 10 }}>{qGrid}</div><div style={{ marginTop: 12 }}><Legend /></div></div>
          <button type="button" className="btn green" onClick={submit}>Submit exam</button>
        </div>
      </div>
      <Sheet open={grid} onOpenChange={setGrid} title="All questions">
        {qGrid}<Legend />
        <button type="button" className="btn" onClick={submit}>Submit exam</button>
      </Sheet>
    </div>
  );
}
