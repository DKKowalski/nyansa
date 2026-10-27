"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { daysLeft, examName, firstName, useApp } from "@/lib/store";
import { flowSteps } from "@/lib/account";
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
          <div className="sidecard" style={{ background: "var(--sage)" }}><span>Linked child</span><b style={{ fontSize: 26 }}>{s.kids[0] ? `${s.kids[0].name} · ${s.kids[0].cls}` : "Ama · JHS 3"}</b><span>BECE in {daysLeft(s)} days</span></div>
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

const STUDENT_GROUPS: [string, string[]][] = [
  ["Account", ["/signup/level", "/signup/details", "/signup/guardian", "/signup/contact", "/signup/verify", "/signup/username"]],
  ["Exam", ["/setup/exam", "/setup/class"]],
  ["Subjects", ["/setup/subjects"]],
  ["Goal", ["/setup/goal", "/setup/prefs"]],
  ["Check-in", ["/check-in", "/check-in/questions", "/check-in/results"]],
];
const PARENT_GROUPS: [string, string[]][] = [
  ["Account", ["/signup/parent", "/signup/verify", "/signup/parent/name"]],
  ["Add a child", ["/signup/parent/child"]],
  ["Login card", ["/signup/parent/card"]],
];

/** Web: brand plus a step header. Phone: each screen shows its own tick progress (SetupTop). */
export function OnboardingShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const toast = useToast();
  const parent = useApp((s) => s.role === "parent");
  const groups = parent && PARENT_GROUPS.some(([, ids]) => ids.includes(path)) ? PARENT_GROUPS : STUDENT_GROUPS;
  const gi = groups.findIndex(([, ids]) => ids.includes(path));
  return (
    <div className="auth">
      <div className="authmain">
        <div className="obhead w-only">
          <Wordmark size={34} />
          <div className="obsteps">
            {gi >= 0 && groups.map(([l], i) => (
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

const SETUP_ORDER = ["/setup/exam", "/setup/class", "/setup/subjects", "/setup/goal", "/setup/prefs"];

/** Where this person goes after the current sign-up screen. Read at click time: the screen may have just changed
 *  what comes next (a birth date decides between the parent step and the contact step). */
export function useNextStep() {
  const router = useRouter();
  const path = usePathname();
  return (fallback = "/check-in") => {
    const st = useApp.getState();
    // A student editing account details from Settings goes straight back there.
    if (st.onboarded && st.role === "student" && path.startsWith("/signup/")) { router.push("/settings"); return; }
    // A screen opened from Settings that this student's own flow skips (e.g. Exam for JHS) carries on in setup order.
    const flow = flowSteps(st);
    const steps = flow.includes(path) ? flow : SETUP_ORDER;
    const i = steps.indexOf(path);
    router.push(i >= 0 && i < steps.length - 1 ? steps[i + 1] : fallback);
  };
}

/** Back button plus tick progress through this person's own steps. Screens opened from Settings go back there. */
export function SetupTop() {
  const path = usePathname();
  const s = useApp();
  const steps = flowSteps(s);
  const i = steps.indexOf(path);
  const back = s.onboarded ? (s.role === "parent" ? "/parent" : "/settings") : i > 0 ? steps[i - 1] : "/welcome";
  const n = Math.max(1, i + 1);
  return (
    <div className="top">
      <BackLink href={back} />
      <Ticks className="obt" n={24} on={Math.round((n / steps.length) * 24)} label={`Step ${n} of ${steps.length}`} />
    </div>
  );
}

/** The message preview beside the contact and code steps on web: an SMS, or an email. */
export function SmsBox({ got, email = false, parent = false }: { got: boolean; email?: boolean; parent?: boolean }) {
  const chip = { background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.18)" };
  return (
    <div className="smsbox">
      <div className="smshd"><span>{email ? "Inbox" : "Messages"}{parent ? " · your parent's phone" : ""}</span><span>now</span></div>
      <div className="smsfrom"><span className="av" style={{ width: 40, height: 40, fontSize: 14, background: "var(--forest)", color: "var(--gold)" }}>N</span><b>NYANSA</b></div>
      <div className="smsb">
        {parent ? "Your child wants to join Nyansa. If you agree, give them this code: " : "Your Nyansa code is "}
        <b className={got ? "hl" : ""}>482 916</b>. It expires in 10 minutes.{parent ? "" : " Don't share it with anyone."}
      </div>
      {got && <span className="lvl" style={{ justifySelf: "start", background: "var(--sage)", borderColor: "transparent", color: "var(--ink)" }}>✓ Code received</span>}
      <div className="chips" style={{ margin: "6px 0 0", padding: 0, flexWrap: "wrap" }}>
        {email
          ? <><span className="chip" style={chip}>No phone needed</span><span className="chip" style={chip}>Check your spam folder</span></>
          : <><span className="chip" style={chip}>No email needed</span><span className="chip" style={chip}>Works on any phone</span></>}
      </div>
    </div>
  );
}
