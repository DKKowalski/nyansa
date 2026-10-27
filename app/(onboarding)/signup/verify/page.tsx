"use client";
import { useRef, useState } from "react";
import { BusyButton, haptic } from "@/components/motion";
import { SetupTop, SmsBox, useNextStep } from "@/components/shells";
import { useToast } from "@/components/toast";
import { isMinor } from "@/lib/account";
import { formatGhana } from "@/lib/phone";
import { useApp } from "@/lib/store";

/** A2 Code check, shared by every sign-up: a parent's own phone, an adult student's phone or email, or, for a
 *  student under 18, their parent's phone or email (the parent reads the code out, which is their approval).
 *  Any 6 digits pass until the SMS and email gateways are connected. */
export default function Verify() {
  const s = useApp();
  const toast = useToast();
  const next = useNextStep();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const ok = code.join("").length === 6;

  const forParent = s.role === "student" && isMinor(s.dob, s.now) && !!s.guardian;
  const via = forParent ? s.guardian!.via : s.role === "parent" ? "phone" : s.contact;
  const phone = forParent ? s.guardian!.phone : s.phone, email = forParent ? s.guardian!.email : s.email;
  const dest = via === "email" ? email || "your email" : `+233 ${phone ? formatGhana(phone) : "24 123 4567"}`;
  const who = forParent ? s.guardian!.name.split(/\s+/)[0] : "";

  function put(i: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    // A pasted or autofilled code fills every box at once.
    if (digits.length > 1) {
      const next = digits.slice(0, 6).padEnd(6, " ").split("").map((d) => d.trim());
      setCode(next);
      refs.current[Math.min(5, digits.length)]?.focus();
      return;
    }
    const n = [...code]; n[i] = digits;
    setCode(n);
    if (n.join("").length === 6) haptic("success");
    if (digits && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <p className="hello">{forParent ? `Ask ${who} for the code` : "Check your messages"}</p>
          <h1 className="h-xl">Enter the code</h1>
          <p className="lead">{forParent ? `We sent it to ${who}'s ${via === "email" ? "email" : "phone"}: ${dest}` : `Sent to ${dest}`}</p>
          <div className={`otp${ok ? " done" : ""}`}>
            {code.map((d, i) => (
              <input key={i} ref={(el) => { refs.current[i] = el; }} className="input" inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${i + 1}`} value={d} autoFocus={i === 0}
                onChange={(e) => put(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }} />
            ))}
          </div>
          <p className="small">Prototype: type any 6 digits or <button type="button" className="linkbtn" onClick={() => setCode("482916".split(""))}>fill it in for me</button>.</p>
          {forParent && (
            <div className="pcard bg-butter" style={{ cursor: "default", padding: "14px 18px" }}>
              <span className="k">{who} isn&apos;t with you? We&apos;ll send them a link instead. You can start studying now, and they have 7 days to approve.</span>
              <button type="button" className="linkbtn" style={{ justifySelf: "start" }} onClick={() => { s.set({ approval: "pending" }); toast(`Link sent to ${who}`); next(); }}>Send {who} a link instead</button>
            </div>
          )}
        </div>
        <div className="col w-only"><SmsBox got parent={forParent} email={via === "email"} /></div>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Checking…" wait={600} disabled={!ok} onDone={() => { if (forParent) s.set({ approval: "verified" }); next(); }}>Verify</BusyButton>
        <button type="button" className="btn text" onClick={() => toast("New code sent")}>Send a new code</button>
      </div>
    </div>
  );
}
