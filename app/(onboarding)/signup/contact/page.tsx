"use client";
import { I } from "@/components/icons";
import { Art } from "@/components/art";
import { BusyButton, Segmented } from "@/components/motion";
import { SetupTop, useNextStep } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Agree, Hint, OrDivider, PhoneField, TermsLinks } from "@/components/ui";
import { contactOk, isEmail, optionalOk, type Contact as C } from "@/lib/account";
import { useApp } from "@/lib/store";

/** A3 Students 18 or over: phone number or email. The one they pick is verified and required; the other is optional. */
export default function Contact() {
  const { contact, phone, email, consent, set } = useApp();
  const next = useNextStep();
  const toast = useToast();
  const agreed = consent?.by === "self";
  const ok = contactOk(contact, phone, email) && optionalOk(contact, phone, email);
  const emailField = (optional: boolean) => (
    <>
      <input className="input" type="email" inputMode="email" autoComplete="email" aria-label={optional ? "Email (optional)" : "Email"}
        placeholder={optional ? "Email (optional)" : "you@example.com"} value={email} onChange={(e) => set({ email: e.target.value })} />
      {email.trim() && !isEmail(email) && <Hint error>Check the email address, e.g. name@gmail.com.</Hint>}
    </>
  );
  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <h1 className="h-xl">How should we reach you?</h1>
          <p className="lead">We&apos;ll send a 6-digit code to check it&apos;s yours. You can also sign in with it.</p>
          <button type="button" className="btn light" onClick={() => toast("Google sign-in comes later")}><I.google />Continue with Google</button>
          <OrDivider />
          <Segmented label="Sign up with" value={contact} onChange={(v: C) => set({ contact: v })}
            options={[{ value: "phone", label: "Phone number" }, { value: "email", label: "Email" }]} />
          {contact === "phone" ? (
            <>
              <PhoneField value={phone} onChange={(v) => set({ phone: v })} autoFocus />
              <span className="optlabel">Email <span>· optional</span></span>
              {emailField(true)}
            </>
          ) : (
            <>
              {emailField(false)}
              <span className="optlabel">Phone number <span>· optional</span></span>
              <PhoneField label="Phone number (optional)" value={phone} onChange={(v) => set({ phone: v })} note="Handy for SMS reminders. We never share it." />
            </>
          )}
          <Agree checked={agreed} onChange={(v) => set({ consent: v ? { by: "self", at: Date.now() } : null })}>
            I&apos;m 18 or over and I agree to Nyansa&apos;s <TermsLinks />.
          </Agree>
        </div>
        <div className="col w-only"><Art kind="contact" /></div>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Sending code…" disabled={!ok || !agreed} onDone={() => { set({ guardian: null, approval: "none" }); next(); }}>Send code</BusyButton>
      </div>
    </div>
  );
}
