"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BusyButton, haptic } from "@/components/motion";
import { SetupTop, SmsBox } from "@/components/shells";
import { useToast } from "@/components/toast";
import { useApp } from "@/lib/store";
import { formatGhana } from "@/lib/phone";

/** A2 Sign up: SMS code. Any 6 digits pass until the SMS gateway is connected. */
export default function Code() {
  const phone = useApp((s) => s.phone);
  const toast = useToast();
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const ok = code.join("").length === 6;

  function put(i: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    // A pasted or autofilled code fills every box at once.
    if (digits.length > 1) {
      const next = digits.slice(0, 6).padEnd(6, " ").split("").map((d) => d.trim());
      setCode(next);
      refs.current[Math.min(5, digits.length)]?.focus();
      return;
    }
    const next = [...code]; next[i] = digits;
    setCode(next);
    if (next.join("").length === 6) haptic("success");
    if (digits && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <div className="scr">
      <SetupTop step="code" />
      <div className="cols obc">
        <div className="col">
          <p className="hello">Check your messages</p>
          <h1 className="h-xl">Enter the code</h1>
          <p className="lead">Sent to +233 {phone ? formatGhana(phone) : "24 123 4567"}</p>
          <div className={`otp${ok ? " done" : ""}`}>
            {code.map((d, i) => (
              <input key={i} ref={(el) => { refs.current[i] = el; }} className="input" inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${i + 1}`} value={d} autoFocus={i === 0}
                onChange={(e) => put(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }} />
            ))}
          </div>
          <p className="small">Prototype: type any 6 digits or <button type="button" className="linkbtn" onClick={() => setCode("482916".split(""))}>fill it in for me</button>.</p>
        </div>
        <div className="col w-only"><SmsBox got /></div>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Checking…" wait={600} disabled={!ok} onDone={() => router.push("/setup/name")}>Verify</BusyButton>
        <button type="button" className="btn text" onClick={() => toast("New code sent")}>Send a new code</button>
      </div>
    </div>
  );
}
