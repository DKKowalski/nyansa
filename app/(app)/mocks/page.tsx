"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { CORE, MQ } from "@/lib/content";
import { daysLeft, examName, useApp } from "@/lib/store";

const TIME: Record<string, string> = { "Mathematics": "2 h 30 min", "English Language": "2 h", "Integrated Science": "2 h 30 min", "Social Studies": "2 h" };

/** M1 Mock exams: this week's mock plus other subjects, and what to expect. */
export default function Mocks() {
  const s = useApp();
  const toast = useToast();
  const router = useRouter();
  // An exam is in progress until it is submitted (mockEndsAt cleared) or its time runs out.
  // Hides "Continue" during the tap that starts a fresh exam. Next keeps this route mounted while hidden
  // (React Activity), so clear the flag when it hides, or coming back would offer "Start exam" again.
  const [starting, setStarting] = useState(false);
  useLayoutEffect(() => () => setStarting(false), []);
  const inProgress = !starting && !!s.mockEndsAt && s.now !== null && s.mockEndsAt > s.now;
  const answered = Object.keys(s.mans).length;
  return (
    <div className="scr">
      <div className="top"><BackLink href="/practice" /><div className="grow" /></div>
      <p className="hello">{examName(s.exam)} · {daysLeft(s)} days to go</p>
      <h1 className="h-xl">Mock exams</h1>
      <div className="cols">
        <div className="col">
          <div className="hero">
            <span className="live">NEW · THIS WEEK</span><h3>BECE Maths Mock 1</h3>
            <div className="meta"><span><I.book />100 marks</span><span><I.clock />2 h 30 min</span></div>
            <p style={{ margin: 0, color: "#BFD9CB", fontWeight: 300, position: "relative", zIndex: 1 }}>Paper 1: 40 objective questions. Paper 2: theory, marked by AI. This sample has 12 objective questions.</p>
            {inProgress ? (<>
              <button type="button" onClick={() => router.push("/mocks/exam")}>Continue exam · {answered} of {MQ.length} answered</button>
              <button type="button" className="restart" onClick={() => { setStarting(true); s.startMock(); router.push("/mocks/exam"); }}>Start a new attempt</button>
            </>) : (
              <button type="button" onClick={() => { setStarting(true); s.startMock(); router.push("/mocks/exam"); }}>Start exam</button>
            )}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {CORE.filter((c) => c.name !== "Mathematics").map(({ name, abbr, bg }) => (
              <button key={name} type="button" className={`prow ${bg}`} onClick={() => toast("The sample uses the Maths mock")}>
                <span className="ico">{abbr}</span><span className="tx"><b>{name}</b><span>100 marks · {TIME[name]}</span></span><span className="end"><I.arrow /></span>
              </button>
            ))}
          </div>
        </div>
        <div className="col">
          <div className="gcard">
            <b style={{ fontWeight: 500, fontSize: 18 }}>Before you start</b>
            <div className="keys" style={{ marginTop: 8 }}>
              <div><i>1</i>Find a quiet place and a pen and paper.</div>
              <div><i>2</i>The timer keeps running if you leave the page.</div>
              <div><i>3</i>Flag questions to come back to them.</div>
              <div><i>4</i>Your weak topics go into your plan afterwards.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
