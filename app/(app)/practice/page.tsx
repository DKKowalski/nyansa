"use client";
import Link from "next/link";
import { Deco, I } from "@/components/icons";
import { PhoneTop } from "@/components/shells";

const HUB = [
  { href: "/mocks", bg: "bg-sage", icon: <I.clock />, k: "Timed, like the real exam", n: "Mock exams" },
  { href: "/past-questions", bg: "bg-butter", icon: <I.cal />, k: "WAEC 2014–2024", n: "Past questions" },
  { href: "/theory", bg: "bg-lilac", icon: <I.book />, k: "Get your working marked", n: "Theory answers" },
  { href: "/mistakes", bg: "bg-clay", icon: <I.close />, k: "Missed questions come back", n: "Mistakes", tag: "6 due" },
];

/** Practice hub: continue card plus mocks, past questions, theory marking and mistakes. */
export default function PracticeHub() {
  return (
    <div className="scr">
      <PhoneTop />
      <h1 className="h-xl">Get exam-ready</h1>
      <div className="hero">
        <span className="live">CONTINUE</span><h3>Linear equations · Set 2</h3>
        <div className="meta"><span><I.practice />5 questions</span><span><I.clock />12 min</span></div>
        <Link href="/practice/sets">Continue practice</Link>
      </div>
      <div className="hubgrid">
        {HUB.map(({ href, bg, icon, k, n, tag }) => (
          <Link key={href} className={`pcard ${bg}`} href={href}>
            <Deco /><span className="ico">{icon}</span>{tag && <span className="tag">{tag}</span>}
            <span className="k">{k}</span><span className="n">{n}</span><span className="go"><I.arrow /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
