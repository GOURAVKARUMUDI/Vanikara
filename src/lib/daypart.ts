/**
 * Time-of-day model behind the "auto" theme and the background's colour.
 *
 * Auto theme: light from 06:30 to 18:30 local time, dark otherwise.
 * Dayparts tint the background independently of the theme:
 *   dawn 05:00–08:00 · day 08:00–16:30 · dusk 16:30–19:30 · night 19:30–05:00
 *
 * Hours are decimal (18.5 = 18:30). Keep this file dependency-free: the
 * same numbers are inlined into the pre-paint boot script.
 */

export type Daypart = "dawn" | "day" | "dusk" | "night";

export const LIGHT_FROM = 6.5;
export const DARK_FROM = 18.5;

const DAYPARTS: { part: Daypart; from: number }[] = [
  { part: "dawn", from: 5 },
  { part: "day", from: 8 },
  { part: "dusk", from: 16.5 },
  { part: "night", from: 19.5 },
];

/** Every hour at which the theme or daypart can change. */
const BOUNDARIES = [...new Set([LIGHT_FROM, DARK_FROM, ...DAYPARTS.map((d) => d.from)])].sort((a, b) => a - b);

function decimalHour(date: Date) {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
}

export function themeForTime(date = new Date()): "light" | "dark" {
  const h = decimalHour(date);
  return h >= LIGHT_FROM && h < DARK_FROM ? "light" : "dark";
}

export function daypartForTime(date = new Date()): Daypart {
  const h = decimalHour(date);
  let current: Daypart = "night";
  for (const { part, from } of DAYPARTS) if (h >= from) current = part;
  return current;
}

/** Milliseconds until the next theme/daypart boundary (never less than 1s). */
export function msUntilNextBoundary(date = new Date()) {
  const h = decimalHour(date);
  const next = BOUNDARIES.find((b) => b > h) ?? BOUNDARIES[0] + 24;
  return Math.max(1000, Math.ceil((next - h) * 3600 * 1000) + 500);
}

export function formatHour(hour: number) {
  const hh = Math.floor(hour);
  const mm = Math.round((hour - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/** Inline JS for the <head> boot script: sets data-daypart and returns the auto theme. */
export const DAYPART_BOOT_JS = `var n=new Date(),h=n.getHours()+n.getMinutes()/60,p='night';${DAYPARTS.map((d) => `if(h>=${d.from})p='${d.part}';`).join("")}r.setAttribute('data-daypart',p);var autoDark=!(h>=${LIGHT_FROM}&&h<${DARK_FROM});`;
