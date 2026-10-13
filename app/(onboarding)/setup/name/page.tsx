"use client";
import { I } from "@/components/icons";
import { CtaLink } from "@/components/ui";
import { SetupTop } from "@/components/shells";
import { greeting, useApp } from "@/lib/store";

/** A2 Name and who is setting up (student or parent). */
export default function Name() {
  const { name, role, now, set } = useApp();
  const first = name.trim().split(/\s+/)[0];
  const parent = role === "parent";
  return (
    <div className="scr">
      <SetupTop step="name" />
      <div className="cols obc">
        <div className="col">
          <p className="hello">Nice to meet you</p>
          <h1 className="h-xl">What should we call you?</h1>
          <input className="input" autoComplete="given-name" aria-label="First name" placeholder="First name, e.g. Ama" value={name} onChange={(e) => set({ name: e.target.value })} />
          <div className="sec"><h3>Who is setting up?</h3></div>
          <div className="grid2">
            <button type="button" className="pcard bg-sage" aria-pressed={!parent} style={{ minHeight: 120 }} onClick={() => set({ role: "student" })}>
              <span className="ico"><I.person /></span><span className="n" style={{ fontSize: 20 }}>I&apos;m the student</span><span className="go"><I.arrow /></span>
            </button>
            <button type="button" className="pcard bg-lilac" aria-pressed={parent} style={{ minHeight: 120 }} onClick={() => set({ role: "parent" })}>
              <span className="ico"><I.people /></span><span className="n" style={{ fontSize: 20 }}>I&apos;m a parent or guardian</span><span className="go"><I.arrow /></span>
            </button>
          </div>
        </div>
        <div className="col w-only">
          <span className="small">Preview: how Nyansa will greet you</span>
          <div className="preview">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="av">{(first?.[0] ?? "?").toUpperCase()}</span>
              <div><p className="hello" style={{ margin: 0, fontSize: 15 }}>{greeting(now)},</p><b style={{ fontSize: 34, fontWeight: 400, letterSpacing: "-.02em" }}>{first || "…"}</b></div>
              <span className="streak" style={{ marginLeft: "auto" }}><span style={{ color: "var(--clay)", gridRow: "span 2" }}><I.flame width={20} height={20} /></span><b>1</b><span>Day</span></span>
            </div>
            <div className="hero" style={{ padding: 16 }}>
              <span className="live">UP NEXT · TODAY</span>
              <h3 style={{ fontSize: 22 }}>{parent ? "Your child's weekly report" : "Your first check-in"}</h3>
              <span style={{ background: "#fff", color: "var(--ink)", borderRadius: 18, padding: 12, textAlign: "center", fontWeight: 500, position: "relative", zIndex: 1 }}>{parent ? "See the report" : "Start"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cta">
        {/* Parents skip the student setup and link a child instead (A2 → G1). */}
        <CtaLink href={parent ? "/parent/link" : "/setup/exam"} ready={!!first}>Continue</CtaLink>
      </div>
    </div>
  );
}
