"use client";
import { useState } from "react";
import { Segmented } from "@/components/motion";
import { SetupTop, SmsBox, useNextStep } from "@/components/shells";
import { Agree, Hint, PhoneField, TermsLinks } from "@/components/ui";
import { contactOk, isEmail, type Contact, type Guardian as G } from "@/lib/account";
import { firstName, useApp } from "@/lib/store";

const RELATIONS = ["Mother", "Father", "Guardian", "Other relative"];

/** A3 Under 18: the parent or guardian who agrees for the student. We send them a code to confirm. */
export default function Guardian() {
  const s = useApp();
  const next = useNextStep();
  const [g, setG] = useState<G>(s.guardian ?? { name: "", relation: "", via: "phone", phone: "", email: "" });
  const [agreed, setAgreed] = useState(s.consent?.by === "guardian");
  const put = (p: Partial<G>) => setG({ ...g, ...p });
  const ok = contactOk(g.via, g.phone, g.email);
  const ready = !!g.name.trim() && !!g.relation && ok && agreed;
  const who = g.name.trim().split(/\s+/)[0] || "your parent";

  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <p className="hello">Because you&apos;re under 18</p>
          <h1 className="h-xl">Your parent or guardian</h1>
          <p className="lead">They agree for you. We&apos;ll send them a code to confirm, and a weekly report on how you&apos;re doing.</p>
          <input className="input" autoComplete="off" aria-label="Parent or guardian's full name" placeholder="Their full name, e.g. Akosua Mensah" value={g.name} onChange={(e) => put({ name: e.target.value })} />
          <div className="chips" style={{ flexWrap: "wrap" }} role="group" aria-label="They are your">
            {RELATIONS.map((r) => <button key={r} type="button" className="chip" aria-pressed={g.relation === r} onClick={() => put({ relation: r })}>{r}</button>)}
          </div>
          <Segmented label="Contact them by" value={g.via} onChange={(v: Contact) => put({ via: v })}
            options={[{ value: "phone", label: "Their phone" }, { value: "email", label: "Their email" }]} />
          {g.via === "phone"
            ? <PhoneField label="Parent's phone number" placeholder="Parent's number, e.g. 24 555 0192" value={g.phone} onChange={(v) => put({ phone: v })} />
            : <>
                <input className="input" type="email" inputMode="email" autoComplete="off" aria-label="Parent's email" placeholder="parent@example.com" value={g.email} onChange={(e) => put({ email: e.target.value })} />
                {g.email.trim() && !isEmail(g.email) && <Hint error>Check the email address, e.g. name@gmail.com.</Hint>}
              </>}
          <Agree checked={agreed} onChange={setAgreed}>
            <b>{who === "your parent" ? "My parent or guardian agrees" : `${who} agrees`}</b>, on my behalf, to Nyansa&apos;s <TermsLinks />. I&apos;m under 18, so ticking this means they are agreeing for me.
          </Agree>
        </div>
        <div className="col w-only">
          <SmsBox got={false} parent email={g.via === "email"} />
          <div className="gcard" style={{ background: "var(--ground)" }}>
            <b style={{ fontWeight: 500, fontSize: 18 }}>What {who} agrees to</b>
            <div className="keys" style={{ marginTop: 8 }}>
              <div><i>✓</i>{firstName(s.name)} gets their own account, linked to {who}</div>
              <div><i>✓</i>We store a name, birth date, level and study progress, nothing more</div>
              <div><i>✓</i>{who === "your parent" ? "They" : who} can reset the password or close the account any time</div>
            </div>
          </div>
        </div>
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={!ready}
          onClick={() => { s.set({ guardian: { ...g, name: g.name.trim() }, consent: { by: "guardian", at: Date.now() } }); next(); }}>
          Send {who === "your parent" ? "them" : who} a code
        </button>
      </div>
    </div>
  );
}
