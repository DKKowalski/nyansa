"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { daysLeft, examName, firstName, useApp } from "@/lib/store";
import { I, type IconName } from "./icons";
import { Wordmark } from "./brand";
import { Ticks } from "./viz";
import { ClipGroup } from "./motion";
import { useToast } from "./toast";

type NavItem = { icon: IconName; label: string; href: string | null; match: string[] };

const NAV: NavItem[] = [
  { icon: "home", label: "Home", href: "/home", match: ["/home", "/plan"] },
  { icon: "learn", label: "Learn", href: "/learn", match: ["/learn"] },
  { icon: "practice", label: "Practice", href: "/practice", match: ["/practice", "/mocks", "/past-questions", "/theory", "/mistakes"] },
  { icon: "tutor", label: "Tutor", href: "/tutor", match: ["/tutor"] },
  { icon: "progress", label: "Progress", href: "/progress", match: ["/progress", "/settings"] },
];
const NAV_PARENT: NavItem[] = [
  { icon: "home", label: "Overview", href: "/parent", match: ["/parent"] },
  { icon: "progress", label: "Reports", href: null, match: [] },
  { icon: "tutor", label: "Messages", href: null, match: [] },
  { icon: "settings", label: "Settings", href: "/settings", match: ["/settings"] },
];

function NavLinks({ items, withLabel, className }: { items: NavItem[]; withLabel: boolean; className: string }) {
  const path = usePathname();
  const toast = useToast();
  const active = items.findIndex(({ match }) => match.some((m) => path === m || path.startsWith(m + "/")));
  return (
    <ClipGroup className={className} items={items} active={active}
      style={!withLabel && items.length === 4 ? { gridTemplateColumns: "repeat(4,1fr)" } : undefined}
      render={({ icon, label, href }, i, layer) => {
        const Icon = I[icon];
        const body = <><Icon />{withLabel && label}</>;
        if (layer === "active") return <span key={label} className="navitem">{body}</span>;
        const current = i === active ? "page" : undefined;
        return href
          ? <Link key={label} className="navitem" href={href} aria-label={label} aria-current={current}>{body}</Link>
          : <button key={label} type="button" className="navitem" aria-label={label} onClick={() => toast(`${label} comes later`)}>{body}</button>;
      }} />
  );
}

/** Student and parent shell: side menu and top bar on web, floating tab bar on phone. */
export function AppShell({ parent = false, children }: { parent?: boolean; children: React.ReactNode }) {
  const s = useApp();
  const toast = useToast();
  const items = parent ? NAV_PARENT : NAV;
  return (
    <div className="shell">
      <aside className="side">
        <Wordmark size={36} />
        {parent && <span className="lvl" style={{ justifySelf: "start", marginTop: -14 }}>Parent view</span>}
        <nav aria-label="Main"><NavLinks items={items} withLabel className="sidegrid" /></nav>
        {parent ? (
          <div className="sidecard" style={{ background: "var(--sage)" }}><span>Linked child</span><b style={{ fontSize: 26 }}>Ama · JHS 3</b><span>BECE in {daysLeft(s)} days</span></div>
        ) : (
          <div className="sidecard"><span>{examName(s.exam)} in</span><b>{daysLeft(s)} days</b><span>{s.minutes} min a day</span></div>
        )}
      </aside>
      <div className="main">
        <div className="wtop">
          <button type="button" className="search" style={{ border: 0, font: "inherit", textAlign: "left", cursor: "pointer" }} onClick={() => toast("Search comes later")}><I.search />Search topics, past questions…</button>
          <div className="grow" />
          <button type="button" className="cbtn" aria-label="Notifications" onClick={() => toast("No new notifications")}><I.bell /></button>
          <Avatar parent={parent} />
        </div>
        {children}
      </div>
      <div className="navwrap">
        <nav aria-label="Main"><NavLinks items={items} withLabel={false} className="nav" /></nav>
      </div>
    </div>
  );
}

export function Avatar({ parent = false }: { parent?: boolean }) {
  const name = useApp((s) => s.name);
  return <span className="av" style={parent ? { background: "var(--sage)" } : undefined}>{parent ? "P" : firstName(name)[0].toUpperCase()}</span>;
}

/** Phone-only top row on tab screens: avatar plus actions. */
export function PhoneTop({ children }: { children?: React.ReactNode }) {
  return <div className="top m-only"><Avatar /><div className="grow" />{children}</div>;
}

export function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return <Link className="cbtn" href={href} aria-label={label}>{label === "Close" ? <I.close /> : <I.back />}</Link>;
}

// ---------- onboarding ----------

export const SETUP = ["phone", "code", "name", "exam", "class", "subjects", "goal", "prefs"] as const;
export type SetupStep = (typeof SETUP)[number];
export const setupHref = (s: SetupStep) => `/setup/${s}`;

const GROUPS: [string, string[]][] = [
  ["Account", ["/setup/phone", "/setup/code", "/setup/name"]],
  ["Exam", ["/setup/exam", "/setup/class"]],
  ["Subjects", ["/setup/subjects"]],
  ["Goal", ["/setup/goal", "/setup/prefs"]],
  ["Check-in", ["/check-in", "/check-in/questions", "/check-in/results"]],
];

/** Web: brand plus a step header. Phone: each screen shows its own tick progress (SetupTop). */
export function OnboardingShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const toast = useToast();
  const gi = GROUPS.findIndex(([, ids]) => ids.includes(path));
  return (
    <div className="auth">
      <div className="authmain">
        <div className="obhead w-only">
          <Wordmark size={34} />
          <div className="obsteps">
            {GROUPS.map(([l], i) => (
              <span key={l} style={{ display: "contents" }}>
                {i > 0 && <span className="obline" />}
                <span className={`obstep ${i < gi ? "done" : i === gi ? "cur" : ""}`}><i>{i < gi ? "✓" : i + 1}</i>{l}</span>
              </span>
            ))}
          </div>
          <button type="button" className="skip" onClick={() => toast("Help: email support comes in the build")}>Need help?</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SetupTop({ step }: { step: SetupStep }) {
  const i = SETUP.indexOf(step);
  const back = i === 0 ? "/welcome" : setupHref(SETUP[i - 1]);
  return (
    <div className="top">
      <BackLink href={back} />
      <Ticks className="obt" n={24} on={Math.round(((i + 1) / SETUP.length) * 24)} label={`Step ${i + 1} of ${SETUP.length}`} />
    </div>
  );
}

/** The SMS preview beside the phone and code steps on web. */
export function SmsBox({ got }: { got: boolean }) {
  const chip = { background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.18)" };
  return (
    <div className="smsbox">
      <div className="smshd"><span>Messages</span><span>now</span></div>
      <div className="smsfrom"><span className="av" style={{ width: 40, height: 40, fontSize: 14, background: "var(--forest)", color: "var(--gold)" }}>N</span><b>NYANSA</b></div>
      <div className="smsb">Your Nyansa code is <b className={got ? "hl" : ""}>482 916</b>. It expires in 10 minutes. Don&apos;t share it with anyone.</div>
      {got && <span className="lvl" style={{ justifySelf: "start", background: "var(--sage)", borderColor: "transparent", color: "var(--ink)" }}>✓ Code received</span>}
      <div className="chips" style={{ margin: "6px 0 0", padding: 0, flexWrap: "wrap" }}>
        <span className="chip" style={chip}>No email needed</span><span className="chip" style={chip}>Works on any phone</span>
      </div>
    </div>
  );
}
