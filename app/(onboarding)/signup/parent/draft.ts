"use client";
import { create } from "zustand";
import type { Exam } from "@/lib/content";

/** The child being added, shared by the add-child and login-card screens. Kept in memory only: the starter
 *  password is shown once on the card and never saved. */
type Draft = { name: string; exam: Exam; cls: string; sugs: { u: string; av: string }[] | null; sel: number; pass: string };
export const draft0: Draft = { name: "", exam: "BECE", cls: "", sugs: null, sel: 0, pass: "" };

const useDraftStore = create<Draft & { put: (p: Partial<Draft>) => void }>()((set) => ({ ...draft0, put: (p) => set(p) }));

export function useDraft() {
  const d = useDraftStore();
  return [d, d.put] as const;
}
