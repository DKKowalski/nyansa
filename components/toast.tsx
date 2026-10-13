"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";

export function Toast() {
  const toast = useApp((s) => s.toast);
  const [hidden, setHidden] = useState<number | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setHidden(toast.id), 1800);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <div className={`toast${toast && hidden !== toast.id ? " show" : ""}`} role="status" aria-live="polite">
      {toast?.msg}
    </div>
  );
}

/** Shows a short message, e.g. for features that come in a later build. */
export function useToast() {
  return useApp((s) => s.showToast);
}
