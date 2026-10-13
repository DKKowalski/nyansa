"use client";
import { LogoBare } from "@/components/brand";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { CtaLink } from "@/components/ui";
import { Ticks } from "@/components/viz";
import { PQ } from "@/lib/content";
import { useApp } from "@/lib/store";

/** P3 Practice summary: score, mastery change and mistakes saved for review. */
export default function Summary() {
  const pans = useApp((s) => s.pans);
  const sc = PQ.filter((q, i) => pans[i] === q.a).length, up = sc >= 4;
  return (
    <div className="scr">
      <div className="top"><div className="grow" /><BackLink href="/home" label="Close" /></div>
      <div className="cols">
        <div className="col">
          <div className="gcard" style={{ textAlign: "center", gap: 10, padding: "26px 20px" }}>
            <div className="mascot"><LogoBare size={70} color="#0F6B4A" /></div>
            <span className="small" style={{ marginTop: 8 }}>Set 2 complete</span>
            <div style={{ fontSize: 72, fontWeight: 200, letterSpacing: "-.04em", lineHeight: 1 }}>{sc}<span style={{ fontSize: 30, color: "var(--muted)" }}>/{PQ.length}</span></div>
            <p className="lead" style={{ color: "var(--ink-2)" }}>{up ? "Excellent! 2 of 3 sets done this week. Keep it up!" : sc >= 3 ? "Good work. 2 of 3 sets done this week." : "Good effort. Your mistakes are saved for review."}</p>
          </div>
        </div>
        <div className="col">
          <div className="mast">
            <div className="hd"><span className="ic"><I.up /></span><b>Linear equations</b><span className="small" style={{ color: "var(--ink)" }}>{up ? "Familiar → Proficient" : "Familiar"}</span></div>
            <Ticks n={30} on={up ? 21 : 15} now={up ? 21 : 15} />
            <span className="small">Mastery {up ? "42% → 70%" : "42% → 50%"}</span>
          </div>
          <div className="sets">
            <span className="set done"><span className="bdg"><I.check /></span>Set 1</span>
            <span className="set done"><span className="bdg"><I.check /></span>Set 2</span>
            <span className="set cur" style={{ "--fill": "0%" } as React.CSSProperties}><span className="bdg">▶</span>Set 3</span>
          </div>
          <div className="duo">
            <div className="stat bg-sage"><div className="tp">Correct</div><div className="v"><b>{sc}</b><span>of {PQ.length}</span></div></div>
            <div className="stat bg-clay"><div className="tp">Saved to review</div><div className="v"><b>{PQ.length - sc}</b><span>mistakes</span></div></div>
          </div>
        </div>
      </div>
      <div className="cta">
        <CtaLink href="/home">Back to Home</CtaLink>
        <CtaLink href="/mistakes" className="btn light">Review my mistakes</CtaLink>
      </div>
    </div>
  );
}
