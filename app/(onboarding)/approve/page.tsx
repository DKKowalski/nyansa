"use client";
import { useState } from "react";
import { Art } from "@/components/art";
import { Wordmark } from "@/components/brand";
import { BusyButton } from "@/components/motion";
import { useToast } from "@/components/toast";
import { Agree, TermsLinks } from "@/components/ui";
import { ageOn, levelName } from "@/lib/account";
import { firstName, useApp } from "@/lib/store";

/** G0 The page a parent opens from the approval link when they weren't with their child at sign-up. */
export default function Approve() {
  const s = useApp();
  const toast = useToast();
  const [agreed, setAgreed] = useState(false);
  const kid = firstName(s.name);
  const parent = s.guardian?.name.split(/\s+/)[0] ?? "";
  const done = s.approval === "approved" || s.approval === "verified";
  const facts: [string, string][] = [
    ["Name", `${s.name} ${s.lastName}`.trim() || "Kofi"],
    ["Level", levelName(s.level) || "JHS"],
    ["Age", s.dob && s.now !== null ? String(ageOn(s.dob, s.now)) : "—"],
    ["Username", s.username || "—"],
  ];
  return (
    <div className="scr">
      <div className="top"><Wordmark size={32} /><div className="grow" /></div>
      <div className="cols obc">
        <div className="col">
          <h1 className="h-xl">{done ? `${kid}'s account is approved` : `${kid} wants to study with Nyansa`}</h1>
          <p className="lead">{done
            ? `Thank you. ${kid} can keep studying, and you'll get a short report every week.`
            : `${parent ? `${parent}, ` : ""}${kid} has made an account and listed you as their ${s.guardian?.relation.toLowerCase() || "parent or guardian"}. Nyansa helps students prepare for the BECE and WASSCE. Please check the details and approve within 7 days.`}</p>
          <div className="gcard" style={{ padding: "4px 18px" }}>
            {facts.map(([b, v]) => <div key={b} className="setrow"><span className="tx"><b>{b}</b></span><span className="v">{v}</span></div>)}
          </div>
          {!done && (
            <Agree checked={agreed} onChange={setAgreed}>
              I&apos;m {kid}&apos;s parent or guardian, and on their behalf I agree to Nyansa&apos;s <TermsLinks />.
            </Agree>
          )}
        </div>
        <div className="col w-only"><Art kind="approve" /></div>
      </div>
      {!done && (
        <div className="cta">
          <BusyButton busyLabel="Approving…" doneLabel="Approved" disabled={!agreed}
            onDone={() => s.set({ approval: "approved", consent: { by: "guardian", at: Date.now() } })}>Approve {kid}&apos;s account</BusyButton>
          <button type="button" className="btn text" onClick={() => toast("Request declined. We won't contact you again.")}>I don&apos;t know this request</button>
        </div>
      )}
    </div>
  );
}
