import { KnotMark } from "./brand";

/** Spot illustrations in the manner of the Uber app's product art: everyday objects in a three-quarter view,
 *  flat fills with hard edges, each surface shaded in three tones (lit top, mid left face, dark right face),
 *  a warm palette with one cool accent, and no gradients. Drawn in code from a small isometric helper so the
 *  light is the same on every object, and they weigh almost nothing on a phone data plan. */

type Tone = readonly [top: string, left: string, right: string];
const T = {
  forest: ["#1F8A5E", "#0F6B4A", "#0A4F36"],
  gold: ["#FFD36B", "#F2B33D", "#D6952A"],
  clay: ["#F28A66", "#E2603F", "#BF4A2D"],
  sand: ["#F6E7CB", "#E7CFA4", "#CDAE7C"],
  cobalt: ["#7D98F7", "#4A6CE8", "#3350B8"],
  paper: ["#FFFFFF", "#EFF1EC", "#D9DDD5"],
  ink: ["#4A514D", "#2A302C", "#141816"],
  lilac: ["#ECE6F8", "#CFC3E8", "#B2A1D8"],
  sage: ["#E6F0E9", "#C3DBCB", "#A3C4AE"],
} as const satisfies Record<string, Tone>;
const INK = "#141816", SAGE = "#D6E6DC", WHITE = "#FFFFFF";

type V3 = [number, number, number];
/** Isometric projection: x runs right-down, y runs left-down, z runs up. */
const iso = ([x, y, z]: V3): [number, number] => [(x - y) * 0.866, (x + y) * 0.5 - z];
const d = (pts: V3[]) => "M" + pts.map((p) => iso(p).map((n) => n.toFixed(1)).join(" ")).join("L") + "Z";
const Poly = ({ pts, fill, opacity }: { pts: V3[]; fill: string; opacity?: number }) => <path d={d(pts)} fill={fill} opacity={opacity} />;

/** Flat rectangles on the three visible planes: the ground plane (top), the left face (y fixed), the right face (x fixed). */
const onTop = (x: number, y: number, z: number, w: number, dd: number): V3[] => [[x, y, z], [x + w, y, z], [x + w, y + dd, z], [x, y + dd, z]];
const onLeft = (x: number, y: number, z: number, w: number, h: number): V3[] => [[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]];
const onRight = (x: number, y: number, z: number, dd: number, h: number): V3[] => [[x, y, z], [x, y + dd, z], [x, y + dd, z + h], [x, y, z + h]];

function Box({ x, y, z = 0, w, dd, h, tone, sides }: { x: number; y: number; z?: number; w: number; dd: number; h: number; tone: Tone; sides?: Tone }) {
  const s = sides ?? tone;
  return (
    <g>
      <Poly pts={onLeft(x, y + dd, z, w, h)} fill={s[1]} />
      <Poly pts={onRight(x + w, y, z, dd, h)} fill={s[2]} />
      <Poly pts={onTop(x, y, z + h, w, dd)} fill={tone[0]} />
    </g>
  );
}
/** Soft cast shadow on the ground, pushed away from the light. */
const Shadow = ({ x, y, w, dd }: { x: number; y: number; w: number; dd: number }) => <Poly pts={onTop(x + 10, y + 10, 0, w, dd)} fill={INK} opacity={0.1} />;
/** A polyline on one of the planes, e.g. a tick on a screen. */
function Stroke({ pts, color, width = 6 }: { pts: V3[]; color: string; width?: number }) {
  return <path d={"M" + pts.map((p) => iso(p).join(" ")).join("L")} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
}

// ---------- objects ----------

/** A book lying flat: cover on top and spine side, pages showing on the left face. */
function Book({ x, y, z, w, dd, h, tone }: { x: number; y: number; z: number; w: number; dd: number; h: number; tone: Tone }) {
  return (
    <g>
      <Box x={x} y={y} z={z} w={w} dd={dd} h={h} tone={tone} />
      <Poly pts={onLeft(x + 4, y + dd, z + 3, w - 8, h - 6)} fill={T.paper[1]} />
      {[0.33, 0.66].map((f) => <Poly key={f} pts={onLeft(x + 4, y + dd, z + 3 + (h - 6) * f, w - 8, 1.2)} fill={T.paper[2]} />)}
    </g>
  );
}
/** A phone standing up, screen facing left. */
function StandingPhone({ x, y, w = 64, h = 124, screen }: { x: number; y: number; w?: number; h?: number; screen?: React.ReactNode }) {
  return (
    <g>
      <Shadow x={x} y={y} w={w} dd={10} />
      <Box x={x} y={y} w={w} dd={8} h={h} tone={T.ink} />
      <Poly pts={onLeft(x + 5, y + 8, 12, w - 10, h - 22)} fill={SAGE} />
      <Poly pts={onLeft(x + w / 2 - 8, y + 8, h - 7, 16, 3)} fill={T.ink[0]} />
      {screen}
    </g>
  );
}
function Pencil({ x, y, z, len = 150 }: { x: number; y: number; z: number; len?: number }) {
  return (
    <g>
      <Box x={x} y={y} z={z} w={len} dd={10} h={10} tone={T.gold} />
      <Box x={x - 14} y={y} z={z} w={14} dd={10} h={10} tone={T.clay} />
      <Poly pts={[[x + len, y, z], [x + len + 22, y + 5, z + 5], [x + len, y + 10, z + 10], [x + len, y + 10, z]]} fill={T.sand[1]} />
      <Poly pts={[[x + len, y, z + 10], [x + len + 22, y + 5, z + 5], [x + len, y + 10, z + 10]]} fill={T.sand[0]} />
    </g>
  );
}
/** A flat, front-on badge or bubble placed in screen space (Uber's spot art mixes these with the 3D objects). */
function Bubble({ cx, cy, w, h, fill, tail = "left", children }: { cx: number; cy: number; w: number; h: number; fill: string; tail?: "left" | "right"; children?: React.ReactNode }) {
  const x = cx - w / 2, y = cy - h / 2, tx = tail === "left" ? x + 22 : x + w - 22;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2.4} fill={fill} />
      <path d={`M${tx - 10} ${y + h - 2}L${tx + (tail === "left" ? -6 : 6)} ${y + h + 18}L${tx + 12} ${y + h - 2}Z`} fill={fill} />
      {children}
    </g>
  );
}
function Seal({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g>
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={r * 0.3} fill={fill} />; })}
      <circle cx={cx} cy={cy} r={r * 1.02} fill={fill} />
      <path d={`M${cx - r * 0.42} ${cy + r * 0.02}l${r * 0.3} ${r * 0.3} ${r * 0.56}-${r * 0.62}`} fill="none" stroke={WHITE} strokeWidth={r * 0.2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// ---------- side-card scenes (400 × 480): each is drawn around an origin near the card centre ----------

const SCENES: Record<string, { bg: string; spot: string; draw: () => React.ReactNode }> = {
  /** A desk calendar with a ringed date, and a slice of birthday cake. */
  details: { bg: "#FBE7A6", spot: "#F6D66E", draw: () => (<>
    <Shadow x={-70} y={-10} w={140} dd={44} />
    <Poly pts={[[-70, 30, 0], [70, 30, 0], [70, -10, 150], [-70, -10, 150]]} fill={T.paper[1]} />
    <Poly pts={[[70, 30, 0], [70, -40, 0], [70, -10, 150]]} fill={T.paper[2]} />
    <Poly pts={[[-62, 26.5, 18], [62, 26.5, 18], [62, 6.5, 118], [-62, 6.5, 118]]} fill={WHITE} />
    <Poly pts={[[-70, 1, 125], [70, 1, 125], [70, -10, 150], [-70, -10, 150]]} fill={T.forest[1]} />
    {[-40, 40].map((x) => <Box key={x} x={x - 4} y={-14} z={146} w={8} dd={8} h={16} tone={T.ink} />)}
    {Array.from({ length: 15 }, (_, i) => {
      const cx = -48 + (i % 5) * 24, row = Math.floor(i / 5), z = 92 - row * 26, yy = 30 - (z / 150) * 40 - 2;
      return <Poly key={i} pts={onLeft(cx - 7, yy, z, 14, 12)} fill={i === 7 ? T.clay[1] : T.sage[1]} />;
    })}
    <g transform="translate(96 46)">
      <Shadow x={0} y={0} w={60} dd={46} />
      <Box x={0} y={0} w={60} dd={46} h={26} tone={T.sand} />
      <Box x={0} y={0} z={26} w={60} dd={46} h={8} tone={T.clay} />
      <Box x={0} y={0} z={34} w={60} dd={46} h={18} tone={T.sand} />
      <Box x={0} y={0} z={52} w={60} dd={46} h={6} tone={T.paper} />
      <Box x={26} y={20} z={58} w={6} dd={6} h={28} tone={T.cobalt} />
      <path d={(() => { const [fx, fy] = iso([29, 23, 92]); return `M${fx} ${fy - 16}q9 10 0 16q-9-6 0-16z`; })()} fill="#F2B33D" />
    </g>
  </>) },
  /** A school backpack beside a phone showing a parent's approval tick. */
  guardian: { bg: "#E1DAF0", spot: "#CFC3E8", draw: () => (<>
    <Shadow x={-110} y={-10} w={90} dd={56} />
    <Box x={-110} y={-10} w={90} dd={56} h={120} tone={T.clay} />
    <Box x={-96} y={46} z={14} w={62} dd={14} h={54} tone={T.clay} sides={[T.clay[0], "#CF5434", T.clay[2]]} />
    <Poly pts={onLeft(-96, 60, 58, 62, 6)} fill={T.gold[1]} />
    {[-100, -38].map((x) => <Poly key={x} pts={onLeft(x, 46.5, 20, 10, 96)} fill={T.clay[2]} />)}
    <path d={(() => { const a = iso([-80, 18, 120]), b = iso([-50, 18, 120]); return `M${a[0]} ${a[1]}Q${(a[0] + b[0]) / 2} ${a[1] - 46} ${b[0]} ${b[1]}`; })()} fill="none" stroke={T.clay[2]} strokeWidth="9" strokeLinecap="round" />
    <StandingPhone x={30} y={10} screen={<>
      <Poly pts={onLeft(44, 18, 48, 36, 36)} fill={T.forest[1]} />
      <Stroke pts={[[50, 18, 66], [58, 18, 58], [74, 18, 76]]} color={WHITE} />
      <Poly pts={onLeft(40, 18, 30, 44, 6)} fill={T.sage[2]} />
    </>} />
    <Bubble cx={112} cy={-176} w={92} h={50} fill="#0F6B4A" tail="left"><g transform="translate(112 -178)"><path d="M-14 0l8 8 18-18" fill="none" stroke={WHITE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></g></Bubble>
  </>) },
  /** An envelope on the table and a phone with a new message. */
  contact: { bg: "#D6E6DC", spot: "#C3DBCB", draw: () => (<>
    <Shadow x={-100} y={20} w={150} dd={100} />
    <Box x={-100} y={20} w={150} dd={100} h={6} tone={T.paper} />
    <Stroke pts={[[-96, 24, 6], [-25, 74, 6], [46, 24, 6]]} color={T.forest[1]} width={7} />
    <Stroke pts={[[-96, 116, 6], [-40, 80, 6]]} color={T.paper[2]} width={4} />
    <Stroke pts={[[46, 116, 6], [-10, 80, 6]]} color={T.paper[2]} width={4} />
    <StandingPhone x={60} y={-40} screen={<>
      <Poly pts={onLeft(70, -32, 84, 40, 14)} fill={WHITE} />
      <Poly pts={onLeft(78, -32, 62, 40, 14)} fill={T.forest[1]} />
      <Poly pts={onLeft(70, -32, 40, 30, 14)} fill={WHITE} />
    </>} />
    <circle cx="-110" cy="-170" r="28" fill="#F2B33D" />
  </>) },
  /** A phone lying flat with a six-digit code, and a padlock that has just opened. */
  code: { bg: "#0A3F2C", spot: "#0F6B4A", draw: () => (<>
    <g transform="translate(40 -20)"><Shadow x={-90} y={-60} w={110} dd={190} />
    <Box x={-90} y={-60} w={110} dd={190} h={12} tone={T.ink} />
    <Poly pts={onTop(-82, -48, 12, 94, 166)} fill={SAGE} />
    {Array.from({ length: 6 }, (_, i) => <Box key={i} x={-74 + (i % 2) * 42} y={-30 + Math.floor(i / 2) * 44} z={12} w={36} dd={34} h={4} tone={i < 4 ? T.paper : T.sage} />)}
    {Array.from({ length: 4 }, (_, i) => <Poly key={i} pts={onTop(-62 + (i % 2) * 42, -18 + Math.floor(i / 2) * 44, 16, 12, 10)} fill={T.forest[1]} />)}</g>
    <g transform="translate(112 -40)">
      <Shadow x={0} y={0} w={70} dd={40} />
      <path d={(() => { const a = iso([14, 20, 64]), b = iso([56, 20, 64]); return `M${a[0]} ${a[1]}V${a[1] - 34}a${(b[0] - a[0]) / 2} ${(b[0] - a[0]) / 2} 0 0 1 ${b[0] - a[0]} ${b[1] - a[1] - 10}V${b[1] - 40}`; })()} fill="none" stroke="#C7CCC8" strokeWidth="12" strokeLinecap="round" transform="translate(0 -14)" />
      <Box x={0} y={0} w={70} dd={40} h={64} tone={T.gold} />
      <Poly pts={onLeft(30, 40, 22, 10, 22)} fill={T.gold[2]} />
    </g>
  </>) },
  /** A student ID card on a lanyard and a key. */
  username: { bg: "#F9DDD4", spot: "#F2C9BB", draw: () => (<>
    <path d={(() => { const a = iso([-60, 0, 210]), b = iso([60, 0, 210]), m = iso([0, 0, 168]); return `M${a[0]} ${a[1] - 70}L${m[0]} ${m[1]}L${b[0]} ${b[1] - 70}`; })()} fill="none" stroke="#4A6CE8" strokeWidth="10" strokeLinejoin="round" />
    <Shadow x={-70} y={-6} w={140} dd={12} />
    <Box x={-70} y={-6} w={140} dd={8} h={170} tone={T.paper} />
    <Poly pts={onLeft(-70, 2, 132, 140, 38)} fill={T.forest[1]} />
    <Box x={-12} y={-4} z={158} w={24} dd={10} h={20} tone={T.ink} />
    <Poly pts={onLeft(-48, 2, 64, 54, 56)} fill="#FBE7A6" />
    {[[14, 104, 44, INK], [14, 86, 34, T.sage[2]], [14, 70, 40, T.sage[2]]].map(([x, z, w, f], i) => <Poly key={i} pts={onLeft(x as number, 2, z as number, w as number, 8)} fill={f as string} />)}
    <g transform="translate(-21 -18)">{(() => { const [cx, cy] = iso([-21, 2, 92]); return <g transform={`translate(${cx + 21} ${cy + 18}) scale(.36) translate(-50 -50)`}><KnotMark color="#0F6B4A" width={10} /></g>; })()}</g>
    <g transform="translate(30 24)">
      <Shadow x={0} y={0} w={120} dd={36} />
      <ellipse cx={iso([18, 18, 6])[0]} cy={iso([18, 18, 6])[1]} rx="30" ry="18" fill="none" stroke="#D6952A" strokeWidth="14" />
      <ellipse cx={iso([18, 18, 8])[0]} cy={iso([18, 18, 8])[1]} rx="30" ry="18" fill="none" stroke="#F2B33D" strokeWidth="11" />
      <Box x={40} y={12} w={86} dd={12} h={8} tone={T.gold} />
      <Box x={100} y={24} w={12} dd={14} h={8} tone={T.gold} />
      <Box x={80} y={24} w={10} dd={10} h={8} tone={T.gold} />
    </g>
  </>) },
  /** A small house with a garden tree: home, where the parent's account lives. */
  family: { bg: "#FBE7A6", spot: "#F6D66E", draw: () => (<>
    <Shadow x={-90} y={-60} w={150} dd={120} />
    <Box x={-90} y={-60} w={150} dd={120} h={90} tone={T.sand} />
    <Poly pts={[[-96, 66, 88], [66, 66, 88], [66, 0, 150], [-96, 0, 150]]} fill={T.clay[1]} />
    <Poly pts={[[60, -60, 90], [60, 60, 90], [60, 0, 146]]} fill={T.sand[2]} />
    <Poly pts={[[66, 66, 88], [66, 0, 150], [66, -66, 88], [70, -66, 86], [70, 0, 148]]} fill={T.clay[2]} />
    <Poly pts={onLeft(-40, 60, 0, 34, 56)} fill={T.forest[1]} />
    <Poly pts={onLeft(-14, 60, 26, 4, 6)} fill={T.gold[1]} />
    <Poly pts={onLeft(10, 60, 36, 32, 30)} fill={WHITE} /><Poly pts={onLeft(24, 60, 36, 3, 30)} fill={T.sand[2]} />
    <Poly pts={onRight(60, -30, 40, 40, 28)} fill={T.cobalt[0]} />
    <g transform="translate(-150 40)">
      <Shadow x={0} y={0} w={20} dd={20} />
      <Box x={0} y={0} w={14} dd={14} h={60} tone={T.sand} sides={["#B88A55", "#9C7444", "#7E5C35"]} />
      {(() => { const [cx, cy] = iso([7, 7, 100]); return <g><circle cx={cx} cy={cy} r="44" fill="#0F6B4A" /><path d={`M${cx} ${cy - 44}a44 44 0 0 1 0 88z`} fill="#0A4F36" /></g>; })()}
    </g>
  </>) },
  /** An open padlock and its key. */
  signin: { bg: "#E1DAF0", spot: "#CFC3E8", draw: () => (<>
    <g transform="translate(-40 0)">
      <Shadow x={-50} y={-30} w={100} dd={60} />
      {(() => { const a = iso([-30, 0, 84]), b = iso([30, 0, 84]); const r = (b[0] - a[0]) / 2; return <path d={`M${a[0]} ${a[1]}V${a[1] - 50}a${r} ${r} 0 0 1 ${2 * r} 0V${a[1] - 70}`} fill="none" stroke="#B8BDB9" strokeWidth="16" strokeLinecap="round" transform="translate(-6 -30)" />; })()}
      <Box x={-50} y={-30} w={100} dd={60} h={90} tone={T.cobalt} />
      <Poly pts={onLeft(-8, 30, 30, 16, 30)} fill={T.cobalt[2]} />
    </g>
    <g transform="translate(36 30)">
      <Shadow x={0} y={0} w={110} dd={30} />
      <ellipse cx={iso([14, 14, 6])[0]} cy={iso([14, 14, 6])[1]} rx="26" ry="15" fill="none" stroke="#D6952A" strokeWidth="12" />
      <ellipse cx={iso([14, 14, 8])[0]} cy={iso([14, 14, 8])[1]} rx="26" ry="15" fill="none" stroke="#F2B33D" strokeWidth="9" />
      <Box x={34} y={9} w={76} dd={10} h={7} tone={T.gold} />
      <Box x={90} y={19} w={10} dd={12} h={7} tone={T.gold} />
    </g>
  </>) },
  /** A signed form on a clipboard with an approval seal, and a pen. */
  approve: { bg: "#D6E6DC", spot: "#C3DBCB", draw: () => (<>
    <Shadow x={-70} y={-10} w={140} dd={14} />
    <Box x={-70} y={-10} w={140} dd={10} h={190} tone={T.sand} />
    <Poly pts={onLeft(-58, 0, 14, 116, 150)} fill={WHITE} />
    <Box x={-26} y={-12} z={176} w={52} dd={14} h={22} tone={T.ink} />
    {[150, 130, 110, 90].map((z, i) => <Poly key={z} pts={onLeft(-46, 0, z, i % 2 ? 60 : 84, 7)} fill={T.sage[2]} />)}
    <Stroke pts={[[-46, 0, 44], [-30, 0, 54], [-18, 0, 40], [0, 0, 52]]} color="#4A6CE8" width={4} />
    <Seal cx={iso([36, 0, 52])[0]} cy={iso([36, 0, 52])[1]} r={30} fill="#0F6B4A" />
    <g transform="translate(-10 34)"><Box x={0} y={0} w={120} dd={9} h={9} tone={T.cobalt} /><Poly pts={[[120, 0, 0], [138, 4.5, 4.5], [120, 9, 9], [120, 9, 0]]} fill={T.ink[1]} /><Box x={-10} y={0} w={10} dd={9} h={9} tone={T.ink} /></g>
  </>) },
};
export type ArtKind = "details" | "guardian" | "contact" | "code" | "username" | "family" | "signin" | "approve";

/** Where each scene sits on its card: measured from the drawing's extent so it is centred with a margin and
 *  never runs off the edge. Re-measure (getBBox on the inner group) after changing a scene. */
const FIT: Record<ArtKind, string> = {"details": "translate(164 287) scale(1.24)", "guardian": "translate(188 308) scale(1.08)", "contact": "translate(222 285) scale(0.95)", "code": "translate(189 277) scale(0.98)", "username": "translate(170 323) scale(0.88)", "family": "translate(238 301) scale(1.01)", "signin": "translate(186 292) scale(1.18)", "approve": "translate(176 308) scale(1.12)"};

/** A full-bleed illustrated card for the side column on wide screens. */
export function Art({ kind }: { kind: ArtKind }) {
  const sc = SCENES[kind];
  return (
    <div className="art" aria-hidden="true">
      <svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="480" fill={sc.bg} />
        <circle cx="200" cy="250" r="150" fill={sc.spot} />
        <g transform={FIT[kind]}>{sc.draw()}</g>
      </svg>
    </div>
  );
}

// ---------- welcome slides (400 × 400, on the slide's own colour) ----------

const SLIDES = {
  /** A stack of textbooks with a pencil across the top. */
  syllabus: () => (<>
    <Shadow x={-120} y={-50} w={200} dd={120} />
    <Book x={-110} y={-44} z={0} w={190} dd={112} h={26} tone={T.forest} />
    <Book x={-120} y={-36} z={26} w={180} dd={104} h={24} tone={T.clay} />
    <Book x={-96} y={-50} z={50} w={170} dd={110} h={22} tone={T.cobalt} />
    <Poly pts={onTop(-60, -30, 72.5, 90, 70)} fill={T.cobalt[0]} />
    <Poly pts={onTop(-44, -16, 73, 58, 10)} fill={WHITE} opacity={0.7} />
    <Pencil x={-70} y={40} z={72} len={140} />
  </>),
  /** A week planner with ticked days and an alarm clock. */
  plan: () => (<>
    <Shadow x={-130} y={-70} w={190} dd={140} />
    <Box x={-130} y={-70} w={190} dd={140} h={8} tone={T.paper} />
    {Array.from({ length: 5 }, (_, i) => (
      <g key={i}>
        <Box x={-114} y={-56 + i * 26} z={8} w={20} dd={18} h={3} tone={i < 3 ? T.forest : T.sage} />
        {i < 3 && <Stroke pts={[[-110, -44 + i * 26, 11], [-104, -40 + i * 26, 11], [-96, -50 + i * 26, 11]]} color={WHITE} width={3.5} />}
        <Poly pts={onTop(-84, -52 + i * 26, 8.5, i % 2 ? 90 : 120, 10)} fill={T.sage[1]} />
      </g>
    ))}
    {(() => { const [cx, cy] = iso([100, 10, 70]); return (
      <g>
        <ellipse cx={cx + 14} cy={cy + 74} rx="54" ry="16" fill={INK} opacity=".1" />
        {[-34, 34].map((dx) => <circle key={dx} cx={cx + dx} cy={cy - 52} r="16" fill="#BF4A2D" />)}
        <circle cx={cx + 6} cy={cy + 4} r="62" fill="#BF4A2D" />
        <circle cx={cx} cy={cy} r="62" fill="#E2603F" />
        <circle cx={cx} cy={cy} r="48" fill={WHITE} />
        <path d={`M${cx} ${cy}V${cy - 30}M${cx} ${cy}L${cx + 22} ${cy + 10}`} stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill={INK} />
        {[-26, 26].map((dx) => <path key={dx} d={`M${cx + dx * 0.8} ${cy + 56}l${dx * 0.4} 18`} stroke="#BF4A2D" strokeWidth="8" strokeLinecap="round" />)}
      </g>
    ); })()}
  </>),
  /** An open laptop with the tutor chatting on screen. */
  tutor: () => (<>
    <Shadow x={-110} y={-40} w={200} dd={130} />
    <Box x={-110} y={-40} w={200} dd={130} h={10} tone={T.ink} sides={[T.ink[0], "#3A403C", T.ink[2]]} />
    <Poly pts={onTop(-96, -6, 10, 172, 70)} fill={T.ink[1]} />
    <Poly pts={onTop(-36, 66, 10, 52, 18)} fill={T.ink[2]} />
    <Box x={-110} y={-48} z={10} w={200} dd={8} h={140} tone={T.ink} />
    <Poly pts={onLeft(-102, -40, 20, 184, 122)} fill={SAGE} />
    <Poly pts={onLeft(-90, -40, 104, 110, 22)} fill="#0F6B4A" />
    <Poly pts={onLeft(-20, -40, 70, 98, 22)} fill={WHITE} />
    <Poly pts={onLeft(-90, -40, 36, 80, 22)} fill="#0F6B4A" />
    <Bubble cx={126} cy={-170} w={96} h={56} fill="#F2B33D" tail="left">
      <g transform="translate(126 -172)"><circle r="11" cy="-4" fill={WHITE} /><rect x="-6" y="8" width="12" height="6" rx="2" fill={INK} /></g>
    </Bubble>
  </>),
};
export type SlideArtKind = keyof typeof SLIDES;

/** Same idea as FIT, for the 400 × 400 welcome slides. */
const SLIDE_FIT: Record<SlideArtKind, string> = {"syllabus": "translate(230 241) scale(1.19)", "plan": "translate(214 222) scale(1.03)", "tutor": "translate(200 266) scale(0.95)"};

export function SlideArt({ kind }: { kind: SlideArtKind }) {
  return <svg className="slideart" viewBox="0 0 400 400" aria-hidden="true"><g transform={SLIDE_FIT[kind]}>{SLIDES[kind]()}</g></svg>;
}
