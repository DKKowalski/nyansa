"use client";
import { useState } from "react";
import { I } from "@/components/icons";
import { Avatar } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Gauge, StatRow } from "@/components/viz";
import Link from "next/link";
import { CORE } from "@/lib/content";
import { useApp } from "@/lib/store";
import { BusyButton, Num } from "@/components/motion";

const ENC = ["Well done, Ama!", "Keep going!", "I'm proud of you", "Remember your study time today"];
const GRADES = ["Grade 5", "Grade 4", "Not started", "Not started"], PCTS = [45, 55, 0, 0];

/** G2 Parent dashboard: a plain-words weekly summary and one action, send encouragement. */
export default function ParentHome() {
  const toast = useToast();
  const [enc, setEnc] = useState<string | null>(null);
  const kids = useApp((s) => s.kids);
  return (
    <div className="scr">
      <div className="top m-only"><Avatar parent /><div className="grow" /><button type="button" className="cbtn" aria-label="Notifications" onClick={() => toast("No new messages")}><I.bell /></button></div>
      <p className="hello">Weekly report · 6–12 Oct</p>
      <h1 className="h-xl">Ama&apos;s week</h1>
      <div className="cols">
        <div className="col">
          <div className="hero"><span className="live">IN PLAIN WORDS</span><h3 style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.35 }}>Ama studied 2 hours 45 minutes this week. Her Maths moved up from grade 5 to grade 4. She needs more work on English comprehension.</h3></div>
          <div className="duo">
            <div className="stat bg-sage"><div className="tp">Days active</div><div className="v"><b>5</b><span>of 7</span></div></div>
            <div className="stat bg-butter"><div className="tp">Maths grade</div><div className="v"><b>4</b><span>was 5</span></div></div>
          </div>
          {kids.length > 0 && (
            <div className="gcard" style={{ padding: "12px 20px" }}>
              <div className="hd" style={{ margin: "4px 0" }}><b>Your children</b><Link className="linkbtn" href="/signup/parent/child">+ Add a child</Link></div>
              {kids.map((k) => (
                <div key={k.user} className="kidcard">
                  <span className="av2">{k.av}</span>
                  <span className="tx"><b>{k.name} · {k.cls}</b><span>Username: {k.user}</span></span>
                  <button type="button" className="btn light" style={{ width: "auto", padding: "9px 12px", fontSize: 14 }} onClick={() => toast(`A new password for ${k.name} was sent to your phone`)}>Reset password</button>
                </div>
              ))}
            </div>
          )}
          <div className="gcard">
            <b style={{ fontWeight: 500, fontSize: 18 }}>Send Ama some encouragement</b>
            <div className="enc" style={{ marginTop: 10 }}>{ENC.map((m) => <button key={m} type="button" aria-pressed={enc === m} onClick={() => setEnc(m)}>{m}</button>)}</div>
            <div style={{ marginTop: 12, display: "grid" }}>
              <BusyButton busyLabel="Sending…" doneLabel="Sent to Ama" disabled={!enc} onDone={() => { toast("Ama will see it on her Home screen."); setEnc(null); }}>Send</BusyButton>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="gcard"><div className="hd"><div><b>Weekly study goal</b><span>2 h 45 min of 3 h 30 min</span></div></div><Gauge pct={79} msg="Close to her goal this week" sweep><Num value={79} from={0} suffix="%" /></Gauge></div>
          <div className="gcard" style={{ padding: "10px 20px" }}>
            <b style={{ fontWeight: 500, fontSize: 18, marginTop: 8 }}>Subjects</b>
            {CORE.map((c, i) => <StatRow key={c.name} icon={c.abbr} iconBg={c.bg} label={c.name} value={GRADES[i]} pct={PCTS[i]} />)}
          </div>
          <div className="pcard bg-clay" style={{ cursor: "default" }}><span className="k">Alert</span><span className="n" style={{ fontSize: 17, fontWeight: 400 }}>We&apos;ll text you if Ama doesn&apos;t study for 3 days in a row.</span></div>
        </div>
      </div>
    </div>
  );
}
