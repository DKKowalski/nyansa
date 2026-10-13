"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Deco, I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Ticks } from "@/components/viz";
import { useApp } from "@/lib/store";

/** L3 Topic: what it covers, exam frequency, mastery, and Learn / Practise / Past questions / Tutor. */
export default function Topic() {
  const toast = useToast();
  const router = useRouter();
  const startChat = useApp((s) => s.startChat);
  return (
    <div className="scr">
      <div className="top">
        <BackLink href="/learn/mathematics" />
        <span className="crumbs">Maths › Unit 2 · Algebra</span>
        <div className="grow" />
        <button type="button" className="cbtn" aria-label="Save" onClick={() => toast("Saved to your list")}><I.up /></button>
      </div>
      <h1 className="h-xl">Linear equations</h1>
      <div className="cols">
        <div className="col">
          <div className="tcard bg-lilac">
            <Deco />
            <p className="lead" style={{ color: "var(--ink-2)", maxWidth: "85%" }}>Find the unknown number in equations like 2x + 3 = 11, and turn word problems into equations.</p>
            <div className="stats"><div><span>Lessons</span><b>6</b></div><div><span>Questions</span><b>40</b></div><div><span>Time</span><b>1.5<span style={{ fontSize: 16 }}> h</span></b></div></div>
            <Link className="go" href="/lesson" aria-label="Start lesson"><I.up /></Link>
          </div>
          <div className="mast">
            <div className="hd"><span className="ic"><I.check /></span><b>Your mastery</b><span className="small" style={{ color: "var(--ink)" }}>Familiar · 42%</span></div>
            <Ticks n={30} on={12} now={12} label="Mastery 42%" />
            <span className="small">Proficient at 70%. About 2 more practice sets.</span>
          </div>
        </div>
        <div className="col">
          <div className="pcard bg-butter" style={{ cursor: "default", gap: 4, padding: "16px 18px" }}><span className="k">In past BECE papers</span><span className="n" style={{ fontSize: 20 }}>9 of the last 10 years</span></div>
          <div style={{ display: "grid", gap: 8 }}>
            <Link className="prow bg-sage" href="/lesson"><span className="ico"><I.book /></span><span className="tx"><b>Learn</b><span>Lesson 1 of 6 · 8 min</span></span><span className="end"><I.arrow /></span></Link>
            <Link className="prow bg-lilac" href="/practice/sets"><span className="ico"><I.practice /></span><span className="tx"><b>Practise</b><span>Set 2 of 3 · 5 questions</span></span><span className="end"><I.arrow /></span></Link>
            <Link className="prow bg-white" href="/past-questions"><span className="ico bg-butter"><I.cal /></span><span className="tx"><b>Past questions</b><span>12 questions, 2014–2024</span></span><span className="end"><I.arrow /></span></Link>
            <button type="button" className="prow bg-white" onClick={() => { startChat(-1); router.push("/tutor"); }}><span className="ico bg-sage"><I.tutor /></span><span className="tx"><b>Ask the tutor</b><span>About anything in this topic</span></span><span className="end"><I.arrow /></span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
