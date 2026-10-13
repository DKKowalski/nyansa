/** Nyansa's mark: the Nyansapo "wisdom knot" from Adinkra. Nyansa means wisdom in Twi. */
export function KnotMark({ color, width = 7 }: { color: string; width?: number }) {
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round">
      <path d="M50 50C40 36 20 36 20 50S40 64 50 50 80 36 80 50 60 64 50 50" />
      <path d="M50 50C36 40 36 20 50 20S64 40 50 50 36 80 50 80 64 60 50 50" />
    </g>
  );
}

export function LogoTile({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="26" fill="#0A3F2C" />
      <KnotMark color="#F2B33D" />
    </svg>
  );
}

export function LogoBare({ size, color = "#F2B33D", style }: { size: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={style}>
      <KnotMark color={color} />
    </svg>
  );
}

export function Wordmark({ size = 34 }: { size?: number }) {
  return (
    <span className="brandrow">
      <LogoTile size={size} />
      <span>nyansa</span>
    </span>
  );
}

/** Tutor avatar used in chat and the check-in. */
export function TutorFace({ size = 28 }: { size?: number }) {
  return (
    <span className="face">
      <LogoBare size={size} />
    </span>
  );
}
