"use client";
import { CtaLink } from "@/components/ui";
import { SetupTop, SmsBox } from "@/components/shells";
import { useApp } from "@/lib/store";

/** A2 Sign up: phone number. */
export default function Phone() {
  const { phone, set } = useApp();
  const ok = phone.replace(/\D/g, "").length >= 9;
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
              value={phone} onChange={(e) => set({ phone: e.target.value })} autoFocus />
          </div>
          <p className="small">Parents can sign up for their child with their own number.</p>
        </div>
        <div className="col w-only"><SmsBox got={false} /></div>
      </div>
      <div className="cta">
        <CtaLink href="/setup/code" ready={ok}>Send code</CtaLink>
      </div>
    </div>
  );
}
