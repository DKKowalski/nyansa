"use client";
import { useEffect, useRef, useState } from "react";
import { TutorFace } from "@/components/brand";
import { I } from "@/components/icons";
import { useToast } from "@/components/toast";
import { HELP, PQ } from "@/lib/content";
import { correctCount, gradeOf, useApp } from "@/lib/store";

type Help = "hint" | "step" | "full";
const ASK: Record<Help, string> = { hint: "Give me a hint", step: "What's the next step?", full: "Show me the full solution" };
/** Conversation starters for an empty chat (scripted replies until the Claude API is connected). */
const SUGGEST: [string, string][] = [
  ["Explain linear equations simply", "Think of an equation as a balance: both sides weigh the same. To find x, do the same thing to both sides until x is alone. Want to try one?"],
  ["Help me with a past question", "Sure. Open Past questions in Practice and tap \"Ask the tutor\" on any one, or paste the question here."],
  ["Quiz me on fractions", "Here's one: what is ¾ + ⅔? Give your answer as a mixed number."],
];

/** T1 AI tutor: hint-first help. Replies are scripted until the Claude API is connected. */
export default function Tutor() {
  const { chat, tq, answers, startChat, pushChat } = useApp();
  const toast = useToast();
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const ask = (me: string, ai: string) => {
    if (typing) return;
    pushChat({ me });
    setTyping(true);
    timer.current = setTimeout(() => { pushChat({ ai }); setTyping(false); }, 650 + Math.min(900, ai.length * 6));
  };
  const end = useRef<HTMLDivElement>(null);
  // After a reload the chat is gone but the question it was about is saved: pick up where it left off.
  useEffect(() => { if (!chat) startChat(useApp.getState().tq); }, [chat, startChat]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [chat, typing]);

  const q = tq >= 0 ? PQ[tq] : null;
  const help = (h: Help) => ask(ASK[h], HELP[tq][h]);
  const send = () => {
    const v = msg.trim(); if (!v) return;
    setMsg("");
    ask(v, /^\s*x?\s*=?\s*4\s*$/.test(v) ? "Yes! 6 × 4 − 4 = 20. Nicely done." : "Good question. Once the tutor is connected I answer from the syllabus and your past mistakes. For now, try the Hint, Next step or Test me buttons.");
  };
  const fresh = (chat?.length ?? 0) <= 1 && !typing;

  return (
    <div className="scr tutorpage">
      <div className="w-only pagehead">
        <p className="hello">{q ? "Maths · Linear equations" : "Any subject · hints first"}</p>
        <h1 className="h-xl">Ask the tutor</h1>
      </div>
      <div className="cols">
        <section className="col chatcard" aria-label="Chat with the tutor">
          <header className="chathead">
            <TutorFace />
            <div className="grow"><b>Nyansa tutor</b><span>{typing ? "Typing…" : "Hints first, you do the thinking"}</span></div>
            <span className="lvl">{q ? "Linear equations" : "Any subject"}</span>
          </header>
          <div className="chatlog" aria-live="polite">
            <div className="today">Today</div>
            <div className="chat">
              {(chat ?? []).map((m, i) => "me" in m
                ? <div key={i} className="msg me">{m.me}</div>
                : <div key={i} className="msg ai"><TutorFace /><p>{m.ai}</p></div>)}
              {typing && <div className="msg ai" aria-label="Tutor is typing"><TutorFace /><span className="typing"><i /><i /><i /></span></div>}
            </div>
            {fresh && !q && (
              <div className="suggest">
                <span className="small">Try asking</span>
                {SUGGEST.map(([me, ai]) => (
                  <button key={me} type="button" onClick={() => ask(me, ai)}><span>{me}</span><I.arrow width={18} height={18} /></button>
                ))}
              </div>
            )}
            <div ref={end} />
          </div>
          <div className="chatfoot">
            <div className="helps">
              {q && (<>
                <button type="button" className="bg-butter" onClick={() => help("hint")}>Hint</button>
                <button type="button" className="bg-sage" onClick={() => help("step")}>Next step</button>
                <button type="button" className="bg-lilac" onClick={() => help("full")}>Full solution</button>
              </>)}
              <button type="button" className="bg-white" style={{ boxShadow: "inset 0 0 0 1.5px var(--hair)" }} onClick={() => ask("Test me", "Try this one: solve 6x − 4 = 20. Type your answer below.")}>Test me</button>
            </div>
            <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <button type="button" className="cbtn" style={{ background: "var(--ground)" }} aria-label="Snap a question" onClick={() => toast("Photo questions come later")}><I.camera /></button>
              <input placeholder="Ask anything…" aria-label="Message" value={msg} onChange={(e) => setMsg(e.target.value)} enterKeyHint="send" />
              <button type="submit" className="mic" aria-label="Send" disabled={!msg.trim()}><I.arrow /></button>
            </form>
          </div>
        </section>
        <aside className="col w-only tutorside">
          {q && (
            <div className="gcard">
              <span className="small">Question you&apos;re working on</span>
              <div style={{ fontSize: 24, fontWeight: 400, margin: "6px 0" }}>{q.q}</div>
              <span className={`lvl ${q.lv === "Advanced" ? "adv" : ""}`} style={{ justifySelf: "start" }}>{q.lv}</span>
            </div>
          )}
          <div className="pcard bg-sage" style={{ cursor: "default" }}><span className="k">How the tutor helps</span><span className="n" style={{ fontSize: 17, fontWeight: 400 }}>Hints first, so you do the thinking. Ask for the next step or the full solution when you need it.</span></div>
          <div className="gcard"><span className="small">Predicted BECE Maths grade</span><div className="big"><b style={{ fontSize: 64 }}>{gradeOf(correctCount(answers) || 5)}</b><span>1 is best</span></div></div>
        </aside>
      </div>
    </div>
  );
}
