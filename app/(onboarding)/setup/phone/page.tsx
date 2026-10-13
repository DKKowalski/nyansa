"use client";
import { useRouter } from "next/navigation";
import { BusyButton } from "@/components/motion";
import { SetupTop, SmsBox } from "@/components/shells";
import { useApp } from "@/lib/store";
import { ghanaDigits, isGhanaMobile } from "@/lib/phone";

/** A2 Sign up: phone number. */
export default function Phone() {
  const { phone, set } = useApp();
  const router = useRouter();
  const ok = isGhanaMobile(phone);
  const digits = ghanaDigits(phone);
  const hint = !phone.trim() || ok ? null
    : digits.length > 9 ? "That's too many digits. Enter the 9 digits after +233."
    : digits.length === 9 ? "Ghana mobile numbers start with 2 or 5, like 24 or 55."
    : "Enter the 9 digits after +233, like 24 123 4567.";
  return (
    <div className="scr">
      <SetupTop step="phone" />
      <div className="cols obc">
        <div className="col">
          <p className="hello">Welcome to Nyansa</p>
          <h1 className="h-xl">Your phone number</h1>
          <p className="lead">We&apos;ll text you a 6-digit code. No email needed.</p>
          <div className="phone">
            <span className="cc"><span className="flag" />+233</span>
            <input className="input" inputMode="tel" autoComplete="tel-national" aria-label="Phone number" placeholder="24 123 4567"
              value={phone} onChange={(e) => set({ phone: e.target.value })} autoFocus maxLength={18} aria-invalid={!!hint && digits.length >= 9} aria-describedby="ph-hint" />
          </div>
          <p className="small" id="ph-hint" aria-live="polite" style={hint ? { color: "#9A3A20" } : undefined}>{hint ?? "Parents can sign up for their child with their own number."}</p>
        </div>
        <div className="col w-only"><SmsBox got={false} /></div>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Sending code…" disabled={!ok} onDone={() => router.push("/setup/code")}>Send code</BusyButton>
      </div>
    </div>
  );
}
