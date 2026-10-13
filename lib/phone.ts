/** Ghana mobile numbers: 9 digits after +233, starting with 2 or 5 (e.g. 24 123 4567).
 *  Students type them many ways: "024 123 4567", "+233 24 123 4567", "233241234567". */
export function ghanaDigits(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("233")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return d;
}

export const isGhanaMobile = (raw: string) => /^[25]\d{8}$/.test(ghanaDigits(raw));

/** "24 123 4567" for a valid number, otherwise the digits as typed. */
export function formatGhana(raw: string) {
  const d = ghanaDigits(raw);
  return d.length === 9 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}` : d;
}
