"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KnotMark, LogoTile } from "@/components/brand";
import { useApp } from "@/lib/store";

/** A0 Splash: returning students go straight Home, new ones to Welcome. */
export default function Splash() {
  const router = useRouter();
  const next = useApp((s) => (s.onboarded ? (s.role === "parent" ? "/parent" : "/home") : "/welcome"));
  useEffect(() => {
    router.prefetch(next);
    const t = setTimeout(() => router.replace(next), 2600);
    return () => clearTimeout(t);
  }, [next, router]);

  return (
    <div className="splash" role="button" tabIndex={0} aria-label="Continue" onClick={() => router.replace(next)} onKeyDown={(e) => e.key === "Enter" && router.replace(next)}>
      <svg className="pat" viewBox="0 0 100 100" aria-hidden="true" style={{ inset: "auto", width: 520, height: 520, left: "50%", top: "38%", transform: "translate(-50%,-50%)", opacity: 0.06 }}>
        <KnotMark color="#ffffff" />
      </svg>
      <div className="mid">
        <LogoTile size={112} />
        <span className="word">nyansa</span>
        <span className="tag">Learn it. Own it. Pass it.</span>
      </div>
      <div className="foot">
        <div className="load">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.1}s` }} />)}</div>
        BECE · WASSCE
      </div>
    </div>
  );
}
