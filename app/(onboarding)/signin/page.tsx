"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BusyButton, Segmented } from "@/components/motion";
import { BackLink } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Hint, OrDivider, PasswordField } from "@/components/ui";
import { I } from "@/components/icons";
import { ghanaDigits } from "@/lib/phone";
import { useApp } from "@/lib/store";

type Tab = "user" | "contact";

/** S1 Sign in with a username, or a phone number or email, and a password. Until accounts live on a server,
 *  only the account set up on this device (or the sample student) can sign in. */
export default function SignIn() {
  const s = useApp();
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("user");
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [failed, setFailed] = useState(false);

  const v = id.trim().toLowerCase();
  const matches = !!v && s.onboarded && (tab === "user"
    ? v === s.username.toLowerCase()
    : (!!s.email && v === s.email.trim().toLowerCase()) || (!!s.phone && ghanaDigits(v) === ghanaDigits(s.phone)));

  function sample() {
    s.set({ role: "student", name: "Ama", lastName: "Owusu", username: "BraveKente27", level: "jhs", exam: "BECE", cls: "JHS 3", onboarded: true });
    router.push("/home");
  }

  return (
    <div className="scr">
      <div className="top"><BackLink href="/welcome" /><div className="grow" /></div>
      <div className="cols obc">
        <div className="col">
          <p className="hello">Welcome back</p>
          <h1 className="h-xl">Sign in</h1>
          <button type="button" className="btn light" onClick={() => toast("Google sign-in comes later")}><I.google />Continue with Google</button>
          <OrDivider />
          <Segmented label="Sign in with" value={tab} onChange={(t: Tab) => { setTab(t); setId(""); setFailed(false); }}
            options={[{ value: "user", label: "Username" }, { value: "contact", label: "Phone or email" }]} />
          <input className="input" autoComplete={tab === "user" ? "username" : "email"} autoCapitalize="none" spellCheck={false}
            aria-label={tab === "user" ? "Username" : "Phone number or email"} placeholder={tab === "user" ? "Username, e.g. BraveKente27" : "024 123 4567 or you@example.com"}
            value={id} onChange={(e) => { setId(e.target.value); setFailed(false); }} />
          <PasswordField value={pass} onChange={(p) => { setPass(p); setFailed(false); }} placeholder="Password" autoComplete="current-password" />
          {failed && <Hint error>That doesn&apos;t match an account on this device. Check the spelling and try again.</Hint>}
          <button type="button" className="linkbtn" style={{ alignSelf: "flex-start" }}
            onClick={() => toast(tab === "user" ? "Under 18? Ask your parent to reset it. Otherwise sign in with your phone or email." : "We'll send a code so you can set a new password.")}>
            Forgot your password?
          </button>
          <p className="small">Prototype: <button type="button" className="linkbtn" onClick={sample}>sign in as the sample student Ama</button>.</p>
        </div>
        <div className="col w-only">
          <div className="gcard" style={{ background: "var(--ground)" }}>
            <b style={{ fontWeight: 500, fontSize: 18 }}>Who signs in how</b>
            <div className="keys" style={{ marginTop: 8 }}>
              <div><i>U</i>Every student: the username and password they chose, or got from a parent</div>
              <div><i>P</i>Students 18 or over: also their phone number or email</div>
              <div><i>G</i>Parents: their phone number and password</div>
            </div>
          </div>
        </div>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Signing in…" disabled={!v || !pass}
          onDone={() => { if (matches) router.push(s.role === "parent" ? "/parent" : "/home"); else setFailed(true); }}>Sign in</BusyButton>
        <Link className="btn text" href="/welcome">New to Nyansa? <b style={{ fontWeight: 500 }}>Create an account</b></Link>
      </div>
    </div>
  );
}
