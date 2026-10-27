"use client";
import { useState } from "react";
import { SetupTop, SmsBox, useNextStep } from "@/components/shells";
import { Hint, PasswordField } from "@/components/ui";
import { passwordProblem } from "@/lib/account";
import { useApp } from "@/lib/store";

/** A2 Parent sign-up: name and password. */
export default function ParentName() {
  const { name, set } = useApp();
  const next = useNextStep();
  const [pass, setPass] = useState("");
  const problem = passwordProblem(pass, "");
  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <p className="hello">Parent account</p>
          <h1 className="h-xl">Your name and password</h1>
          <input className="input" autoComplete="name" aria-label="Your name" placeholder="Your name, e.g. Akosua Mensah" value={name} onChange={(e) => set({ name: e.target.value })} />
          <PasswordField value={pass} onChange={setPass} />
          {problem ? <Hint error>{problem}</Hint> : <Hint>You&apos;ll sign in with your phone number and this password. Lost it? We text you a code.</Hint>}
        </div>
        <div className="col w-only"><SmsBox got /></div>
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={!name.trim() || !pass || !!problem} onClick={() => next()}>Continue</button>
      </div>
    </div>
  );
}
