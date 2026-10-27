"use client";
import { useState } from "react";
import { SetupTop, useNextStep } from "@/components/shells";
import { Hint } from "@/components/ui";
import { ADULT_AGE, ageOn, dobProblem, isoDate, levelName } from "@/lib/account";
import { useApp } from "@/lib/store";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** A3 Student sign-up: name and date of birth. Under 18 means a parent or guardian agrees for them next. */
export default function Details() {
  const { name, lastName, dob, level, now, set } = useApp();
  const next = useNextStep();
  const [y0, m0, d0] = dob ? dob.split("-") : ["", "", ""];
  const [d, setD] = useState(d0 ? String(Number(d0)) : "");
  const [m, setM] = useState(m0 ? String(Number(m0)) : "");
  const [y, setY] = useState(y0);
  const problem = now === null ? "incomplete" : dobProblem(d, m, y, now);
  const age = !problem && now !== null ? ageOn(isoDate(+y, +m, +d), now) : null;
  const ready = !!name.trim() && !!lastName.trim() && !problem;

  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <p className="hello">{levelName(level) || "Student"} · about you</p>
          <h1 className="h-xl">Your details</h1>
          <div className="grid2">
            <input className="input" autoComplete="given-name" aria-label="First name" placeholder="First name, e.g. Kwame" value={name} onChange={(e) => set({ name: e.target.value })} />
            <input className="input" autoComplete="family-name" aria-label="Last name" placeholder="Last name, e.g. Mensah" value={lastName} onChange={(e) => set({ lastName: e.target.value })} />
          </div>
          <div className="sec"><h3>Date of birth</h3></div>
          <div className="dob" role="group" aria-label="Date of birth">
            <input className="input" inputMode="numeric" autoComplete="bday-day" aria-label="Day" placeholder="Day" maxLength={2} value={d} onChange={(e) => setD(e.target.value.replace(/\D/g, ""))} />
            <select className="input" autoComplete="bday-month" aria-label="Month" value={m} onChange={(e) => setM(e.target.value)} style={{ color: m ? undefined : "var(--muted)" }}>
              <option value="">Month</option>
              {MONTHS.map((x, i) => <option key={x} value={i + 1}>{x}</option>)}
            </select>
            <input className="input" inputMode="numeric" autoComplete="bday-year" aria-label="Year" placeholder="Year" maxLength={4} value={y} onChange={(e) => setY(e.target.value.replace(/\D/g, ""))} />
          </div>
          {problem && problem !== "incomplete" ? <Hint error>{problem}</Hint>
            : age === null ? <Hint>We only use it to check whether a parent needs to agree. It&apos;s never shown to anyone.</Hint>
            : age < ADULT_AGE
              ? <span className="agebadge minor">You&apos;re {age}. A parent or guardian agrees for you on the next step.</span>
              : <span className="agebadge">You&apos;re {age}, so you can set up your own account.</span>}
        </div>
        <div className="col w-only">
          <div className="gcard" style={{ background: "var(--ground)" }}>
            <b style={{ fontWeight: 500, fontSize: 18 }}>Why we ask your age</b>
            <div className="keys" style={{ marginTop: 8 }}>
              <div><i>1</i>Under {ADULT_AGE}: your parent or guardian agrees to our terms for you, using their phone number</div>
              <div><i>2</i>{ADULT_AGE} or over: you sign up with your own phone number or email</div>
              <div><i>3</i>Either way you pick a username and password to sign in</div>
            </div>
          </div>
        </div>
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={!ready} onClick={() => { set({ name: name.trim(), lastName: lastName.trim(), dob: isoDate(+y, +m, +d) }); next(); }}>Continue</button>
      </div>
    </div>
  );
}
