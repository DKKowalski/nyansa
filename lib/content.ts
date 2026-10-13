// Sample content from the prototype. Shapes follow the Build Plan's data model (Subject, Strand, Topic,
// Question, Lesson card…) so this file can be swapped for API calls without touching the screens.

export type Exam = "BECE" | "WASSCE";
export type Bg = "bg-sage" | "bg-lilac" | "bg-butter" | "bg-clay" | "bg-white";
export type Level = "Basic" | "Advanced" | "Review";

export interface Subject { name: string; abbr: string; bg: Bg; topics: number }
export interface Strand { name: string; abbr: string; bg: Bg; color: string }
export interface Question { strand?: string; lv?: Level; q: string; opts: string[]; a: number; why?: string }

export const CORE: Subject[] = [
  { name: "English Language", abbr: "EN", bg: "bg-lilac", topics: 38 },
  { name: "Mathematics", abbr: "Σ", bg: "bg-sage", topics: 42 },
  { name: "Integrated Science", abbr: "Sc", bg: "bg-butter", topics: 46 },
  { name: "Social Studies", abbr: "SS", bg: "bg-clay", topics: 40 },
];
export const subjectByName = (n: string) => CORE.find((s) => s.name === n) ?? CORE[1];

export const STRANDS: Strand[] = [
  { name: "Number", abbr: "#", bg: "bg-sage", color: "var(--forest)" },
  { name: "Algebra", abbr: "x", bg: "bg-lilac", color: "#7A5BC2" },
  { name: "Geometry", abbr: "△", bg: "bg-butter", color: "#D89A10" },
  { name: "Data", abbr: "∑", bg: "bg-clay", color: "var(--clay)" },
];
export const strandByName = (n: string) => STRANDS.find((s) => s.name === n) ?? STRANDS[1];

export const TOPIC: Record<string, [string, string]> = {
  Number: ["Fractions and ratio", "Adding fractions, sharing in a ratio"],
  Algebra: ["Linear equations", "Solving for x, one step at a time"],
  Geometry: ["Angles and area", "Angle sums and areas of shapes"],
  Data: ["Mean, median and mode", "Averages from a list of numbers"],
};

/** Diagnostic check-in (D2). */
export const QUESTIONS: Question[] = [
  { strand: "Number", q: "Simplify ¾ + ⅔", opts: ["5⁄7", "1 5⁄12", "6⁄12", "1 1⁄12"], a: 1 },
  { strand: "Number", q: "Write 0.000245 in standard form", opts: ["2.45 × 10⁻⁴", "2.45 × 10⁴", "24.5 × 10⁻⁵", "2.45 × 10⁻³"], a: 0 },
  { strand: "Algebra", q: "Solve 2x + 3 = 11", opts: ["x = 7", "x = 4", "x = 5.5", "x = 8"], a: 1 },
  { strand: "Algebra", q: "If p = 3 and q = −2, find p² − 2q", opts: ["5", "13", "10", "−1"], a: 1 },
  { strand: "Geometry", q: "The angles of a triangle are x, 2x and 3x. Find x.", opts: ["30°", "60°", "45°", "36°"], a: 0 },
  { strand: "Geometry", q: "Find the area of a rectangle 8 cm long and 5 cm wide", opts: ["13 cm²", "26 cm²", "40 cm²", "45 cm²"], a: 2 },
  { strand: "Data", q: "Find the mean of 4, 7, 9 and 12", opts: ["7", "8", "9", "32"], a: 1 },
  { strand: "Number", q: "Share GH₵120 between Ama and Kofi in the ratio 2 : 3. How much does Kofi get?", opts: ["GH₵48", "GH₵60", "GH₵72", "GH₵80"], a: 2 },
];

/** Practice Set 2 on Linear equations (P1). */
export const PQ: Question[] = [
  { lv: "Basic", q: "Solve 5x = 35", opts: ["x = 7", "x = 30", "x = 40", "x = 175"], a: 0, why: "5x means 5 × x, so divide both sides by 5: x = 35 ÷ 5 = 7." },
  { lv: "Basic", q: "Solve x ÷ 4 = 6", opts: ["x = 1.5", "x = 10", "x = 24", "x = 2"], a: 2, why: "Multiply both sides by 4: x = 6 × 4 = 24." },
  { lv: "Basic", q: "Solve 4x + 7 = 31", opts: ["x = 6", "x = 9.5", "x = 24", "x = 8"], a: 0, why: "Subtract 7 from both sides: 4x = 24. Then divide by 4: x = 6." },
  { lv: "Advanced", q: "Solve 3(x − 2) = 15", opts: ["x = 3", "x = 5", "x = 7", "x = 17"], a: 2, why: "Divide both sides by 3: x − 2 = 5. Then add 2: x = 7." },
  { lv: "Advanced", q: "Ama is 3 years older than Kofi. Their ages add up to 27. How old is Kofi?", opts: ["12", "15", "13.5", "24"], a: 0, why: "Let Kofi be k, so Ama is k + 3. Then k + k + 3 = 27, 2k = 24 and k = 12." },
];

/** Tutor help levels for each practice question, by index into PQ. */
export const HELP = [
  { hint: "What does 5x mean? It's 5 lots of x. What's the opposite of multiplying by 5?", step: "Divide both sides by 5: 5x ÷ 5 = 35 ÷ 5.", full: "1. 5x = 35\n2. Divide both sides by 5: x = 7\n3. Check: 5 × 7 = 35 ✓" },
  { hint: "x is being divided by 4. What undoes dividing?", step: "Multiply both sides by 4: x = 6 × 4.", full: "1. x ÷ 4 = 6\n2. Multiply both sides by 4: x = 24\n3. Check: 24 ÷ 4 = 6 ✓" },
  { hint: "Look at the + 7. What could you do to both sides to get rid of it?", step: "Take 7 from both sides: 4x + 7 − 7 = 31 − 7, so 4x = 24.", full: "1. Subtract 7 from both sides: 4x = 24\n2. Divide both sides by 4: x = 6\n3. Check: 4 × 6 + 7 = 31 ✓" },
  { hint: "The bracket is multiplied by 3. Could you divide both sides by 3 first?", step: "Divide both sides by 3: x − 2 = 5.", full: "1. Divide both sides by 3: x − 2 = 5\n2. Add 2 to both sides: x = 7\n3. Check: 3 × (7 − 2) = 15 ✓" },
  { hint: "Call Kofi's age k. How would you write Ama's age using k?", step: "Ama is k + 3, so k + (k + 3) = 27, which is 2k + 3 = 27.", full: "1. Kofi = k, Ama = k + 3\n2. k + k + 3 = 27, so 2k = 24\n3. k = 12. Kofi is 12 and Ama is 15 ✓" },
];

/** Maths Mock 1, Paper 1 sample: the diagnostic plus the practice set, 12 questions. */
export const MQ: Question[] = QUESTIONS.concat(PQ.map((q) => ({ strand: "Algebra", ...q }))).slice(0, 12);

export type MapItem =
  | { u: string; name: string; sub: string; pc: string }
  | { t: string; s: "m" | "o" | "cur" | "n"; k: string; id?: string; sym?: string };

/** Mathematics syllabus journey (L2). */
export const MAP: MapItem[] = [
  { u: "Unit 1", name: "Number", sub: "3 topics", pc: "83%" },
  { t: "Fractions", s: "m", k: "Mastered" }, { t: "Decimals and percentages", s: "m", k: "Mastered" }, { t: "Ratio and proportion", s: "o", k: "Okay · 50%" },
  { u: "Unit 2", name: "Algebra", sub: "3 topics", pc: "42%" },
  { t: "Algebraic expressions", s: "o", k: "Okay · 55%" }, { t: "Linear equations", s: "cur", k: "Up next · 42%", id: "linear-equations" }, { t: "Linear inequalities", s: "n", k: "Not started", sym: "x" },
  { u: "Unit 3", name: "Geometry", sub: "3 topics", pc: "10%" },
  { t: "Angles and polygons", s: "n", k: "Not started", sym: "△" }, { t: "Area and perimeter", s: "n", k: "Not started", sym: "□" }, { t: "Circles", s: "n", k: "Not started", sym: "○" },
  { u: "Unit 4", name: "Data", sub: "2 topics", pc: "0%" },
  { t: "Mean, median and mode", s: "n", k: "Not started", sym: "∑" }, { t: "Probability", s: "n", k: "Not started", sym: "%" },
];

export interface PlanTask { time: string; bg: Bg; lv: Level; title: string; obj: string[]; min: number; href?: string }
/** Study plan days (PL), cycled across the week strip. */
export const PLAN: PlanTask[][] = [
  [{ time: "4:00 PM", bg: "bg-sage", lv: "Basic", title: "Learn: Linear equations", obj: ["See an equation as a balance", "Solve two-step equations"], min: 8, href: "/lesson" },
   { time: "4:15 PM", bg: "bg-butter", lv: "Advanced", title: "Practise: Set 2", obj: ["5 questions, harder as you go", "Brackets and word problems"], min: 12, href: "/practice/sets" },
   { time: "4:30 PM", bg: "bg-lilac", lv: "Review", title: "Review 6 mistakes", obj: ["Questions you missed on Monday"], min: 5, href: "/mistakes" }],
  [{ time: "4:00 PM", bg: "bg-lilac", lv: "Basic", title: "Check-in: English Language", obj: ["Find your starting point in English"], min: 10 },
   { time: "4:15 PM", bg: "bg-butter", lv: "Advanced", title: "Practise: Set 3", obj: ["Linear equations, mixed problems"], min: 12, href: "/practice/sets" }],
  [{ time: "10:00 AM", bg: "bg-sage", lv: "Basic", title: "Learn: Linear inequalities", obj: ["Read and write inequalities", "Solve like equations, with one twist"], min: 10 },
   { time: "10:20 AM", bg: "bg-clay", lv: "Review", title: "Spaced review: Fractions", obj: ["Keep a mastered topic fresh"], min: 5 }],
];

export const PASTQ = [
  { y: 2023, p: "Paper 1", q: "If 3x − 7 = 11, find the value of x.", seen: true },
  { y: 2021, p: "Paper 1", q: "Solve for m: 2(m + 4) = 18" },
  { y: 2019, p: "Paper 2", q: "Solve 3(2x − 1) = 2x + 9. Show your working." },
  { y: 2018, p: "Paper 2", q: "Kofi is 4 years older than Esi. In 6 years, the sum of their ages will be 40. Form an equation and find Esi's age." },
  { y: 2016, p: "Paper 1", q: "Find the value of y if y/3 + 2 = 7." },
  { y: 2014, p: "Paper 1", q: "What is the solution of 5 − 2x = 1?" },
];

export const MISTAKES = [
  { topic: "Algebra", q: "Solve 4x + 7 = 31", a: "x = 6", why: "Subtract 7, then divide by 4.", when: "on Monday" },
  { topic: "Number", q: "Write 0.000245 in standard form", a: "2.45 × 10⁻⁴", why: "Move the point 4 places right, so the power is −4.", when: "3 days ago" },
  { topic: "Geometry", q: "The angles of a triangle are x, 2x and 3x. Find x.", a: "30°", why: "x + 2x + 3x = 180°, so 6x = 180° and x = 30°.", when: "4 days ago" },
  { topic: "Algebra", q: "Solve 3(x − 2) = 15", a: "x = 7", why: "Divide by 3: x − 2 = 5. Add 2.", when: "yesterday" },
];

/** Theory question (P5) and its marking against the WAEC-style scheme. */
export const THEORY = {
  year: 2019, marks: 4, q: "Solve 3(2x − 1) = 2x + 9. Show your working.",
  sample: "6x − 3 = 2x + 9\n6x − 2x = 9 + 3\n4x = 12\nx = 4",
  points: [
    { ok: true, b: "Expands the bracket", t: "6x − 3 = 2x + 9", m: "M1" },
    { ok: true, b: "Collects like terms", t: "6x − 2x = 9 + 3", m: "M1" },
    { ok: true, b: "Simplifies", t: "4x = 12", m: "A1" },
    { ok: false, b: "Final answer", t: "12 ÷ 4 = 3, so x = 3. You wrote x = 4.", m: "A0" },
  ],
};
