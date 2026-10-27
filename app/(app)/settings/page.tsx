"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Toggle } from "@/components/ui";
import { CopyButton } from "@/components/motion";
import { examDate, examName, firstName, subjectsOf, useApp } from "@/lib/store";

/** S3 Settings: setup choices, save data, reminders, parent link code, downloads. */
export default function Settings() {
  const s = useApp();
  const toast = useToast();
  const router = useRouter();
  const rows: [string, string, string][] = [
    ["Name", firstName(s.name), "/signup/details"],
    ["Username", s.username || "—", "/signup/username"],
    ["Exam", `${examName(s.exam)} · ${s.cls ?? "JHS 3"}`, "/setup/exam"],
    ["Subjects", `${subjectsOf(s.subjects).length} core subjects`, "/setup/subjects"],
    ["Exam date", new Date(examDate(s) + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), "/setup/goal"],
    ["Daily goal", `${s.minutes} minutes`, "/setup/goal"],
    ["Language", "English", "/setup/prefs"],
  ];
  const mini = { width: "auto", padding: "10px 14px", fontSize: 14 } as const;
  return (
    <div className="scr">
      <div className="top"><BackLink href={s.role === "parent" ? "/parent" : "/progress"} /><div className="grow" /></div>
      <h1 className="h-xl">Settings</h1>
      <div className="cols">
        <div className="col">
          <div className="gcard" style={{ padding: "4px 18px" }}>
            {rows.map(([b, v, href]) => (
              <Link key={b} className="setrow" href={href}><span className="tx"><b>{b}</b></span><span className="v">{v}</span><span style={{ color: "var(--muted)" }}>›</span></Link>
            ))}
          </div>
          <Toggle icon={<I.wifi />} iconBg="var(--sage)" title="Save data" sub="Pictures load only when tapped" checked={s.saveData} onChange={(v) => s.set({ saveData: v })} />
          <Toggle icon={<I.bell />} iconBg="var(--butter)" title="Daily reminder" sub="4:00 PM, by notification or SMS" checked onChange={() => toast("Reminder settings come in the build")} />
        </div>
        <div className="col">
          <div className="pcard bg-lilac" style={{ cursor: "default" }}>
            <span className="ico"><I.people /></span><span className="k">Parent link code</span>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="n" style={{ fontSize: 34, fontWeight: 300, letterSpacing: ".12em" }}>482 916</span>
              <CopyButton text="482916" label="Copy link code" onCopied={() => toast("Link code copied")} />
            </span>
            <span className="small" style={{ color: "var(--ink-2)" }}>Give this to a parent or guardian so they can follow your progress.</span>
          </div>
          <div className="gcard" style={{ padding: "4px 18px" }}>
            <div className="setrow"><span className="tx"><b>Offline downloads</b><span>Maths: 4 units · 38 MB</span></span><button type="button" className="btn light" style={mini} onClick={() => toast("Downloads come with offline support")}>Manage</button></div>
            <div className="setrow"><span className="tx"><b>Help and support</b><span>FAQs, report a wrong question, email us</span></span><span style={{ color: "var(--muted)" }}>›</span></div>
            <div className="setrow"><span className="tx"><b>Switch to parent view</b><span>See the parent screens</span></span><Link className="btn light" style={mini} href="/parent/link">Open</Link></div>
          </div>
          <button type="button" className="btn text" style={{ color: "var(--clay)" }} onClick={() => { s.reset(); router.replace("/"); }}>Log out</button>
        </div>
      </div>
    </div>
  );
}
