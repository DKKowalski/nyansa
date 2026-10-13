"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/shells";
import { Ticks } from "@/components/viz";
import { haptic } from "@/components/motion";

const STEPS: [string, string][] = [["Subtract 3 from both sides", "2x = 8"], ["Divide both sides by 2", "x = 4"], ["Check: put 4 back in", "2 × 4 + 3 = 11 ✓"]];
const CHECK = ["x = 5", "x = 15", "x = 3", "x = 25"];

/** L4 Lesson: short cards, one idea each; worked example revealed a step at a time; a quick check inside. */
export default function Lesson() {
  const router = useRouter();
  const [st, setSt] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [reveal, setReveal] = useState(0);
  const [pick, setPick] = useState<number | null>(null);

  const cards: { kind: string; title: string; body: React.ReactNode; gate?: boolean }[] = [
    {
      kind: "The idea", title: "An equation is a balance",
      body: (<>
        <p>Both sides of an equation weigh the same. Find the number that keeps it balanced.</p>
        <svg viewBox="0 0 320 150" style={{ width: "100%", maxWidth: 420, justifySelf: "center" }} aria-hidden="true">
          <path d="M160 30v100M110 140h100" stroke="#141816" strokeWidth="4" strokeLinecap="round" />
          <path d="M40 52h240" stroke="#141816" strokeWidth="4" strokeLinecap="round" />
          <circle cx="160" cy="30" r="9" fill="#F2B33D" />
          <path d="M40 52l-22 46h44zM280 52l-22 46h44z" fill="none" stroke="#8A8F8B" strokeWidth="2" />
          <rect x="2" y="98" width="76" height="34" rx="12" fill="#E1DAF0" /><text x="40" y="121" textAnchor="middle" fontSize="18">x + 3</text>
          <rect x="242" y="98" width="76" height="34" rx="12" fill="#D6E6DC" /><text x="280" y="121" textAnchor="middle" fontSize="18">11</text>
        </svg>
        <div className="eq">x + 3 = 11 &nbsp;→&nbsp; x = 8</div>
        <p>Whatever you do to one side, <b>do the same to the other</b>, and it stays balanced.</p>
      </>),
    },
    {
      kind: "Ghanaian example", title: "Kofi's exercise books",
      body: (<>
        <p>Kofi buys <b>2 exercise books</b> and <b>1 pen</b>. He pays GH₵11. The pen costs GH₵3. How much is one exercise book?</p>
        <div className="receipt"><div className="ln"><span>2 exercise books</span><span>2 × x</span></div><div className="ln"><span>1 pen</span><span>GH₵3</span></div><div className="ln"><span>Total</span><span>GH₵11</span></div></div>
        <p>Let one book cost <b>x</b>. Then:</p><div className="eq">2x + 3 = 11</div>
      </>),
    },
    {
      kind: "Worked example", title: "Solve 2x + 3 = 11", gate: reveal >= 3,
      body: (<>
        <div className="steps">
          {STEPS.map(([a, b], i) => i < reveal
            ? <div key={`s${i}`} className="step revealed"><span className="n">{i + 1}</span><span className="tx"><b>{a}</b><span>{b}</span></span></div>
            : <div key={`h${i}`} className="step hidden"><span className="n">{i + 1}</span><span className="tx"><b>Step {i + 1}</b></span></div>)}
        </div>
        {reveal < 3
          ? <button type="button" className="btn light" onClick={() => setReveal(reveal + 1)}>Show next step</button>
          : <div className="note2 bg-sage">One exercise book costs <b>GH₵4</b>.</div>}
      </>),
    },
    {
      kind: "Quick check", title: "Solve 3x − 5 = 10", gate: pick !== null,
      body: (<>
        <div className="achips">
          {CHECK.map((o, i) => <button key={i} type="button" className={`achip ${pick === null ? "" : i === 0 ? "ok" : i === pick ? "no" : ""}`} disabled={pick !== null} onClick={() => { if (i === 0) haptic("success"); setPick(i); }}>{o}</button>)}
        </div>
        {pick !== null && (pick === 0
          ? <div className="note2 bg-sage" role="status"><b>Correct.</b> Add 5 to both sides: 3x = 15. Divide by 3: x = 5.</div>
          : <div className="note2 bg-clay" role="status"><b>Not quite.</b> First add 5 to both sides: 3x = 15. Then divide by 3: x = 5.</div>)}
      </>),
    },
    {
      kind: "Key points", title: "Remember",
      body: (
        <div className="keys">
          <div><i>1</i>An equation is a balance: both sides are equal.</div>
          <div><i>2</i>Do the same thing to both sides to keep it balanced.</div>
          <div><i>3</i>Undo + and − first, then × and ÷.</div>
          <div><i>4</i>Always check by putting your answer back in.</div>
        </div>
      ),
    },
  ];
  const n = cards.length, L = cards[st];
  return (
    <div className="scr">
      <div className="top">
        <BackLink href="/learn/mathematics/linear-equations" label="Close" />
        <Ticks n={n * 5} on={st * 5 + 5} label={`Card ${st + 1} of ${n}`} />
        <span className="small" style={{ fontWeight: 500, color: "var(--ink)" }}>{st + 1}/{n}</span>
      </div>
      <div className={`lcard in-${dir}`} key={st}>
        <span className="kick"><span className="pill">Linear equations</span>{L.kind}</span>
        <h1>{L.title}</h1>
        {L.body}
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={L.gate === false} onClick={() => { if (st < n - 1) { setDir("next"); setSt(st + 1); } else router.push("/practice/sets"); }}>
          {st === n - 1 ? "Practise now" : "Continue"}
        </button>
        {st > 0 && <button type="button" className="btn text" onClick={() => { setDir("prev"); setSt(st - 1); }}>Back</button>}
      </div>
    </div>
  );
}
