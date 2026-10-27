"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { PhoneTop } from "@/components/shells";
import { useToast } from "@/components/toast";
import { MiniDial, StatRow } from "@/components/viz";
import { QUESTIONS, subjectByName, TOPIC } from "@/lib/content";
import { correctCount, daysLeft, firstName, gradeOf, greeting, strandScores, subjectsOf, useApp, weakest } from "@/lib/store";

/** H1 Home: answers "what should I study now?" with one big Start card and today's plan. */
export default function Home() {
  const s = useApp();
  const toast = useToast();
  const router = useRouter();
  const t = TOPIC[weakest(strandScores(s.answers))[0]];
  const diagDone = Object.keys(s.answers).length > 0;
  return (
    <div className="scr">
      <PhoneTop>
        <button type="button" className="cbtn" aria-label="Search" onClick={() => toast("Search comes later")}><I.search /></button>
        <button type="button" className="cbtn" aria-label="Notifications" onClick={() => toast("No new notifications")}><I.bell /></button>
      </PhoneTop>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <div style={{ flex: 1 }}><h1 className="h-xl">{greeting(s.now)}, {firstName(s.name)}</h1></div>
        <div className="streak"><span style={{ color: "var(--clay)", gridRow: "span 2" }}><I.flame width={22} height={22} /></span><b>1</b><span>Day</span></div>
      </div>
      {s.approval === "pending" && (
        <div className="pcard bg-butter" style={{ cursor: "default", padding: "14px 18px" }}>
          <span className="k">Waiting for {s.guardian?.name.split(/\s+/)[0] || "your parent"} to approve your account. We sent them a link; they have 7 days.</span>
          <span style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button type="button" className="linkbtn" onClick={() => toast("Link sent again")}>Send the link again</button>
            <Link className="linkbtn" href="/approve">Prototype: open the parent&apos;s link</Link>
          </span>
        </div>
      )}
      <div className="cols">
        <div className="col">
          <div className="hero">
            <span className="live">UP NEXT · TODAY</span>
            <h3>{t[0]}</h3>
            <div className="meta"><span><I.book />Lesson + 10 questions</span><span><I.clock />20 min</span></div>
            <div className="bar" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} className={i === 0 ? "now" : ""} />)}</div>
            <Link href="/lesson">Start lesson</Link>
          </div>
          <div className="sec"><h3>Today&apos;s plan</h3><Link href="/plan">See all</Link></div>
          <div style={{ display: "grid", gap: 8 }}>
            <Link className="prow bg-sage" href="/lesson"><span className="ico"><I.book /></span><span className="tx"><b>Learn: {t[0]}</b><span>8 min · {t[1]}</span></span><span className="end"><I.arrow /></span></Link>
            <Link className="prow bg-lilac" href="/practice/sets"><span className="ico"><I.practice /></span><span className="tx"><b>Practise: {t[0]}</b><span>12 min · Set 2, 5 questions</span></span><span className="end"><I.arrow /></span></Link>
            <button type="button" className="prow bg-white" onClick={() => toast("English check-in comes with English content")}><span className="ico bg-butter">EN</span><span className="tx"><b>Check-in: English Language</b><span>10 min · find your starting point</span></span><span className="end"><I.arrow /></span></button>
          </div>
        </div>
        <div className="col">
          <div className="duo">
            <div className="stat bg-sage"><div className="tp"><span className="ico"><I.cal /></span>Exam in</div><div className="v"><b>{daysLeft(s)}</b><span>days</span></div><span className="ar"><I.up /></span></div>
            <div className="stat bg-butter"><div className="tp"><span className="ico"><I.check /></span>Studied</div><div className="v"><b>0</b><span>of {s.minutes} min</span></div><span className="ar"><I.up /></span></div>
          </div>
          <div className="dial"><MiniDial p={0} /><div className="tx"><b>Today&apos;s goal</b><span>{s.minutes} minutes · 3 tasks</span><span className="chiplet">3 tasks for today</span></div></div>
          <div className="sec"><h3>Your subjects</h3><Link href="/learn">All</Link></div>
          <div className="gcard" style={{ padding: "8px 20px" }}>
            {subjectsOf(s.subjects).map((n) => {
              const c = subjectByName(n), isM = n === "Mathematics" && diagDone;
              return (
                <StatRow key={n} icon={c.abbr} iconBg={c.bg} label={n} value={isM ? `Grade ${gradeOf(correctCount(s.answers))}` : "—"}
                  pct={isM ? Math.round((correctCount(s.answers) / QUESTIONS.length) * 100) : 0}
                  onClick={n === "Mathematics" ? () => router.push("/learn/mathematics") : undefined} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
