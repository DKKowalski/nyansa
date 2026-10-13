import { strandByName } from "@/lib/content";

/** Tick-mark progress bar: `on` filled ticks, an optional tall "now" marker at index `now`.
 *  With `from`, ticks from `from` up to `on` light up one after another (use for gains on result screens). */
export function Ticks({ n, on, now, from, gain, label, style, className = "" }: {
  n: number; on: number; now?: number; from?: number; gain?: boolean; label?: string; style?: React.CSSProperties; className?: string;
}) {
  return (
    <div className={`ticks ${className}`} role={label ? "progressbar" : undefined} aria-label={label} style={style}>
      {Array.from({ length: n }, (_, i) => {
        const lit = from !== undefined && i >= from && i < on && i !== now;
        return (
          <i key={i} className={`${i === now ? "now" : i < on ? "on" : ""}${lit ? ` lit${gain ? " gain" : ""}` : ""}`}
            style={lit ? ({ "--i": i - from! } as React.CSSProperties) : undefined} />
        );
      })}
    </div>
  );
}

/** Semicircle tick gauge with a big percentage and a short message. */
export function Gauge({ pct, msg, sweep = false, children }: { pct: number; msg?: string; sweep?: boolean; children?: React.ReactNode }) {
  const n = 25, cx = 150, cy = 150, r1 = 102, r2 = 128;
  const text = msg ?? (pct >= 75 ? "Great start, keep it up!" : pct >= 40 ? "Good base. Let's build on it." : "Lots of easy wins ahead.");
  return (
    <>
      <div className={`gauge${sweep ? " sweep" : ""}`}>
        <svg viewBox="0 0 300 165" role="img" aria-label={`${pct}%`}>
          <path d="M70 150a80 80 0 0 1 160 0" fill="none" stroke="#EEF0EC" strokeWidth="2" />
          {Array.from({ length: n }, (_, i) => {
            const a = Math.PI + (i / (n - 1)) * Math.PI, on = i / (n - 1) <= pct / 100 + 1e-6;
            return (
              <line key={i} className={on ? "on" : undefined} style={sweep ? ({ "--i": i } as React.CSSProperties) : undefined}
                x1={(cx + r1 * Math.cos(a)).toFixed(1)} y1={(cy + r1 * Math.sin(a)).toFixed(1)}
                x2={(cx + r2 * Math.cos(a)).toFixed(1)} y2={(cy + r2 * Math.sin(a)).toFixed(1)}
                stroke={on ? "#0F6B4A" : "#E6E8E3"} strokeOpacity={on ? (0.45 + 0.55 * (1 - i / n)).toFixed(2) : 1}
                strokeWidth="11" strokeLinecap="round" />
            );
          })}
        </svg>
        <div className="val"><b>{children ?? `${pct}%`}</b></div>
      </div>
      <p style={{ margin: "2px 0 0", textAlign: "center", fontSize: 15, color: "var(--ink-2)", fontWeight: 300 }}>{text}</p>
    </>
  );
}

/** Small round tick dial for today's goal. */
export function MiniDial({ p }: { p: number }) {
  const n = 36;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (i / n) * 2 * Math.PI;
        return <line key={i} x1={(36 + 24 * Math.cos(a)).toFixed(1)} y1={(36 + 24 * Math.sin(a)).toFixed(1)} x2={(36 + 32 * Math.cos(a)).toFixed(1)} y2={(36 + 32 * Math.sin(a)).toFixed(1)} stroke={i / n < p ? "#0F6B4A" : "#D9DCD6"} strokeWidth="2" strokeLinecap="round" />;
      })}
      <text x="36" y="41" textAnchor="middle" fontSize="15" fontWeight="500" fill="#141816">{Math.round(p * 100)}%</text>
    </svg>
  );
}

/** Predicted grade trend (lower is better, so the line rises as grades improve). */
export function Trend() {
  const pts: [string, number][] = [["Diagnostic", 6], ["Set 1", 5], ["Set 2", 5], ["Mock 1", 4], ["Now", 4]];
  const W = 320, H = 150, x = (i: number) => 16 + (i * (W - 32)) / (pts.length - 1), y = (g: number) => 18 + ((g - 1) / 8) * (H - 40) * 1.6 - 40;
  const line = pts.map(([, g], i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(g).toFixed(1)}`).join(" ");
  const last = pts.length - 1;
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H + 24}`} role="img" aria-label="Predicted grade improved from 6 to 4">
      <path d={`${line} L${x(last)} ${H} L${x(0)} ${H} Z`} fill="#D6E6DC" />
      <path d={line} fill="none" stroke="#0F6B4A" strokeWidth="2.5" />
      {pts.map(([l, g], i) => (
        <g key={l}>
          <circle cx={x(i)} cy={y(g)} r={i === last ? 6 : 3.5} fill={i === last ? "#F2B33D" : "#0F6B4A"} stroke="#fff" strokeWidth="2" />
          <text x={x(i)} y={y(g) - 12} textAnchor="middle" fontSize="13" fill="#141816">{g}</text>
          <text x={x(i)} y={H + 18} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} fontSize="12" fill="#3A403C">{l}</text>
        </g>
      ))}
    </svg>
  );
}

/** A labelled row with a coloured progress bar (subjects, strands, papers). */
export function StatRow({ icon, iconBg, label, value, pct, color = "var(--forest)", style, onClick }: {
  icon: React.ReactNode; iconBg: string; label: string; value: React.ReactNode; pct: number; color?: string; style?: React.CSSProperties; onClick?: () => void;
}) {
  return (
    <div className="srow" style={{ ...(onClick ? { cursor: "pointer" } : {}), ...style }} onClick={onClick} role={onClick ? "link" : undefined}>
      <span className={`ic ${iconBg}`}>{icon}</span>
      <b>{label}</b>
      <span className="pc">{value}</span>
      <span className="bar"><i style={{ width: `${pct}%`, background: color }} /></span>
    </div>
  );
}

export function StrandRow({ name, value, pct }: { name: string; value: React.ReactNode; pct: number }) {
  const s = strandByName(name);
  return <StatRow icon={s.abbr} iconBg={s.bg} label={name} value={value} pct={pct} color={s.color} />;
}
