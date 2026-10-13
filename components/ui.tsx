"use client";
import Link from "next/link";
import { Dialog, Switch } from "radix-ui";

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
      <Switch.Root className="sw" checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
}

/** Bottom sheet on phone, centred card on web (Radix Dialog: focus trap, Esc, outside click). */
export function Sheet({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; children: React.ReactNode }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={typeof document !== "undefined" ? document.querySelector<HTMLElement>(".app") : undefined}>
        <Dialog.Overlay className="sheet2">
          <Dialog.Content aria-describedby={undefined}>
            <Dialog.Title style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{title}</Dialog.Title>
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
