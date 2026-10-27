"use client";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { BusyButton } from "@/components/motion";
import { SetupTop, SmsBox } from "@/components/shells";
import { useToast } from "@/components/toast";
import { Agree, OrDivider, PhoneField, TermsLinks } from "@/components/ui";
import { isGhanaMobile } from "@/lib/phone";
import { useApp } from "@/lib/store";

/** A2 Parent sign-up: verify a phone number once. It gets the weekly reports and recovers the account. */
export default function ParentStart() {
  const { phone, consent, set } = useApp();
  const router = useRouter();
  const toast = useToast();
  const agreed = consent?.by === "self";
  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <p className="hello">For parents and guardians</p>
          <h1 className="h-xl">Create your parent account</h1>
          <p className="lead">You&apos;ll add your children next. Each child gets their own login.</p>
          <button type="button" className="btn light" onClick={() => toast("Google sign-in comes later")}><I.google />Continue with Google</button>
          <OrDivider />
          <PhoneField value={phone} onChange={(v) => set({ phone: v, role: "parent" })} note="We text you a 6-digit code once. We use it for weekly reports and to recover your account." />
          <Agree checked={agreed} onChange={(v) => set({ consent: v ? { by: "self", at: Date.now() } : null })}>
            I agree to Nyansa&apos;s <TermsLinks />, for myself and for the children I add.
          </Agree>
        </div>
        <div className="col w-only">
          <div className="gcard">
            <b style={{ fontWeight: 500, fontSize: 18 }}>What you&apos;ll set up</b>
            <div className="keys" style={{ marginTop: 8 }}>
              <div><i>1</i>Your account: phone number, verified once</div>
              <div><i>2</i>Add each child: name, exam, class</div>
              <div><i>3</i>Get each child&apos;s username and password</div>
            </div>
          </div>
          <SmsBox got={false} />
        </div>
      </div>
      <div className="cta">
        <BusyButton busyLabel="Sending code…" disabled={!isGhanaMobile(phone) || !agreed} onDone={() => { set({ role: "parent" }); router.push("/signup/verify"); }}>Send code</BusyButton>
      </div>
    </div>
  );
}
