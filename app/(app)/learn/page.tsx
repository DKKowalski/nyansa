"use client";
import Link from "next/link";
import { Deco, I } from "@/components/icons";
import { PhoneTop } from "@/components/shells";
import { useToast } from "@/components/toast";
import { subjectByName } from "@/lib/content";
import { correctCount, gradeOf, subjectsOf, useApp } from "@/lib/store";

/** L1 Subjects: pastel cards with mastery and predicted grade. Mathematics carries the sample content. */
export default function Learn() {
  const s = useApp();
  const toast = useToast();
  const subs = subjectsOf(s.subjects);
  return (
    <div className="scr">
      <PhoneTop><button type="button" className="cbtn" aria-label="Search" onClick={() => toast("Search comes later")}><I.search /></button></PhoneTop>
      <h1 className="h-xl">Your subjects</h1>
      <p className="lead">{subs.length} core subjects. Electives come later.</p>
      <div className="grid2">
        {subs.map((n) => {
          const c = subjectByName(n), isM = n === "Mathematics";
          const body = (<>
            <Deco />
            <span className="ico" style={{ fontWeight: 600 }}>{c.abbr}</span>
            <span className="tag">{isM ? `Grade ${gradeOf(correctCount(s.answers) || 5)}` : "Take check-in"}</span>
            <span className="k">{isM ? "4 units · 11 topics" : "Not started"}</span>
            <span className="n">{n}</span>
            <span className="mini"><i style={{ width: isM ? "38%" : 0 }} /></span>
            <span className="go"><I.arrow /></span>
          </>);
          return isM
            ? <Link key={n} className={`pcard ${c.bg} subj`} href="/learn/mathematics">{body}</Link>
            : <button key={n} type="button" className={`pcard ${c.bg} subj`} onClick={() => toast(`${n}: the sample uses Mathematics`)}>{body}</button>;
        })}
      </div>
    </div>
  );
}
