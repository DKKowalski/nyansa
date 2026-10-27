"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { I } from "@/components/icons";
import { CopyButton } from "@/components/motion";
import { SetupTop } from "@/components/shells";
import { useToast } from "@/components/toast";
import { starterPassword, suggestUsernames } from "@/lib/account";
import { useApp } from "@/lib/store";
import { draft0, useDraft } from "../draft";

/** G1 The child's login: they pick a fun username, we make an easy starter password, the parent shares the card. */
export default function LoginCard() {
  const [k, put] = useDraft();
  const { kids, set } = useApp();
  const router = useRouter();
  const toast = useToast();
  // Random names and password only after mount, so the prerendered page matches the first client render.
  useEffect(() => { if (!k.sugs) put({ sugs: suggestUsernames(3), sel: 0, pass: starterPassword() }); }, [k.sugs, put]);
  const u = k.sugs?.[k.sel];
  const name = k.name.trim() || "Your child";

  function done(to: string) {
    if (!u) return;
    set({ kids: [...kids, { name, exam: k.exam, cls: k.cls || "JHS 3", user: u.u, av: u.av }], onboarded: true, role: "parent" });
    put(draft0);
    toast(`${name}'s login is ready`);
    router.push(to);
  }

  return (
    <div className="scr">
      <SetupTop />
      <div className="cols obc">
        <div className="col">
          <h1 className="h-xl">Pick a fun username</h1>
          <p className="lead">Let {name} choose. It never shows their real name.</p>
          <div style={{ display: "grid", gap: 8 }}>
            {(k.sugs ?? []).map((x, i) => (
              <button key={x.u} type="button" className={`prow ${i === k.sel ? "bg-sage" : "bg-white"}`} aria-pressed={i === k.sel} onClick={() => put({ sel: i })}
                style={{ opacity: 1, boxShadow: i === k.sel ? "inset 0 0 0 2.5px var(--ink)" : undefined }}>
                <span className="ico" style={{ fontSize: 24 }}>{x.av}</span>
                <span className="tx"><b>{x.u}</b><span>{i === k.sel ? "Selected" : "Tap to choose"}</span></span>
                <span className="end">{i === k.sel ? <I.check /> : <I.arrow />}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn light" onClick={() => put({ sugs: suggestUsernames(3), sel: 0 })}>Shuffle names</button>
        </div>
        <div className="col">
          <div className="tcard bg-forest logincard">
            <span className="k" style={{ color: "#BFD9CB" }}>Login card · Nyansa</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="mascot" style={{ width: 72, height: 72, background: "#fff", fontSize: 38, margin: 0 }}>{u?.av}</span>
              <div><b style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-.01em" }}>{name}</b><br /><span style={{ color: "#BFD9CB" }}>{k.exam} · {k.cls}</span></div>
            </div>
            <div className="lc-row"><span>Username</span><b>{u?.u ?? "…"}</b></div>
            <div className="lc-row"><span>Password</span><b>{k.pass || "…"}</b><button type="button" className="linkbtn" style={{ color: "var(--gold)" }} onClick={() => put({ pass: starterPassword() })}>New</button></div>
            <span className="small" style={{ color: "#BFD9CB" }}>{name} can change the password after signing in. You can reset it from your dashboard.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
            <button type="button" className="btn light" onClick={() => toast("Sent to your phone by SMS")}>Send to my phone</button>
            <CopyButton text={u ? `Nyansa login · Username: ${u.u} · Password: ${k.pass}` : ""} label="Copy login" onCopied={() => toast("Login copied")} />
          </div>
        </div>
      </div>
      <div className="cta">
        <button type="button" className="btn" disabled={!u} onClick={() => done("/parent")}>Go to my dashboard</button>
        <button type="button" className="btn text" disabled={!u} onClick={() => done("/signup/parent/child")}>+ Add another child</button>
      </div>
    </div>
  );
}
