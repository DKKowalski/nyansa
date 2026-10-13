"use client";
import { toast, Toaster as Sonner } from "sonner";

/** Sonner toasts in Nyansa's dark pill. Sonner owns the motion: slide in from the bottom, stack, swipe to dismiss,
 *  pause while the tab is hidden. Sits above the tab bar on phone, near the bottom edge on web. */
export function Toaster() {
  return (
    <Sonner position="bottom-center" duration={2200} visibleToasts={3} gap={8}
      offset={{ bottom: "var(--toast-bottom)" }} mobileOffset={{ bottom: "var(--toast-bottom)" }}
      toastOptions={{ unstyled: true, classNames: { toast: "ntoast" } }} />
  );
}

/** Shows a short message, e.g. for features that come in a later build. */
export function useToast() {
  return (msg: string) => { toast(msg); };
}
