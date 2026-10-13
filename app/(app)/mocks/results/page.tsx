"use client";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { StatRow, StrandRow } from "@/components/viz";
import { Num } from "@/components/motion";
import { MQ } from "@/lib/content";
import { useApp } from "@/lib/store";

const P2 = 38; // Paper 2 (theory) sample mark until AI marking is connected

/** M3 Mock results: BECE grade, marks per paper, where marks were lost, add weak topics to the plan. */
export default function MockResults() {
  const mans = useApp((s) => s.mans);
  const toast = useToast();
  const n = MQ.length, ok = MQ.filter((q, i) => mans[i] === q.a).length;
  const p1 = Math.round((ok / n) * 40), tot = p1 + P2;
  const gr = tot >= 80 ? 1 : tot >= 70 ? 2 : tot >= 60 ? 3 : tot >= 55 ? 4 : tot >= 50 ? 5 : tot >= 45 ? 6 : 7;
  const lost: Record<string, number> = {};
  MQ.forEach((q, i) => { if (mans[i] !== q.a) { const st = q.strand ?? "Algebra"; lost[st] = (lost[st] ?? 0) + 1; } });
  const L = Object.entries(lost).sort((x, y) => y[1] - x[1]);
  return (
    <div className="scr">
      <div className="top"><BackLink href="/mocks" /><div className="grow" /><button type="button" className="cbtn" aria-label="Share" onClick={() => toast("Sharing comes later")}><I.up /></button></div>
      <p className="hello">BECE Maths Mock 1 · results</p>
      <div className="cols">
        <div className="col">
          <div className="gcard"><span className="small" style={{ color: "var(--ink-2)" }}>Your grade (1 is best)</span><div className="big"><b><Num value={gr} from={9} /></b><span><Num value={tot} from={0} /> of 100 marks<br />Target: grade 1</span></div></div>
          <div className="gcard grow" style={{ padding: "10px 20px" }}>
            <StatRow icon="P1" iconBg="bg-sage" label="Paper 1 · Objectives" value={`${p1}/40`} pct={(p1 / 40) * 100} />
            <StatRow icon="P2" iconBg="bg-lilac" label="Paper 2 · Theory (AI-marked)" value={`${P2}/60`} pct={(P2 / 60) * 100} color="#7A5BC2" />
          </div>
        </div>
        <div className="col">
          <div className="gcard grow">
            <b style={{ fontWeight: 500, fontSize: 18 }}>Where you lost marks</b>
            {L.length ? L.map(([st, k]) => <StrandRow key={st} name={st} value={`${k} wrong`} pct={Math.min(100, (k / n) * 300)} />) : <p className="lead">No objective marks lost. Excellent!</p>}
          </div>
          <button type="button" className="btn green" onClick={() => toast(`Added ${L.length} topics to your plan`)}>Add these topics to my plan</button>
          <button type="button" className="btn light" onClick={() => toast("Answer review comes in the build")}>Review my answers</button>
        </div>
      </div>
    </div>
  );
}
