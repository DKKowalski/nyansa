"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { I } from "./icons";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A tiny buzz on Android phones that support it (iOS ignores it). Wins and taps only, never on mistakes. */
export function haptic(kind: "tap" | "success" | "celebrate") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator) || reduced()) return;
  navigator.vibrate(kind === "tap" ? 8 : kind === "success" ? 18 : [16, 60, 24]);
}

/** A number that rolls its digits (NumberFlow). With `from`, it counts up from that value once mounted:
 *  use on result screens, not on numbers the student reads every day. */
export function Num({ value, from, suffix, prefix }: { value: number; from?: number; suffix?: string; prefix?: string }) {
  const [shown, setShown] = useState(from ?? value);
  useEffect(() => {
    // Wait a frame so the starting value paints before it rolls.
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <NumberFlow value={shown} suffix={suffix} prefix={prefix}
      transformTiming={{ duration: 750, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      spinTiming={{ duration: 750, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }} />
  );
}

/** Tab bar / side menu / segmented control indicator. Renders the row twice: the plain row, and an
 *  "active" copy clipped to the selected item. Moving the clip changes background and label together. */
export function ClipGroup<T>({ items, active, className = "", activeClassName = "", style, render }: {
  items: T[];
  active: number;
  className?: string;
  activeClassName?: string;
  style?: React.CSSProperties;
  render: (item: T, i: number, layer: "base" | "active") => React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const place = () => {
      const c = box.current, t = top.current, el = base.current?.children[active] as HTMLElement | undefined;
      if (!c || !t) return;
      if (!el) { t.style.clipPath = "inset(50% 50% 50% 50% round 999px)"; return; }
      // offsetLeft/Top are measured from the container's padding box, the same box the active layer covers.
      const W = c.clientWidth, H = c.clientHeight, r = getComputedStyle(el).borderRadius || "0px";
      t.style.clipPath = `inset(${el.offsetTop}px ${W - el.offsetLeft - el.offsetWidth}px ${H - el.offsetTop - el.offsetHeight}px ${el.offsetLeft}px round ${r})`;
    };
    place();
    // Animate only after the first placement, so the indicator doesn't fly in on load.
    const id = requestAnimationFrame(() => box.current?.setAttribute("data-ready", ""));
    const ro = new ResizeObserver(place);
    if (box.current) ro.observe(box.current);
    return () => { cancelAnimationFrame(id); ro.disconnect(); };
  }, [active, items.length]);
  return (
    <div ref={box} className={`clip ${className}`} style={style}>
      <div ref={base} className="clip-base" style={{ display: "contents" }}>{items.map((it, i) => render(it, i, "base"))}</div>
      <div ref={top} className={`clip-active ${activeClassName}`} aria-hidden="true" inert>{items.map((it, i) => render(it, i, "active"))}</div>
    </div>
  );
}

/** A button that shows a short busy state (spinner + label) before its action, then optionally a done state. */
export function BusyButton({ className = "btn", busyLabel, doneLabel, wait = 700, onDone, disabled, children }: {
  className?: string; busyLabel: string; doneLabel?: string; wait?: number; onDone: () => void; disabled?: boolean; children: React.ReactNode;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const go = () => {
    if (state !== "idle") return;
    haptic("tap");
    setState("busy");
    timers.current.push(setTimeout(() => {
      if (!doneLabel) { onDone(); return; }
      setState("done"); haptic("success"); onDone();
      timers.current.push(setTimeout(() => setState("idle"), 1600));
    }, wait));
  };
  return (
    <button type="button" className={className} disabled={disabled && state === "idle"} onClick={go} aria-busy={state === "busy"}
      data-pending={state === "busy" ? "" : undefined} data-done={state === "done" ? "" : undefined}>
      <span className="btn-label" key={state}>
        {state === "busy" ? <><span className="spinner" aria-hidden="true" />{busyLabel}</>
          : state === "done" ? <><I.check width={20} height={20} />{doneLabel}</>
          : children}
      </span>
    </button>
  );
}

/** Copy-to-clipboard with an icon that morphs to a tick. */
export function CopyButton({ text, label, onCopied }: { text: string; label: string; onCopied?: () => void }) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return (
    <button type="button" className="cbtn sm copy" aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked: still confirm visually */ }
        haptic("tap"); setCopied(true); onCopied?.();
        clearTimeout(t.current); t.current = setTimeout(() => setCopied(false), 1600);
      }}>
      {copied ? <I.check key="c" /> : <I.copy key="p" />}
    </button>
  );
}

/** Kente-coloured burst for a finished set. Purely decorative. */
export function Burst() {
  const colors = ["#F2B33D", "#0F6B4A", "#C8452F", "#2E9E5B", "#F2B33D", "#7A5BC2"];
  return (
    <span className="burst" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <i key={i} style={{ "--a": `${(i / 14) * 360}deg`, background: colors[i % colors.length] } as React.CSSProperties} />
      ))}
    </span>
  );
}

/** Segmented control whose dark pill slides between options (clip-path indicator). */
export function Segmented<T extends string | number>({ options, value, onChange, label, style }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; style?: React.CSSProperties;
}) {
  return (
    <div role="group" aria-label={label} style={style}>
      <ClipGroup className="seg" items={options} active={options.findIndex((o) => o.value === value)}
        render={(o, i, layer) => layer === "active"
          ? <span key={i} className="segitem">{o.label}</span>
          : <button key={i} type="button" className="segitem" aria-pressed={o.value === value} onClick={() => { haptic("tap"); onChange(o.value); }}>{o.label}</button>} />
    </div>
  );
}
