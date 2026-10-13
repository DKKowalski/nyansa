"use client";
import { useState } from "react";
import Link from "next/link";
import { Deco, I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { PLAN } from "@/lib/content";
import { useApp } from "@/lib/store";

const DN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** PL Study plan: a 7-day strip and a timeline of the day's tasks. */
export default function Plan() {
  const toast = useToast();
  const [sel, setSel] = useState(0);
  const today = new Date(useApp((s) => s.now) ?? 0);
  const days = Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
  const tasks = PLAN[sel % PLAN.length];
  return (
    <div className="scr">
      <div className="top">
        <BackLink href="/home" /><b style={{ fontWeight: 500, fontSize: 19 }}>Study plan</b><div className="grow" />
        <button type="button" className="cbtn" aria-label="Adjust" onClick={() => toast("The plan adjusts after each session")}><I.filter /></button>
      </div>
      <div className="days" role="tablist" aria-label="Days">
        {days.map((d, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === sel} onClick={() => setSel(i)}>
            <span>{i === 0 ? "Today" : DN[d.getDay()]}</span><b>{d.getDate()}</b>
          </button>
        ))}
      </div>
      <h1 className="h-l" style={{ marginTop: 6 }}>{sel === 0 ? "Today's" : `${DN[days[sel].getDay()]}'s`} plan · {tasks.reduce((t, x) => t + x.min, 0)} min</h1>
      <div className="tl" key={sel}>
        {tasks.map((t, i) => (
          <div key={t.title} style={{ display: "contents" }}>
            <span className="tm" style={{ "--i": i } as React.CSSProperties}>{t.time}</span>
            <div className="slot" style={{ "--i": i } as React.CSSProperties}>
              <div className={`tcard sm ${t.bg}`}>
                <Deco />
                <span className={`lvl ${t.lv === "Advanced" ? "adv" : ""}`} style={{ justifySelf: "start", background: "rgba(255,255,255,.7)", borderColor: "transparent" }}>{t.lv}</span>
                <h4>{t.title}</h4>
                <ul>{t.obj.map((o) => <li key={o}>{o}</li>)}</ul>
                <div className="meta"><I.clock width={16} height={16} />{t.min} min</div>
                {t.href
                  ? <Link className="go" href={t.href} aria-label={`Open ${t.title}`}><I.up /></Link>
                  : <button type="button" className="go" aria-label={`Open ${t.title}`} onClick={() => toast("Comes with the full content")}><I.up /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
