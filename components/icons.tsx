import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const line = (sw = 1.8) => ({ fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" }) as const;

function svg(children: React.ReactNode, attrs: SVGProps<SVGSVGElement>) {
  return function Icon({ size, ...p }: P) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...attrs} {...(size ? { width: size, height: size } : {})} {...p}>
        {children}
      </svg>
    );
  };
}

export const I = {
  back: svg(<path d="M19 12H5M11 6l-6 6 6 6" />, line()),
  arrow: svg(<path d="M5 12h14M13 6l6 6-6 6" />, line()),
  up: svg(<path d="M7 17 17 7M8 7h9v9" />, line()),
  check: svg(<path d="m5 12.5 4.5 4.5L19 7.5" />, line(2.2)),
  close: svg(<path d="M6 6l12 12M18 6 6 18" />, line(2)),
  copy: svg(<><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" /></>, line(1.7)),
  bell: svg(<><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>, line(1.7)),
  search: svg(<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>, line(1.7)),
  cal: svg(<><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01" /></>, line(1.7)),
  camera: svg(<><rect x="3.5" y="6.5" width="17" height="13" rx="3" /><path d="M9 6.5 10.5 4h3L15 6.5" /><circle cx="12" cy="13" r="3.2" /></>, line(1.7)),
  clock: svg(<><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>, line()),
  book: svg(<><path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5z" /><path d="M12 6v13.5" /></>, line(1.7)),
  cap: svg(<><path d="M2.5 9 12 4.5 21.5 9 12 13.5z" /><path d="M6.5 11v4.5c3 2.5 8 2.5 11 0V11" /></>, line(1.7)),
  person: svg(<><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" /></>, line(1.7)),
  people: svg(<><circle cx="9" cy="8.5" r="3" /><circle cx="16.5" cy="9.5" r="2.4" /><path d="M3.5 19c.8-3.4 3.2-4.8 5.5-4.8s4.7 1.4 5.5 4.8M15 14.4c2.4-.4 4.6.8 5.5 4.1" /></>, line(1.7)),
  flame: svg(<path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .2 2 1 3 2 3.2C11 8 11 5 12 2z" />, { fill: "currentColor" }),
  filter: svg(<path d="M4 7h16M7 12h10M10 17h4" />, line()),
  wifi: svg(<><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 16a5 5 0 0 1 6.4 0" /><circle cx="12" cy="19.3" r="1" fill="currentColor" /></>, line()),
  globe: svg(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" /></>, line(1.7)),
  lock: svg(<><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>, line()),
  chevL: svg(<path d="M15 6l-6 6 6 6" />, line()),
  chevR: svg(<path d="M9 6l6 6-6 6" />, line()),
  home: svg(<path d="M4 10.2 12 4l8 6.2V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" />, { fill: "currentColor" }),
  learn: svg(<path d="M3.5 5.6C6 4.3 9 4.4 11.3 6v14c-2.3-1.5-5.3-1.6-7.8-.4zM12.7 6c2.3-1.6 5.3-1.7 7.8-.4v14c-2.5-1.2-5.5-1.1-7.8.4z" />, { fill: "currentColor" }),
  practice: svg(<path d="M13.5 2 5 13.5h6L9.5 22 19 9.5h-6z" />, { fill: "currentColor" }),
  tutor: svg(<path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-6.5L8 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z" />, { fill: "currentColor" }),
  progress: svg(<><rect x="4" y="11" width="3.5" height="9" rx="1.5" /><rect x="10.2" y="5" width="3.5" height="15" rx="1.5" /><rect x="16.5" y="8.5" width="3.5" height="11.5" rx="1.5" /></>, { fill: "currentColor" }),
  settings: svg(<><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.2 1.2M17.6 15.3l2.2 1.2M4.2 16.5l2.2-1.2M17.6 8.7l2.2-1.2" /></>, line(1.8)),
  google: function Google(p: P) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
        <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" />
        <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
        <path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z" />
        <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 5.9 12 5.9z" />
      </svg>
    );
  },
};

export type IconName = keyof typeof I;

/** Faint star in the corner of pastel cards. */
export function Deco() {
  return (
    <svg className="deco" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 8l9 27 28 1-22 17 8 27-23-16-23 16 8-27-22-17 28-1z" fill="#fff" />
    </svg>
  );
}
