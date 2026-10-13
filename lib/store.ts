"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CORE, PQ, QUESTIONS, STRANDS, type Exam } from "./content";

export type Role = "student" | "parent";
export type Mood = "confident" | "okay" | "nervous";
export type ChatMsg = { me: string } | { ai: string };

interface Profile {
  phone: string;
  name: string;
  role: Role;
  exam: Exam | null;
  cls: string | null;
  subjects: string[] | null; // null = all core subjects
  date: string; // ISO yyyy-mm-dd, "" = expected sitting
  minutes: number;
  saveData: boolean;
  mood: Mood | null;
  answers: Record<number, number>; // diagnostic: question index → option (-1 = "I don't know this yet")
  onboarded: boolean;
}

interface Session {
  pans: Record<number, number>; // practice set answers
  psetDone: boolean;
  mans: Record<number, number>; // mock answers
  mflag: number[];
  mockEndsAt: number | null; // the mock timer keeps running if the student leaves
  tq: number; // tutor context: index into PQ, -1 = none
  chat: ChatMsg[] | null;
  toast: { msg: string; id: number } | null;
  /** Clock for date maths, set when saved progress loads. Null during prerender so server and client HTML match. */
  now: number | null;
}

interface Actions {
  set: (p: Partial<Profile & Session>) => void;
  toggleSubject: (n: string) => void;
  showToast: (msg: string) => void;
  startChat: (qi: number) => void;
  pushChat: (...m: ChatMsg[]) => void;
  startMock: () => void;
  reset: () => void;
}

const profile0: Profile = {
  phone: "", name: "", role: "student", exam: null, cls: null, subjects: null, date: "",
  minutes: 30, saveData: true, mood: null, answers: {}, onboarded: false,
};
const session0: Session = { pans: {}, psetDone: false, mans: {}, mflag: [], mockEndsAt: null, tq: -1, chat: null, toast: null, now: null };

export const MOCK_SECONDS = 9000;

export const useApp = create<Profile & Session & Actions>()(
  persist(
    (set, get) => ({
      ...profile0,
      ...session0,
      set: (p) => set(p),
      toggleSubject: (n) => {
        const sel = get().subjects ?? CORE.map((c) => c.name);
        set({ subjects: sel.includes(n) ? sel.filter((x) => x !== n) : [...sel, n] });
      },
      showToast: (msg) => set({ toast: { msg, id: Date.now() } }),
      startChat: (qi) =>
        set({
          tq: qi,
          chat: qi >= 0
            ? [{ me: `I'm stuck on this one: ${PQ[qi].q}` }, { ai: "Let's work it out together. You do the thinking and I'll guide you. Tap Hint when you're ready, or tell me what you've tried." }]
            : [{ ai: `Hey ${firstName(get().name)}! New day, new topics. What are you stuck on today?` }],
        }),
      pushChat: (...m) => set({ chat: [...(get().chat ?? []), ...m] }),
      startMock: () => set({ mans: {}, mflag: [], mockEndsAt: Date.now() + MOCK_SECONDS * 1000 }),
      reset: () => set({ ...profile0, ...session0, now: get().now }),
    }),
    {
      name: "nyansa",
      // Hydrated after mount by <Providers> so server and first client render match.
      skipHydration: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- session-only fields
      partialize: ({ toast, chat, now, ...rest }) => rest,
    },
  ),
);

// ---------- derived values (pure, shared by screens) ----------

export const firstName = (name: string) => name.trim().split(/\s+/)[0] || "Ama";
export const examName = (exam: Exam | null) => exam ?? "BECE";
export const defaultDate = (exam: Exam | null) => (exam === "WASSCE" ? "2027-05-10" : "2027-06-07");
export const examDate = (s: { date: string; exam: Exam | null }) => s.date || defaultDate(s.exam);
export function daysLeft(s: { date: string; exam: Exam | null; now: number | null }) {
  if (s.now === null) return 0;
  const d = Date.parse(examDate(s) + "T00:00:00");
  return Math.max(0, Math.ceil((d - s.now) / 864e5));
}
export const subjectsOf = (subjects: string[] | null) => subjects ?? CORE.map((c) => c.name);

export const correctCount = (answers: Record<number, number>) =>
  Object.entries(answers).filter(([i, v]) => v === QUESTIONS[Number(i)].a).length;

/** Rough BECE grade (1 best) from 8 diagnostic questions. */
export const gradeOf = (t: number) => (t >= 7 ? 2 : t >= 6 ? 3 : t >= 5 ? 4 : t >= 3 ? 6 : 8);

export function strandScores(answers: Record<number, number>): Record<string, number> {
  if (!Object.keys(answers).length) return { Number: 0.67, Algebra: 0.5, Geometry: 0.5, Data: 0 };
  const sc: Record<string, number> = {}, n: Record<string, number> = {};
  STRANDS.forEach(({ name }) => { sc[name] = 0; n[name] = 0; });
  QUESTIONS.forEach((q, i) => { n[q.strand!]++; if (answers[i] === q.a) sc[q.strand!]++; });
  STRANDS.forEach(({ name }) => (sc[name] = n[name] ? sc[name] / n[name] : 0));
  return sc;
}
export const weakest = (sc: Record<string, number>) => STRANDS.map((x) => x.name).sort((a, b) => sc[a] - sc[b]);

export function greeting(now: number | null) {
  if (now === null) return "Hello";
  const h = new Date(now).getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
