import { KnotMark } from "./brand";

/** Flat illustrations in Nyansa's palette, drawn as SVG so they stay sharp and weigh almost nothing on a
 *  phone data plan. Side cards on the sign-up screens and the welcome slides use them instead of mock app UI. */

const C = {
  forest: "#0F6B4A", deep: "#0A3F2C", leaf: "#2E9E5B", gold: "#F2B33D", clay: "#E2603F", claySoft: "#F9DDD4",
  sage: "#D6E6DC", sage2: "#C3DBCB", lilac: "#E1DAF0", lilac2: "#CFC3E8", butter: "#FBE7A6", butter2: "#F6D66E",
  ink: "#141816", white: "#FFFFFF", skin: "#7A4A2E", skin2: "#9A6342",
};

/** A band of kente weave: repeating warp stripes with a thin weft line through the middle. */
function Kente({ y, h = 36, w = 400 }: { y: number; h?: number; w?: number }) {
  const unit: [string, number][] = [[C.gold, 14], [C.forest, 8], [C.clay, 4], [C.ink, 4], [C.gold, 6], [C.forest, 4]];
  const rects: React.ReactNode[] = [];
  for (let x = 0, k = 0; x < w; k++) for (const [fill, ww] of unit) { rects.push(<rect key={`${k}-${x}`} x={x} y={y} width={ww} height={h} fill={fill} />); x += ww; }
  return <g>{rects}<rect x="0" y={y + h / 2 - 2} width={w} height="4" fill={C.ink} opacity=".35" /></g>;
}

function Knot({ x, y, size, color, opacity = 1, width = 7 }: { x: number; y: number; size: number; color: string; opacity?: number; width?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${size / 100})`} opacity={opacity}><KnotMark color={color} width={width} /></g>;
}

/** Head-and-shoulders figure; y is the centre of the head. */
function Bust({ x, y, s = 1, skin = C.skin, body, wrap }: { x: number; y: number; s?: number; skin?: string; body: string; wrap?: string }) {
  return (
    <g>
      <rect x={x - 50 * s} y={y + 34 * s} width={100 * s} height={150 * s} rx={50 * s} fill={body} />
      <rect x={x - 11 * s} y={y + 20 * s} width={22 * s} height={22 * s} fill={skin} />
      <circle cx={x} cy={y} r={28 * s} fill={skin} />
      {wrap && <path d={`M${x - 32 * s} ${y - 6 * s}Q${x - 30 * s} ${y - 44 * s} ${x} ${y - 46 * s}Q${x + 36 * s} ${y - 44 * s} ${x + 34 * s} ${y - 10 * s}Q${x + 44 * s} ${y - 30 * s} ${x + 26 * s} ${y - 40 * s}Q${x} ${y - 24 * s} ${x - 32 * s} ${y - 6 * s}Z`} fill={wrap} />}
    </g>
  );
}

function Check({ x, y, s = 1, color = C.white }: { x: number; y: number; s?: number; color?: string }) {
  return <path d={`M${x - 14 * s} ${y}l${10 * s} ${10 * s} ${20 * s}-${22 * s}`} fill="none" stroke={color} strokeWidth={7 * s} strokeLinecap="round" strokeLinejoin="round" />;
}

function Sparkle({ x, y, s = 1, color = C.white }: { x: number; y: number; s?: number; color?: string }) {
  return <path d={`M${x} ${y - 12 * s}Q${x + 2 * s} ${y - 2 * s} ${x + 12 * s} ${y}Q${x + 2 * s} ${y + 2 * s} ${x} ${y + 12 * s}Q${x - 2 * s} ${y + 2 * s} ${x - 12 * s} ${y}Q${x - 2 * s} ${y - 2 * s} ${x} ${y - 12 * s}Z`} fill={color} />;
}

// ---------- side-card scenes (400 × 480) ----------

const SCENES = {
  level: { bg: C.sage, draw: () => (<>
    <circle cx="320" cy="90" r="64" fill={C.butter} />
    {[[40, 330, C.butter2], [120, 270, C.lilac2], [200, 210, C.claySoft], [280, 150, C.white]].map(([x, y, top], i) => (
      <g key={i}><rect x={x as number} y={y as number} width="80" height={444 - (y as number)} rx="14" fill={C.white} /><rect x={x as number} y={y as number} width="80" height="22" rx="11" fill={top as string} /></g>
    ))}
    <rect x="318" y="62" width="5" height="90" rx="2.5" fill={C.ink} /><path d="M323 64h54l-14 18 14 18h-54z" fill={C.clay} />
    <g transform="translate(78 250)"><path d="M0 0l40-18 40 18-40 18z" fill={C.deep} /><path d="M16 8v18c14 10 34 10 48 0V8l-24 10z" fill={C.forest} /><rect x="74" y="2" width="3" height="26" fill={C.gold} /></g>
    <Kente y={444} />
  </>) },
  details: { bg: C.butter, draw: () => (<>
    <Knot x={250} y={-30} size={190} color={C.white} opacity={0.5} />
    <rect x="70" y="120" width="260" height="250" rx="28" fill={C.white} />
    <path d="M70 148a28 28 0 0 1 28-28h204a28 28 0 0 1 28 28v34H70z" fill={C.forest} />
    {[130, 270].map((x) => <rect key={x} x={x - 6} y="100" width="12" height="44" rx="6" fill={C.ink} />)}
    {Array.from({ length: 21 }, (_, i) => { const cx = 104 + (i % 7) * 32, cy = 214 + Math.floor(i / 7) * 46; return i === 10 ? <g key={i}><circle cx={cx} cy={cy} r="18" fill={C.gold} /><circle cx={cx} cy={cy} r="5" fill={C.ink} /></g> : <circle key={i} cx={cx} cy={cy} r="6" fill={C.sage2} />; })}
    <g transform="translate(316 376)"><rect x="-34" y="10" width="68" height="44" rx="10" fill={C.clay} /><rect x="-34" y="10" width="68" height="14" rx="7" fill={C.claySoft} /><rect x="-3" y="-16" width="6" height="26" rx="3" fill={C.white} /><path d="M0-34q9 11 0 18q-9-7 0-18z" fill={C.gold} /></g>
    <Sparkle x={60} y={90} color={C.white} /><Sparkle x={350} y={410} s={0.8} color={C.clay} />
    <Kente y={444} />
  </>) },
  guardian: { bg: C.lilac, draw: () => (<>
    <circle cx="200" cy="200" r="150" fill={C.lilac2} />
    <Knot x={-40} y={300} size={160} color={C.white} opacity={0.45} />
    <Bust x={160} y={180} s={1.25} skin={C.skin} body={C.forest} wrap={C.clay} />
    <Bust x={262} y={262} s={0.85} skin={C.skin2} body={C.gold} />
    <g transform="translate(300 128)"><path d="M0-40l38 14v26c0 26-18 42-38 50C-20 42-38 26-38 0v-26z" fill={C.white} /><Check x={0} y={2} s={1} color={C.forest} /></g>
    <Kente y={444} />
  </>) },
  contact: { bg: C.sage, draw: () => (<>
    <circle cx="90" cy="100" r="56" fill={C.butter} />
    <g transform="rotate(-10 170 250)"><rect x="60" y="180" width="220" height="150" rx="18" fill={C.white} /><path d="M66 192l104 76 104-76" fill="none" stroke={C.forest} strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" /></g>
    <g transform="rotate(8 290 260)"><rect x="240" y="150" width="120" height="220" rx="22" fill={C.ink} /><rect x="250" y="172" width="100" height="168" rx="12" fill={C.butter} /><rect x="262" y="190" width="70" height="26" rx="13" fill={C.white} /><rect x="274" y="226" width="64" height="26" rx="13" fill={C.forest} /><rect x="285" y="354" width="30" height="5" rx="2.5" fill={C.white} opacity=".6" /></g>
    <Sparkle x={330} y={110} color={C.white} /><Sparkle x={70} y={390} s={0.8} color={C.forest} />
    <Kente y={444} />
  </>) },
  code: { bg: C.deep, draw: () => (<>
    <Knot x={150} y={70} size={280} color={C.forest} opacity={0.45} width={5} />
    <rect x="120" y="96" width="160" height="300" rx="30" fill={C.white} />
    <rect x="132" y="120" width="136" height="250" rx="18" fill={C.sage} />
    <rect x="182" y="106" width="36" height="6" rx="3" fill={C.ink} opacity=".25" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={142 + (i % 3) * 40} y={208 + Math.floor(i / 3) * 52} width="32" height="42" rx="10" fill={i < 4 ? C.white : C.sage2} />)}
    {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={158 + (i % 3) * 40} cy={229 + Math.floor(i / 3) * 52} r="6" fill={C.forest} />)}
    <g transform="translate(272 150)"><path d="M0 0h70a18 18 0 0 1 18 18v26a18 18 0 0 1-18 18H20l-16 14v-14a18 18 0 0 1-4-4z" fill={C.gold} /><circle cx="26" cy="31" r="5" fill={C.ink} /><circle cx="44" cy="31" r="5" fill={C.ink} /><circle cx="62" cy="31" r="5" fill={C.ink} /></g>
    <Sparkle x={80} y={120} color={C.gold} /><Sparkle x={330} y={360} s={0.7} color={C.white} />
    <Kente y={444} />
  </>) },
  username: { bg: C.claySoft, draw: () => (<>
    <circle cx="320" cy="110" r="70" fill={C.white} opacity=".7" />
    <g transform="rotate(-6 200 240)"><rect x="70" y="150" width="260" height="170" rx="24" fill={C.white} /><rect x="70" y="150" width="260" height="44" rx="22" fill={C.forest} /><rect x="70" y="172" width="260" height="22" fill={C.forest} />
      <circle cx="130" cy="252" r="36" fill={C.butter} /><Knot x={104} y={226} size={52} color={C.forest} width={9} />
      <rect x="186" y="226" width="110" height="16" rx="8" fill={C.ink} /><rect x="186" y="256" width="80" height="12" rx="6" fill={C.sage2} /><rect x="186" y="280" width="96" height="12" rx="6" fill={C.sage2} /></g>
    <g transform="translate(270 360) rotate(-35)"><circle cx="0" cy="0" r="28" fill="none" stroke={C.gold} strokeWidth="14" /><rect x="24" y="-7" width="92" height="14" rx="7" fill={C.gold} /><rect x="90" y="4" width="12" height="22" rx="4" fill={C.gold} /><rect x="70" y="4" width="10" height="16" rx="4" fill={C.gold} /></g>
    <Sparkle x={70} y={110} color={C.clay} />
    <Kente y={444} />
  </>) },
  family: { bg: C.butter, draw: () => (<>
    <path d="M40 240L200 110l160 130" fill="none" stroke={C.forest} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="200" cy="300" r="160" fill={C.butter2} opacity=".6" />
    <Bust x={130} y={230} s={1.05} skin={C.skin} body={C.forest} wrap={C.clay} />
    <Bust x={272} y={222} s={1.1} skin={C.skin2} body={C.lilac2} />
    <Bust x={204} y={300} s={0.75} skin={C.skin2} body={C.gold} />
    <Sparkle x={330} y={80} color={C.white} /><Sparkle x={60} y={120} s={0.7} color={C.clay} />
    <Kente y={444} />
  </>) },
  signin: { bg: C.lilac, draw: () => (<>
    <Knot x={230} y={20} size={170} color={C.white} opacity={0.5} />
    <path d="M110 444V230a90 90 0 0 1 180 0v214z" fill={C.deep} />
    <path d="M132 444V234a68 68 0 0 1 136 0v210z" fill={C.butter} />
    <path d="M200 166a68 68 0 0 1 68 68v210h-68z" fill={C.butter2} />
    <circle cx="246" cy="320" r="7" fill={C.ink} />
    <path d="M150 444l50-60 50 60z" fill={C.white} opacity=".55" />
    <Sparkle x={70} y={150} color={C.gold} /><Sparkle x={340} y={300} s={0.8} color={C.white} />
    <Kente y={444} />
  </>) },
  approve: { bg: C.sage, draw: () => (<>
    <circle cx="80" cy="90" r="50" fill={C.butter} />
    <path d="M150 300l-30 110 40-20 26 34 24-104z" fill={C.clay} /><path d="M250 300l30 110-40-20-26 34-24-104z" fill={C.gold} />
    {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <circle key={i} cx={200 + Math.cos(a) * 96} cy={220 + Math.sin(a) * 96} r="26" fill={C.forest} />; })}
    <circle cx="200" cy="220" r="100" fill={C.forest} /><circle cx="200" cy="220" r="76" fill="none" stroke={C.white} strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
    <Check x={200} y={214} s={2.2} />
    <Sparkle x={340} y={120} color={C.white} />
    <Kente y={444} />
  </>) },
};
export type ArtKind = keyof typeof SCENES;

/** A full-bleed illustrated card for the side column on wide screens. */
export function Art({ kind }: { kind: ArtKind }) {
  const sc = SCENES[kind];
  return (
    <div className="art" aria-hidden="true">
      <svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice"><rect width="400" height="480" fill={sc.bg} />{sc.draw()}</svg>
    </div>
  );
}

// ---------- welcome slides (400 × 400, drawn on the slide's own colour) ----------

const SLIDES = {
  syllabus: () => (<>
    {[[70, 300, 260, C.forest], [90, 262, 230, C.clay], [60, 224, 250, C.white], [100, 186, 210, C.lilac2]].map(([x, y, w, f], i) => (
      <g key={i}><rect x={x as number} y={y as number} width={w as number} height="38" rx="8" fill={f as string} /><rect x={(x as number) + 16} y={(y as number) + 8} width="6" height="22" rx="3" fill={C.white} opacity=".6" /></g>
    ))}
    <rect x="40" y="338" width="320" height="14" rx="7" fill={C.ink} opacity=".12" />
    <path d="M110 150l40-70 40 70z" fill={C.gold} /><circle cx="250" cy="110" r="36" fill={C.white} /><rect x="292" y="132" width="50" height="50" rx="10" fill={C.forest} transform="rotate(12 317 157)" />
    <text x="250" y="124" textAnchor="middle" fontSize="38" fontWeight="600" fill={C.deep} style={{ fontFamily: "var(--font-outfit), sans-serif" }}>x</text>
    <Sparkle x={60} y={80} color={C.white} /><Sparkle x={350} y={70} s={0.8} color={C.white} />
  </>),
  plan: () => (<>
    <circle cx="310" cy="90" r="50" fill={C.gold} /><circle cx="310" cy="90" r="70" fill={C.gold} opacity=".25" />
    <path d="M40 360C120 360 90 270 170 260S250 300 270 220 300 150 330 150" fill="none" stroke={C.white} strokeWidth="26" strokeLinecap="round" />
    <path d="M40 360C120 360 90 270 170 260S250 300 270 220 300 150 330 150" fill="none" stroke={C.forest} strokeWidth="4" strokeDasharray="2 16" strokeLinecap="round" />
    {[[40, 360, C.forest], [170, 260, C.forest], [270, 220, C.clay]].map(([x, y, f], i) => <g key={i}><circle cx={x as number} cy={y as number} r="18" fill={f as string} /><Check x={x as number} y={(y as number) - 2} s={0.6} /></g>)}
    <rect x="326" y="96" width="6" height="58" rx="3" fill={C.ink} /><path d="M332 98h44l-12 14 12 14h-44z" fill={C.deep} />
    <Sparkle x={80} y={120} color={C.white} />
  </>),
  tutor: () => (<>
    <Knot x={40} y={210} size={150} color={C.white} opacity={0.5} />
    <path d="M60 80h200a30 30 0 0 1 30 30v70a30 30 0 0 1-30 30H120l-36 30v-30H60a30 30 0 0 1-30-30v-70a30 30 0 0 1 30-30z" fill={C.deep} />
    {[110, 160, 210].map((x) => <circle key={x} cx={x} cy="145" r="11" fill={C.gold} />)}
    <path d="M150 230h190a30 30 0 0 1 30 30v60a30 30 0 0 1-30 30h-20v30l-36-30H150a30 30 0 0 1-30-30v-60a30 30 0 0 1 30-30z" fill={C.white} />
    <g transform="translate(245 290)"><circle cx="0" cy="-8" r="26" fill={C.gold} /><rect x="-12" y="16" width="24" height="12" rx="4" fill={C.ink} /><path d="M-8 -6l8 10 8-10" fill="none" stroke={C.deep} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></g>
    {[[-40, -8], [40, -8], [0, -48], [-30, -38], [30, -38]].map(([dx, dy], i) => <rect key={i} x={245 + dx - 2} y={290 + dy - 7} width="4" height="10" rx="2" fill={C.gold} transform={`rotate(${Math.atan2(dy, dx) * 180 / Math.PI + 90} ${245 + dx} ${290 + dy})`} />)}
  </>),
};
export type SlideArtKind = keyof typeof SLIDES;

export function SlideArt({ kind }: { kind: SlideArtKind }) {
  return <svg className="slideart" viewBox="0 0 400 400" aria-hidden="true">{SLIDES[kind]()}</svg>;
}
