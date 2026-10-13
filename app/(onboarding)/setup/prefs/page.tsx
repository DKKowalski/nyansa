"use client";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { SetupTop } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Toggle } from "@/components/ui";
import { StatRow } from "@/components/viz";
import { useApp } from "@/lib/store";

/** A6 Data and language, then on to the diagnostic check-in. */
export default function Prefs() {
  const { saveData, minutes, set } = useApp();
  const toast = useToast();
  const router = useRouter();
  return (
    <div className="scr">
      <SetupTop step="prefs" />
      <p className="hello">Almost done</p>
      <h1 className="h-xl">Data and language</h1>
      <div className="cols obc">
        <div className="col">
          <Toggle icon={<I.wifi />} iconBg="var(--sage)" title="Save data" sub="Pictures load only when you tap them" checked={saveData} onChange={(v) => set({ saveData: v })} />
          <div className="sec"><h3>Explanations in</h3></div>
          <div className="chips" style={{ flexWrap: "wrap" }}>
            <span className="chip icon"><I.globe /></span>
            <button type="button" className="chip" aria-pressed="true">English</button>
            {["Twi", "Ewe", "Ga"].map((l) => <button key={l} type="button" className="chip" style={{ opacity: 0.55 }} onClick={() => toast(`${l} is coming later`)}>{l} · soon</button>)}
          </div>
        </div>
        <div className="col w-only">
          <div className="gcard">
            <span className="small">Estimated data use</span>
            <div className="big"><b>{saveData ? 3 : 12}</b><span>MB a day<br />at {minutes} min of study</span></div>
            <StatRow icon={<I.wifi width={20} height={20} />} iconBg="bg-sage" label="Save data on" value="≈ 3 MB" pct={25} />
            <StatRow icon={<I.wifi width={20} height={20} />} iconBg="bg-butter" label="Save data off" value="≈ 12 MB" pct={100} color="var(--gold)" />
            <span className="small" style={{ marginTop: 8 }}>Download lessons on Wi-Fi to use almost no data.</span>
          </div>
        </div>
      </div>
      <div className="cta">
        <button type="button" className="btn green" onClick={() => { set({ onboarded: true }); router.push("/check-in"); }}>Finish setup</button>
      </div>
    </div>
  );
}
