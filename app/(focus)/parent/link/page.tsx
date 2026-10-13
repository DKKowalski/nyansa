"use client";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { useApp } from "@/lib/store";

/** G1 Parent links a child with the 6-digit code from the child's settings. */
export default function LinkChild() {
  const toast = useToast();
  const router = useRouter();
  const parentSignup = useApp((s) => s.role === "parent" && !s.onboarded);
  const set = useApp((s) => s.set);
  return (
    <div className="scr">
      <div className="top"><BackLink href={parentSignup ? "/setup/name" : "/settings"} /><div className="grow" /></div>
      <p className="hello">Parent or guardian</p>
      <h1 className="h-xl">Link your child</h1>
      <p className="lead">Ask your child for the 6-digit code in their Nyansa settings.</p>
      <div className="otp6">{"482916".split("").map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="prow bg-sage" style={{ cursor: "default" }}>
        <span className="ico" style={{ background: "var(--butter)" }}>A</span>
        <span className="tx"><b>Ama · JHS 3</b><span>BECE · Mathematics, English, Science, Social Studies</span></span>
        <span className="end"><I.check /></span>
      </div>
      <div className="cta">
        <button type="button" className="btn" onClick={() => { if (parentSignup) set({ onboarded: true }); router.push("/parent"); }}>Link Ama and continue</button>
        <button type="button" className="btn text" onClick={() => toast("You can link more children later")}>Add another child</button>
      </div>
    </div>
  );
}
