"use client";
import { useEffect, useRef, useState } from "react";
import { TutorFace } from "@/components/brand";
import { I } from "@/components/icons";
import { useToast } from "@/components/toast";
import { HELP, PQ } from "@/lib/content";
import { correctCount, gradeOf, useApp } from "@/lib/store";

type Help = "hint" | "step" | "full";
const ASK: Record<Help, string> = { hint: "Give me a hint", step: "What's the next step?", full: "Show me the full solution" };

/** T1 AI tutor: hint-first help. Replies are scripted until the Claude API is connected. */
export default function Tutor() {
  const { chat, tq, answers, startChat, pushChat } = useApp();
  const toast = useToast();
  const [msg, setMsg] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!chat) startChat(-1); }, [chat, startChat]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [chat]);

  const q = tq >= 0 ? PQ[tq] : null;
  const help = (h: Help) => pushChat({ me: ASK[h] }, { ai: HELP[tq][h] });
  const send = () => {
    const v = msg.trim(); if (!v) return;
    setMsg("");
    pushChat({ me: v }, { ai: /^\s*x?\s*=?\s*4\s*$/.test(v) ? "Yes! 6 × 4 − 4 = 20. Nicely done." : "Good question. Once the tutor is connected I answer from the syllabus and your past mistakes. For now, try the Hint, Next step or Test me buttons." });
  };

  return (
    <div className="scr" style={{ background: "var(--white)" }}>
      <div className="top m-only">
        <span className="msg ai"><TutorFace /></span><b style={{ fontWeight: 500, fontSize: 19 }}>Tutor</b><div className="grow" />
        <span className="lvl">{q ? "Maths · Linear equations" : "Any subject"}</span>
      </div>
      <div className="cols">
        <div className="col" style={{ gap: 16 }}>
          <div className="today">Today</div>
          <div className="chat" aria-live="polite">
            {(chat ?? []).map((m, i) => "me" in m
              ? <div key={i} className="msg me">{m.me}</div>
              : <div key={i} className="msg ai"><TutorFace /><p>{m.ai}</p></div>)}
            <div ref={end} />
          </div>
          <div className="helps">
            {q && (<>
              <button type="button" className="bg-butter" onClick={() => help("hint")}>Hint</button>
              <button type="button" className="bg-sage" onClick={() => help("step")}>Next step</button>
              <button type="button" className="bg-lilac" onClick={() => help("full")}>Full solution</button>
            </>)}
            <button type="button" className="bg-white" style={{ boxShadow: "inset 0 0 0 1.5px var(--hair)" }} onClick={() => pushChat({ me: "Test me" }, { ai: "Try this one: solve 6x − 4 = 20. Type your answer below." })}>Test me</button>
          </div>
          <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <button type="button" className="cbtn" style={{ background: "var(--ground)" }} aria-label="Snap a question" onClick={() => toast("Photo questions come later")}><I.camera /></button>
            <input placeholder="Ask anything…" aria-label="Message" value={msg} onChange={(e) => setMsg(e.target.value)} enterKeyHint="send" />
            <button type="submit" className="mic" aria-label="Send"><I.arrow /></button>
          </form>
        </div>
        <div className="col w-only">
          {q && (
            <div className="gcard">
              <span className="small">Question you&apos;re working on</span>
              <div style={{ fontSize: 24, fontWeight: 400, margin: "6px 0" }}>{q.q}</div>
              <span className={`lvl ${q.lv === "Advanced" ? "adv" : ""}`} style={{ justifySelf: "start" }}>{q.lv}</span>
            </div>
          )}
          <div className="pcard bg-sage" style={{ cursor: "default" }}><span className="k">How the tutor helps</span><span className="n" style={{ fontSize: 17, fontWeight: 400 }}>Hints first, so you do the thinking. Ask for the next step or the full solution when you need it.</span></div>
          <div className="gcard"><span className="small">Predicted BECE Maths grade</span><div className="big"><b style={{ fontSize: 64 }}>{gradeOf(correctCount(answers) || 5)}</b><span>1 is best</span></div></div>
        </div>
      </div>
    </div>
  );
}
