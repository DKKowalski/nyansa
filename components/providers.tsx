"use client";
import { useLayoutEffect } from "react";
import { useApp } from "@/lib/store";
import { Toast } from "./toast";

/** The app frame. Saved progress loads from the device before the first paint (layout effect), so there is no
 *  flash of sample values, while the server still prerenders every screen into the static shell. */
export function Providers({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    useApp.persist.rehydrate();
    useApp.setState({ now: Date.now() });
  }, []);
  return (
    <div className="app">
      {children}
      <Toast />
    </div>
  );
}
