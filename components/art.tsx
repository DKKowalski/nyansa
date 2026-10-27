import { useId } from "react";
import { KnotMark } from "./brand";

/** Illustrations in the style of Uber's brand art: flat shapes, no outlines, faceless people with long limbs,
 *  big hands and feet and small heads, oversized everyday objects, flat shadows and a light grain.
 *  Drawn as SVG so they stay sharp and weigh almost nothing on a phone data plan. */

const C = {
  forest: "#0F6B4A", deep: "#0A3F2C", leaf: "#2E9E5B", gold: "#F2B33D", clay: "#E2603F", claySoft: "#F9DDD4",
  sage: "#D6E6DC", sage2: "#C3DBCB", lilac: "#E1DAF0", lilac2: "#CFC3E8", butter: "#FBE7A6", butter2: "#F6D66E",
  ink: "#141816", ink2: "#2A302C", white: "#FFFFFF", paper: "#F7F8F5",
  skin1: "#6B3F26", skin2: "#8A5434", skin3: "#A8704A",
};

type P = [number, number];
type Limb = [P, P, P];

/** One person. Coordinates are relative to the hips; y grows downward. Limbs are hip→knee→foot and
 *  shoulder→elbow→hand; the first of each pair is drawn behind the body. */
function Person({ x, y, s = 1, skin, top, bottom, shoe = C.ink, hair = C.ink, wrap, stole, legs, arms, dir = 1, holding }: {
  x: number; y: number; s?: number; skin: string; top: string; bottom: string; shoe?: string; hair?: string; wrap?: string;
  stole?: boolean; legs: [Limb, Limb]; arms: [Limb, Limb]; dir?: 1 | -1; holding?: React.ReactNode;
}) {
  const line = (l: Limb) => `M${l[0][0]} ${l[0][1]}L${l[1][0]} ${l[1][1]}L${l[2][0]} ${l[2][1]}`;
  const leg = (l: Limb, k: string) => (
    <g key={k}>
      <path d={line(l)} fill="none" stroke={bottom} strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={l[2][0] + 9 * dir} cy={l[2][1] + 8} rx="21" ry="10" fill={shoe} />
    </g>
  );
  const arm = (l: Limb, k: string) => (
    <g key={k}>
      <path d={line(l)} fill="none" stroke={top} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={l[2][0]} cy={l[2][1]} r="11" fill={skin} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {arm(arms[0], "a0")}
      {leg(legs[0], "l0")}
      <path d="M-23 4L-29-78Q-30-94-14-94H14Q30-94 29-78L23 4Z" fill={top} />
      <path d="M8-94H14Q30-94 29-78L23 4H4Z" fill={C.ink} opacity=".12" />
      {stole && <g><path d="M-18-94L-6-94L-2 4L-14 4Z" fill={C.gold} /><path d="M-15-60H-3M-14-30H-2M-13-2H-1" stroke={C.forest} strokeWidth="5" /><path d="M-12-80H-4" stroke={C.clay} strokeWidth="4" /></g>}
      {leg(legs[1], "l1")}
      <rect x="-7" y="-108" width="14" height="18" fill={skin} />
      <circle cx={2 * dir} cy="-124" r="18" fill={skin} />
      {wrap
        ? <path d={`M-20-126Q-22-154 2-156Q26-156 24-128Q34-146 18-152Q4-140-20-126Z`} fill={wrap} transform={dir === -1 ? "scale(-1 1)" : undefined} />
        : <path d="M-18-128Q-18-146 2-146Q22-146 20-128Q12-138 2-138Q-10-138-18-128Z" fill={hair} />}
      {arm(arms[1], "a1")}
      {holding}
    </g>
  );
}

const STAND_LEGS: [Limb, Limb] = [[[-10, 0], [-12, 62], [-14, 120]], [[10, 0], [12, 62], [16, 120]]];
const WALK_LEGS: [Limb, Limb] = [[[-8, 0], [-30, 58], [-50, 112]], [[8, 0], [30, 54], [34, 120]]];
const SIT_LEGS: [Limb, Limb] = [[[-4, 0], [52, 2], [58, 64]], [[8, 0], [64, -2], [72, 62]]];
const ARM_DOWN_L: Limb = [[-22, -84], [-32, -42], [-30, -4]];
const ARM_DOWN_R: Limb = [[22, -84], [32, -42], [30, -4]];

function Shadow({ x, y, w = 70 }: { x: number; y: number; w?: number }) {
  return <ellipse cx={x} cy={y} rx={w} ry="10" fill={C.ink} opacity=".12" />;
}
function Phone({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><rect x="-13" y="-24" width="26" height="46" rx="6" fill={C.ink} /><rect x="-9" y="-18" width="18" height="32" rx="3" fill={C.sage} /></g>;
}
function Check({ x, y, s = 1, color = C.white }: { x: number; y: number; s?: number; color?: string }) {
  return <path d={`M${x - 14 * s} ${y}l${10 * s} ${10 * s} ${20 * s}-${22 * s}`} fill="none" stroke={color} strokeWidth={7 * s} strokeLinecap="round" strokeLinejoin="round" />;
}
function Knot({ x, y, size, color, opacity = 1, width = 7 }: { x: number; y: number; size: number; color: string; opacity?: number; width?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${size / 100})`} opacity={opacity}><KnotMark color={color} width={width} /></g>;
}
/** Light film grain over the whole scene. */
function Grain({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="table" tableValues="0 0.09" /></feComponentTransfer>
      </filter>
      <rect width={w} height={h} filter={`url(#${id})`} />
    </>
  );
}

// ---------- side-card scenes (400 × 480) ----------

const FLOOR = (fill: string) => <path d="M0 410Q200 380 400 410V480H0Z" fill={fill} />;

const SCENES = {
  /** A student points at their birthday on a calendar taller than they are. */
  details: { bg: C.butter, draw: () => (<>
    {FLOOR(C.butter2)}
    <rect x="186" y="96" width="176" height="300" rx="14" fill={C.white} />
    <rect x="186" y="96" width="176" height="60" rx="14" fill={C.forest} /><rect x="186" y="136" width="176" height="20" fill={C.forest} />
    {[226, 322].map((cx) => <rect key={cx} x={cx - 7} y="78" width="14" height="40" rx="7" fill={C.ink} />)}
    {Array.from({ length: 20 }, (_, i) => { const cx = 214 + (i % 5) * 30, cy = 186 + Math.floor(i / 5) * 48; return i === 12 ? <circle key={i} cx={cx} cy={cy} r="17" fill={C.clay} /> : <rect key={i} x={cx - 8} y={cy - 8} width="16" height="16" rx="4" fill={C.sage2} />; })}
    <path d="M362 396L380 410H190L186 396Z" fill={C.ink} opacity=".1" />
    <Shadow x={110} y={412} />
    <Person x={110} y={292} skin={C.skin2} top={C.ink} bottom={C.forest} legs={STAND_LEGS} stole
      arms={[ARM_DOWN_L, [[22, -84], [62, -112], [128, -112]]]} />
  </>) },
  /** A parent with a hand on their child's shoulder; the child holds up a phone. */
  guardian: { bg: C.lilac, draw: () => (<>
    {FLOOR(C.lilac2)}
    <Knot x={250} y={40} size={120} color={C.white} opacity={0.6} />
    <Shadow x={150} y={412} w={80} /><Shadow x={268} y={414} w={56} />
    <Person x={268} y={330} s={0.72} skin={C.skin3} top={C.gold} bottom={C.ink} legs={STAND_LEGS}
      arms={[ARM_DOWN_L, [[22, -84], [40, -50], [30, -96]]]} holding={<Phone x={28} y={-112} s={1.25} />} />
    <Person x={150} y={290} s={1.02} skin={C.skin1} top={C.forest} bottom={C.ink2} wrap={C.clay} legs={STAND_LEGS}
      arms={[ARM_DOWN_L, [[22, -84], [66, -66], [100, -22]]]} />
  </>) },
  /** Someone walks along with their phone, an oversized envelope behind them. */
  contact: { bg: C.sage, draw: () => (<>
    {FLOOR(C.sage2)}
    <g transform="rotate(-8 270 200)"><rect x="170" y="120" width="200" height="140" rx="16" fill={C.white} /><path d="M176 132l94 70 94-70" fill="none" stroke={C.forest} strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" /></g>
    <circle cx="90" cy="96" r="34" fill={C.gold} />
    <Shadow x={160} y={414} w={80} />
    <Person x={160} y={292} skin={C.skin2} top={C.clay} bottom={C.ink} legs={WALK_LEGS}
      arms={[[[-22, -84], [-44, -44], [-56, -10]], [[22, -84], [44, -60], [36, -108]]]} holding={<Phone x={34} y={-124} r={8} s={1.3} />} />
  </>) },
  /** A door-sized phone showing the code; a student leans in to read it. */
  code: { bg: C.deep, draw: () => (<>
    {FLOOR(C.forest)}
    <Knot x={20} y={40} size={140} color={C.forest} opacity={0.9} width={6} />
    <rect x="200" y="70" width="160" height="330" rx="28" fill={C.ink} />
    <rect x="212" y="94" width="136" height="280" rx="16" fill={C.sage} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={222 + (i % 3) * 42} y={180 + Math.floor(i / 3) * 56} width="34" height="44" rx="10" fill={i < 4 ? C.white : C.sage2} />)}
    {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={239 + (i % 3) * 42} cy={202 + Math.floor(i / 3) * 56} r="6" fill={C.forest} />)}
    <rect x="236" y="120" width="88" height="22" rx="11" fill={C.gold} />
    <Shadow x={120} y={414} />
    <Person x={120} y={292} skin={C.skin3} top={C.gold} bottom={C.white} shoe={C.ink} legs={STAND_LEGS}
      arms={[ARM_DOWN_L, [[22, -84], [56, -98], [92, -122]]]} />
  </>) },
  /** A student carries a giant key over their shoulder past their ID card. */
  username: { bg: C.claySoft, draw: () => (<>
    {FLOOR("#F2C9BB")}
    <g transform="rotate(5 290 180)"><rect x="200" y="100" width="170" height="210" rx="18" fill={C.white} /><rect x="200" y="100" width="170" height="46" rx="18" fill={C.forest} /><rect x="200" y="126" width="170" height="20" fill={C.forest} />
      <circle cx="285" cy="200" r="34" fill={C.butter} /><Knot x={261} y={176} size={48} color={C.forest} width={9} />
      <rect x="236" y="250" width="98" height="14" rx="7" fill={C.ink} /><rect x="250" y="274" width="70" height="10" rx="5" fill={C.sage2} /></g>
    <Shadow x={130} y={414} />
    <Person x={130} y={292} skin={C.skin1} top={C.lilac2} bottom={C.ink} legs={WALK_LEGS} dir={1}
      arms={[ARM_DOWN_L, [[22, -84], [44, -110], [20, -128]]]}
      holding={<g transform="translate(18 -132) rotate(-28)"><circle cx="-34" cy="0" r="24" fill="none" stroke={C.gold} strokeWidth="13" /><rect x="-12" y="-7" width="110" height="14" rx="7" fill={C.gold} /><rect x="78" y="4" width="12" height="22" rx="4" fill={C.gold} /><rect x="58" y="4" width="10" height="16" rx="4" fill={C.gold} /></g>} />
  </>) },
  /** A parent walks hand in hand with one child while another runs ahead. */
  family: { bg: C.butter, draw: () => (<>
    {FLOOR(C.butter2)}
    <path d="M60 230L200 120l140 110v170H60z" fill={C.white} opacity=".55" />
    <path d="M40 240L200 112l160 128" fill="none" stroke={C.forest} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    <Shadow x={130} y={414} w={78} /><Shadow x={230} y={414} w={50} /><Shadow x={310} y={414} w={44} />
    <Person x={310} y={350} s={0.6} skin={C.skin3} top={C.clay} bottom={C.ink} legs={WALK_LEGS} arms={[[[-22, -84], [-46, -60], [-64, -70]], [[22, -84], [46, -64], [64, -84]]]} />
    <Person x={228} y={340} s={0.66} skin={C.skin2} top={C.gold} bottom={C.ink2} legs={WALK_LEGS} arms={[[[-22, -84], [-50, -60], [-120, -60]], ARM_DOWN_R]} />
    <Person x={130} y={292} skin={C.skin1} top={C.forest} bottom={C.ink} wrap={C.clay} stole legs={WALK_LEGS} arms={[ARM_DOWN_L, [[22, -84], [46, -50], [74, -46]]]} />
  </>) },
  /** Someone steps through a tall open doorway into warm light. */
  signin: { bg: C.lilac, draw: () => (<>
    {FLOOR(C.lilac2)}
    <path d="M170 404V170a80 80 0 0 1 160 0v234z" fill={C.deep} />
    <path d="M186 404V176a64 64 0 0 1 128 0v228z" fill={C.butter} />
    <path d="M314 176v228l-46 10V170z" fill={C.forest} />
    <path d="M186 404l-60 40h188l60-40z" fill={C.butter2} opacity=".7" />
    <Shadow x={190} y={414} w={60} />
    <Person x={190} y={292} skin={C.skin2} top={C.ink} bottom={C.clay} legs={WALK_LEGS} stole
      arms={[[[-22, -84], [-46, -46], [-60, -14]], [[22, -84], [50, -60], [66, -30]]]} />
  </>) },
  /** A parent gives a thumbs up beside a big approval seal. */
  approve: { bg: C.sage, draw: () => (<>
    {FLOOR(C.sage2)}
    <g transform="translate(272 180)">
      <path d="M-40 60l-24 90 32-16 20 28 20-84z" fill={C.clay} /><path d="M40 60l24 90-32-16-20 28-20-84z" fill={C.gold} />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 72} cy={Math.sin(a) * 72} r="22" fill={C.forest} />; })}
      <circle r="76" fill={C.forest} /><Check x={0} y={-4} s={2} />
    </g>
    <Shadow x={110} y={414} w={78} />
    <Person x={110} y={290} skin={C.skin1} top={C.ink} bottom={C.forest} wrap={C.gold} legs={STAND_LEGS}
      arms={[[[-22, -84], [-40, -44], [-24, -16]], [[22, -84], [60, -84], [62, -128]]]}
      holding={<g><rect x="56" y="-150" width="12" height="20" rx="6" fill={C.skin1} /><Phone x={-22} y={-26} r={-10} /></g>} />
  </>) },
};
export type ArtKind = keyof typeof SCENES;

/** A full-bleed illustrated card for the side column on wide screens. */
export function Art({ kind }: { kind: ArtKind }) {
  const id = useId().replace(/:/g, "");
  const sc = SCENES[kind];
  return (
    <div className="art" aria-hidden="true">
      <svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice"><rect width="400" height="480" fill={sc.bg} />{sc.draw()}<Grain id={`g${id}`} w={400} h={480} /></svg>
    </div>
  );
}

// ---------- welcome slides (400 × 400, drawn on the slide's own colour) ----------

const SLIDES = {
  /** A student sits on a stack of giant books, reading. */
  syllabus: () => (<>
    <Shadow x={200} y={362} w={150} />
    {[[90, 300, 220, C.forest], [70, 250, 250, C.clay], [100, 200, 200, C.white]].map(([x, y, w, f], i) => (
      <g key={i}><rect x={x as number} y={y as number} width={w as number} height="50" rx="8" fill={f as string} /><rect x={(x as number) + 14} y={(y as number) + 10} width="8" height="30" rx="4" fill={i === 2 ? C.sage2 : C.white} opacity=".7" /></g>
    ))}
    <Person x={180} y={200} s={0.78} skin={C.skin2} top={C.gold} bottom={C.ink} legs={SIT_LEGS}
      arms={[[[-22, -84], [10, -60], [46, -78]], [[22, -84], [44, -60], [62, -76]]]}
      holding={<g transform="translate(56 -92) rotate(-14)"><path d="M-30 0Q-15-10 0 0Q15-10 30 0V30Q15 20 0 30Q-15 20-30 30Z" fill={C.white} /><path d="M0 0V30" stroke={C.sage2} strokeWidth="3" /></g>} />
    <path d="M300 120l26-46 26 46z" fill={C.gold} /><rect x="60" y="80" width="40" height="40" rx="10" fill={C.forest} transform="rotate(14 80 100)" />
  </>),
  /** A student strides along a winding path towards a flag. */
  plan: () => (<>
    <circle cx="320" cy="80" r="40" fill={C.gold} />
    <path d="M20 370C120 370 110 290 190 280S300 260 330 170" fill="none" stroke={C.white} strokeWidth="34" strokeLinecap="round" />
    <path d="M20 370C120 370 110 290 190 280S300 260 330 170" fill="none" stroke={C.butter2} strokeWidth="4" strokeDasharray="2 16" strokeLinecap="round" />
    <rect x="326" y="96" width="7" height="74" rx="3.5" fill={C.ink} /><path d="M333 98h48l-13 15 13 15h-48z" fill={C.clay} />
    <Shadow x={180} y={366} w={56} />
    <Person x={180} y={262} s={0.8} skin={C.skin1} top={C.forest} bottom={C.ink} stole legs={WALK_LEGS}
      arms={[[[-22, -84], [-46, -48], [-62, -16]], [[22, -84], [48, -60], [70, -40]]]} />
  </>),
  /** A student at a desk with a laptop; speech bubbles from the tutor float above. */
  tutor: () => (<>
    <path d="M200 40h150a24 24 0 0 1 24 24v50a24 24 0 0 1-24 24H250l-28 24v-24H200a24 24 0 0 1-24-24V64a24 24 0 0 1 24-24z" fill={C.deep} />
    {[236, 274, 312].map((x) => <circle key={x} cx={x} cy="89" r="9" fill={C.gold} />)}
    <path d="M60 110h100a22 22 0 0 1 22 22v34a22 22 0 0 1-22 22h-10v22l-26-22H60a22 22 0 0 1-22-22v-34a22 22 0 0 1 22-22z" fill={C.white} />
    <circle cx="110" cy="146" r="16" fill={C.gold} /><rect x="103" y="164" width="14" height="8" rx="3" fill={C.ink} />
    <Shadow x={210} y={372} w={160} />
    <rect x="96" y="314" width="64" height="12" rx="6" fill={C.forest} /><rect x="104" y="326" width="10" height="44" fill={C.forest} /><rect x="142" y="326" width="10" height="44" fill={C.forest} />
    <Person x={126} y={314} s={0.8} skin={C.skin3} top={C.clay} bottom={C.ink2} legs={SIT_LEGS}
      arms={[[[-22, -84], [20, -56], [76, -60]], [[22, -84], [54, -52], [96, -60]]]} />
    <rect x="170" y="262" width="200" height="14" rx="6" fill={C.ink} /><rect x="186" y="276" width="12" height="94" fill={C.ink} /><rect x="342" y="276" width="12" height="94" fill={C.ink} />
    <path d="M226 262l14-54h72l-14 54z" fill={C.ink2} /><circle cx="262" cy="234" r="6" fill={C.sage} />
  </>),
};
export type SlideArtKind = keyof typeof SLIDES;

export function SlideArt({ kind }: { kind: SlideArtKind }) {
  return <svg className="slideart" viewBox="0 0 400 400" aria-hidden="true">{SLIDES[kind]()}</svg>;
}
