"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { Dialog, Switch } from "radix-ui";
import { haptic } from "./motion";
import { I } from "./icons";
import { ghanaDigits, isGhanaMobile } from "@/lib/phone";

/** Primary action that is a link when ready and a disabled button until then. */
export function CtaLink({ href, ready = true, className = "btn", children }: { href: string; ready?: boolean; className?: string; children: React.ReactNode }) {
  return ready
    ? <Link className={className} href={href}>{children}</Link>
    : <button type="button" className={className} disabled>{children}</button>;
}

/** Settings row with a switch (Radix Switch: keyboard and screen-reader support, styled by .sw). */
export function Toggle({ icon, iconBg, title, sub, checked, onChange }: {
  icon: React.ReactNode; iconBg: string; title: string; sub: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="swrow">
      <span className="cbtn sm" style={{ background: iconBg }}>{icon}</span>
      <div className="tx"><b>{title}</b><span>{sub}</span></div>
      <Switch.Root className="sw" checked={checked} onCheckedChange={(v) => { haptic("tap"); onChange(v); }} aria-label={title} />
    </div>
  );
}

/** Bottom sheet on phone, centred card on web (Radix Dialog: focus trap, Esc, outside click).
 *  On phone it can be dragged down to dismiss: a flick is enough (velocity), dragging up meets resistance. */
export function Sheet({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; t: number; id: number; dy: number } | null>(null);

  const start = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = panel.current;
    const onPhone = (p?.closest(".app")?.clientWidth ?? 0) < 900;
    // One finger at a time; buttons inside the sheet keep working as buttons.
    if (!p || drag.current || !onPhone || (e.target as HTMLElement).closest("button")) return;
    drag.current = { y: e.clientY, t: Date.now(), id: e.pointerId, dy: 0 };
    p.setPointerCapture(e.pointerId);
    p.removeAttribute("data-settling");
    p.setAttribute("data-dragging", "");
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current, p = panel.current;
    if (!d || !p || e.pointerId !== d.id) return;
    d.dy = e.clientY - d.y;
    // Past the top edge, damp the drag: the further you pull, the less it moves.
    const y = d.dy < 0 ? -Math.sqrt(-d.dy) * 2 : d.dy;
    p.style.transform = `translateY(${y}px)`;
  };
  const end = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current, p = panel.current;
    if (!d || !p || e.pointerId !== d.id) return;
    drag.current = null;
    p.removeAttribute("data-dragging");
    const velocity = Math.abs(d.dy) / Math.max(1, Date.now() - d.t);
    if (d.dy > p.offsetHeight * 0.3 || (d.dy > 10 && velocity > 0.11)) {
      onOpenChange(false); // the exit animation continues from where the finger let go
    } else {
      p.setAttribute("data-settling", "");
      p.style.transform = "";
      p.addEventListener("transitionend", () => p.removeAttribute("data-settling"), { once: true });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={typeof document !== "undefined" ? document.querySelector<HTMLElement>(".app") : undefined}>
        <Dialog.Overlay className="sheet2">
          <Dialog.Content ref={panel} aria-describedby={undefined} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
            <div className="grip" aria-hidden="true" />
            <Dialog.Title style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{title}</Dialog.Title>
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Consent checkbox. Links open the documents in a new tab so the form keeps what was typed. */
export function Agree({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="agree">
      <input type="checkbox" checked={checked} onChange={(e) => { haptic("tap"); onChange(e.target.checked); }} />
      <span className="box" aria-hidden="true"><I.check /></span>
      <span>{children}</span>
    </label>
  );
}
export const TermsLinks = () => (
  <><Link href="/terms" target="_blank" className="linkbtn">Terms and Conditions</Link> and <Link href="/privacy" target="_blank" className="linkbtn">Privacy Policy</Link></>
);

/** What is wrong with a Ghana mobile number as typed, or null while it is empty or valid. */
export function phoneHint(phone: string) {
  const digits = ghanaDigits(phone);
  return !phone.trim() || isGhanaMobile(phone) ? null
    : digits.length > 9 ? "That's too many digits. Enter the 9 digits after +233."
    : digits.length === 9 ? "Ghana mobile numbers start with 2 or 5, like 24 or 55."
    : "Enter the 9 digits after +233, like 24 123 4567.";
}

/** +233 phone field with an inline hint. Shows the hint only once enough is typed to judge, unless `strict`. */
export function PhoneField({ value, onChange, label = "Phone number", placeholder = "24 123 4567", note, autoFocus }: {
  value: string; onChange: (v: string) => void; label?: string; placeholder?: string; note?: React.ReactNode; autoFocus?: boolean;
}) {
  const id = useId();
  const hint = phoneHint(value);
  return (
    <>
      <div className="phone">
        <span className="cc"><span className="flag" />+233</span>
        <input className="input" inputMode="tel" autoComplete="tel-national" aria-label={label} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} autoFocus={autoFocus} maxLength={18} aria-invalid={!!hint && ghanaDigits(value).length >= 9} aria-describedby={id} />
      </div>
      {(hint || note) && <p className="small" id={id} aria-live="polite" style={hint ? { color: "#9A3A20", margin: 0 } : { margin: 0 }}>{hint ?? note}</p>}
    </>
  );
}

/** Password field with a show/hide button (easier than typing it twice on a phone). */
export function PasswordField({ value, onChange, label = "Password", placeholder = "Choose a password", autoComplete = "new-password" }: {
  value: string; onChange: (v: string) => void; label?: string; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="pwfield">
      <input className="input" type={show ? "text" : "password"} autoComplete={autoComplete} aria-label={label} placeholder={placeholder}
        value={value} onChange={(e) => onChange(e.target.value)} />
      <button type="button" className="pwshow" onClick={() => setShow(!show)} aria-pressed={show}>{show ? "Hide" : "Show"}</button>
    </div>
  );
}

/** A small hint under a field: red when something is wrong. */
export function Hint({ error, children }: { error?: boolean; children: React.ReactNode }) {
  return <p className="small" aria-live="polite" style={{ margin: 0, ...(error ? { color: "#9A3A20" } : {}) }}>{children}</p>;
}
