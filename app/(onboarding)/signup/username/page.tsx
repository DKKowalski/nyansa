"use client";
import { useState } from "react";
import { Art } from "@/components/art";
import { BusyButton } from "@/components/motion";
import { SetupTop, useNextStep } from "@/components/shells";
import { Hint, PasswordField, PasswordRules } from "@/components/ui";
import { FIRST_USERNAMES, isMinor, passwordProblem, suggestUsernames, usernameProblem } from "@/lib/account";
import { useApp } from "@/lib/store";

/** A4 Username and password, the last account step. Others may see a username, so students
 *  under 18 are steered away from their real name. The password is never saved on the device. */
export default function Username() {
  const s = useApp();
  const next = useNextStep();
  const minor = isMinor(s.dob, s.now);
  const [user, setUser] = useState(s.username);
  const [pass, setPass] = useState("");
  const [sugs, setSugs] = useState(FIRST_USERNAMES);
  const uProblem = usernameProblem(user, [s.name, s.lastName]);
  const pProblem = passwordProblem(pass, user);
  const realName = uProblem === "real-name";
  const ready = !!user.trim() && (!uProblem || (realName && !minor)) && pass.length > 0 && !pProblem;

  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <h1 className="h-xl">Pick a username and password</h1>
          <p className="lead">You&apos;ll sign in with these{minor ? "" : `, or with your ${s.contact === "email" ? "email" : "phone number"}`}.</p>
          <input className="input" autoComplete="username" autoCapitalize="none" spellCheck={false} aria-label="Username" placeholder="Username, e.g. BraveKente27"
            value={user} onChange={(e) => setUser(e.target.value.replace(/\s/g, ""))} />
          {uProblem && !realName ? <Hint error>{uProblem}</Hint>
            : realName ? <Hint error={minor}>{minor ? "Don't use your real name. Pick a fun one so you stay private." : "Tip: a username without your real name keeps you more private."}</Hint>
            : user.trim() ? <Hint ok>✓ {user.trim()} is free</Hint>
            : <Hint>4 to 20 letters or numbers. Or tap one of these:</Hint>}
          <div className="chips sugs">
            {sugs.map((x) => <button key={x.u} type="button" className="chip" aria-pressed={user === x.u} onClick={() => setUser(x.u)}><span aria-hidden="true">{x.av}</span>{x.u}</button>)}
            <button type="button" className="chip" onClick={() => setSugs(suggestUsernames(3))}>Shuffle</button>
          </div>
          <div className="sec"><h3>Password</h3></div>
          <PasswordField value={pass} onChange={setPass} />
          <PasswordRules value={pass} username={user} />
        </div>
        <div className="col w-only"><Art kind="username" /></div>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Creating your account…" wait={800} disabled={!ready} onDone={() => { s.set({ username: user.trim() }); next(); }}>Create account</BusyButton>
      </div>
    </div>
  );
}
