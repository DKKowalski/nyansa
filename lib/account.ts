import type { Exam } from "./content";
import { isGhanaMobile } from "./phone";

export type Level = "primary" | "jhs" | "shs" | "tertiary";
export type Contact = "phone" | "email";
/** For students under 18: "verified" = the parent typed the code we texted them, "pending" = we sent them a link,
 *  "approved" = they approved from the link. Adults have no approval. */
export type Approval = "none" | "verified" | "pending" | "approved";

export interface Guardian { name: string; relation: string; via: Contact; phone: string; email: string }

export const LEVELS: { v: Level; bg: string; n: string; k: string; tag: string }[] = [
  { v: "primary", bg: "bg-butter", n: "Primary", k: "Class 4 to 6", tag: "BECE basics" },
  { v: "jhs", bg: "bg-sage", n: "JHS", k: "JHS 1 to 3", tag: "BECE" },
  { v: "shs", bg: "bg-lilac", n: "SHS", k: "SHS 1 to 3", tag: "WASSCE" },
  { v: "tertiary", bg: "bg-clay", n: "Tertiary", k: "University or re-sitting", tag: "Your choice" },
];
export const levelName = (l: Level | null) => LEVELS.find((x) => x.v === l)?.n ?? "";

/** What picking a level decides. Primary builds BECE foundations; tertiary students choose the exam they revise for. */
export function levelDefaults(l: Level): { exam: Exam | null; cls: string | null } {
  if (l === "jhs" || l === "primary") return { exam: "BECE", cls: null };
  if (l === "shs") return { exam: "WASSCE", cls: null };
  return { exam: null, cls: "Private candidate" };
}

// ---------- age ----------

/** Ghana's Children's Act and Data Protection Act treat anyone under 18 as a child: a parent consents for them. */
export const ADULT_AGE = 18;

export function ageOn(dob: string, now: number) {
  const b = new Date(dob + "T00:00:00"), n = new Date(now);
  let a = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
  return a;
}
export const isMinor = (dob: string, now: number | null) => !dob || now === null || ageOn(dob, now) < ADULT_AGE;

/** "" if the day, month and year make a real, plausible birth date, otherwise what is wrong. */
export function dobProblem(d: string, m: string, y: string, now: number) {
  if (!d || !m || y.length < 4) return "incomplete";
  const dd = Number(d), mm = Number(m), yy = Number(y);
  const t = new Date(yy, mm - 1, dd);
  if (t.getDate() !== dd || t.getMonth() !== mm - 1) return "That date doesn't exist. Check the day and month.";
  const age = ageOn(isoDate(yy, mm, dd), now);
  if (t.getTime() > now) return "That date is in the future.";
  if (age < 5) return "Nyansa is for students aged 5 and over.";
  if (age > 100) return "Check the year you were born.";
  return "";
}
export const isoDate = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// ---------- contact ----------

export const isEmail = (raw: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(raw.trim());
export const contactOk = (via: Contact, phone: string, email: string) => (via === "phone" ? isGhanaMobile(phone) : isEmail(email));
/** The optional second contact must still be valid if it is filled in. */
export const optionalOk = (via: Contact, phone: string, email: string) =>
  via === "phone" ? !email.trim() || isEmail(email) : !phone.trim() || isGhanaMobile(phone);

// ---------- username and password ----------

/** Sample names already in use until accounts live on a server. */
const TAKEN = ["ama", "kwame", "kofi", "admin", "nyansa", "student", "bravekente27"];

export function usernameProblem(u: string, realNames: string[]) {
  const v = u.trim();
  if (!v) return "";
  if (v.length < 4) return "At least 4 characters.";
  if (v.length > 20) return "20 characters at most.";
  if (!/^[a-z]/i.test(v)) return "Start with a letter.";
  if (!/^[a-z0-9_.]+$/i.test(v)) return "Use letters, numbers, dots or underscores only.";
  if (TAKEN.includes(v.toLowerCase())) return "Someone already has that username. Try another.";
  if (realNames.some((n) => n.length > 2 && v.toLowerCase().includes(n.toLowerCase()))) return "real-name";
  return "";
}

export function passwordProblem(p: string, username: string) {
  if (!p) return "";
  if (p.length < 8) return "At least 8 characters.";
  if (!/[a-z]/i.test(p) || !/\d/.test(p)) return "Mix letters and at least one number.";
  if (username && p.toLowerCase().includes(username.trim().toLowerCase())) return "Don't use your username in your password.";
  return "";
}

const ADJ = ["Brave", "Swift", "Clever", "Bold", "Happy", "Mighty", "Bright", "Calm", "Lucky", "Sunny", "Kind", "Smart", "Quick", "Golden", "Royal", "Proud"];
const THING: [string, string][] = [["Kente", "🧵"], ["Sunbird", "🐦"], ["Baobab", "🌳"], ["Drummer", "🥁"], ["Cocoa", "🍫"], ["Lion", "🦁"], ["Elephant", "🐘"], ["Mango", "🥭"], ["Canoe", "🛶"], ["Eagle", "🦅"], ["Tortoise", "🐢"], ["Ananse", "🕷️"], ["Star", "⭐"], ["Volta", "🌊"]];
const WORDS = ["sunny", "mango", "river", "green", "cocoa", "happy", "drum", "star", "blue", "lion", "kente", "bright"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

/** First suggestions: fixed so the prerendered page and the first client render match. Shuffle randomises. */
export const FIRST_USERNAMES = [{ u: "SwiftSunbird24", av: "🐦" }, { u: "CleverBaobab7", av: "🌳" }, { u: "BoldDrummer58", av: "🥁" }];

/** Fun usernames that never show a real name. */
export function suggestUsernames(n = 3) {
  const out: { u: string; av: string }[] = [];
  while (out.length < n) {
    const [t, av] = pick(THING);
    const u = pick(ADJ) + t + (2 + Math.floor(Math.random() * 88));
    if (!out.some((o) => o.u === u)) out.push({ u, av });
  }
  return out;
}
/** Easy-to-type starter password a parent gives a child, e.g. "sunny-mango42". */
export function starterPassword() {
  const a = pick(WORDS); let b = pick(WORDS);
  while (b === a) b = pick(WORDS);
  return `${a}-${b}${10 + Math.floor(Math.random() * 90)}`;
}

// ---------- step order ----------

type FlowState = { role: "student" | "parent"; level: Level | null; dob: string; now: number | null };

/** The sign-up screens this person goes through, in order. Students under 18 get the parent step instead of
 *  their own contact step; JHS, SHS and Primary skip the exam choice; tertiary skips the class choice. */
export function flowSteps(s: FlowState): string[] {
  if (s.role === "parent") return ["/signup/parent", "/signup/verify", "/signup/parent/name", "/signup/parent/child", "/signup/parent/card"];
  return [
    "/signup/level", "/signup/details",
    isMinor(s.dob, s.now) ? "/signup/guardian" : "/signup/contact",
    "/signup/verify", "/signup/username",
    ...(s.level && levelDefaults(s.level).exam ? [] : ["/setup/exam"]),
    ...(s.level === "tertiary" ? [] : ["/setup/class"]),
    "/setup/subjects", "/setup/goal", "/setup/prefs",
  ];
}
