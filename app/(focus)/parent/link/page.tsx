"use client";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { useApp } from "@/lib/store";
import { BusyButton } from "@/components/motion";

/** G1 Parent links a child with the 6-digit code from the child's settings. */
export default function LinkChild() {
  const toast = useToast();
  const router = useRouter();
  const parentSignup = useApp((s) => s.role === "parent" && !s.onboarded);
  const set = useApp((s) => s.set);
  return (
    <div className="scr">
      <div className="top"><BackLink href={parentSignup ? "/signup/parent/name" : "/settings"} /><div className="grow" /></div>
      <h1 className="h-xl">Link your child</h1>
      <p className="lead">Ask your child for the 6-digit code in their Nyansa settings.</p>
      <div className="otp6 stagger">{"482916".split("").map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="prow bg-sage" style={{ cursor: "default" }}>
        <span className="ico" style={{ background: "var(--butter)" }}>A</span>
        <span className="tx"><b>Ama · JHS 3</b><span>BECE · Mathematics, English, Science, Social Studies</span></span>
        <span className="end"><I.check /></span>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Linking…" doneLabel="Linked" wait={700} onDone={() => { if (parentSignup) set({ onboarded: true }); setTimeout(() => router.push("/parent"), 500); }}>Link Ama and continue</BusyButton>
        <button type="button" className="btn text" onClick={() => toast("You can link more children later")}>Add another child</button>
      </div>
    </div>
  );
}
