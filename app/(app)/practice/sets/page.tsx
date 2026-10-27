"use client";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Ticks } from "@/components/viz";
import { useApp } from "@/lib/store";

/** P0 Practice sets: Set 1 done, Set 2 in progress, Set 3 unlocks after Set 2. */
export default function Sets() {
  const router = useRouter();
  const toast = useToast();
  const { psetDone, startPractice } = useApp();
  const start = () => { startPractice(); router.push("/practice/question"); };
  return (
    <div className="scr">
      <div className="top"><BackLink href="/learn/mathematics/linear-equations" /><div className="grow" /></div>
      <h1 className="h-xl">Practice sets</h1>
      <div className="cols">
        <div className="col">
          <div className="sets">
            <button type="button" className="set done" onClick={() => toast("Set 1: you scored 4 of 5")}><span className="bdg"><I.check /></span>Set 1</button>
            <button type="button" className={`set ${psetDone ? "done" : "cur"}`} style={{ "--fill": psetDone ? "100%" : "0%" } as React.CSSProperties} onClick={start}>
              <span className="bdg">{psetDone ? <I.check /> : "▶"}</span>Set 2
            </button>
            <button type="button" className={`set ${psetDone ? "cur" : "lock"}`} onClick={() => toast(psetDone ? "Set 3 comes with the full content" : "Finish Set 2 to open Set 3")}>
              <span className="bdg">{psetDone ? "▶" : <I.lock />}</span>Set 3
            </button>
          </div>
          <div className="gcard">
            <div className="hd"><div><b>Set 2</b><span>5 questions · Basic and Advanced</span></div><span className="lvl"><I.clock width={16} height={16} />12 min</span></div>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <div style={{ flex: 1 }}><Ticks n={10} on={8} style={{ height: "auto" }} /><div className="big" style={{ marginTop: 6 }}><b style={{ fontSize: 40 }}>80%</b><span>Set 1 score</span></div></div>
              <div style={{ flex: 1 }}><Ticks n={10} on={4} style={{ height: "auto" }} /><div className="big" style={{ marginTop: 6 }}><b style={{ fontSize: 40 }}>42%</b><span>Mastery now</span></div></div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="pcard bg-sage" style={{ cursor: "default" }}><span className="k">How sets work</span><span className="n" style={{ fontSize: 18, fontWeight: 400 }}>Questions get harder as you get them right. Each set you finish opens the next one.</span></div>
        </div>
      </div>
      <div className="cta"><button type="button" className="btn green" onClick={start}>{psetDone ? "Practise Set 2 again" : "Start practice"}</button></div>
    </div>
  );
}
