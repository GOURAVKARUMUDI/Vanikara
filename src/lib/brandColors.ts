/**
 * Brand palette for contexts that cannot read CSS variables
 * (chart libraries, generated images, HTML email, third-party widgets).
 * Keep in sync with the --vanikara-* tokens in src/app/globals.css.
 */
export const BRAND = {
  // Primary brand anchors derived from the New Logo's dual wings
  primary: "#006EFF",
  secondary: "#FF6A00",
  accent: "#00CFFF",
  accentWarm: "#FFD21F",
  bg: "#F7F9FC",
  bgDark: "#050816",
  surface: "rgba(255, 255, 255, 0.76)",
  surfaceDark: "rgba(11, 19, 48, 0.68)",
  glowCool: "rgba(0, 110, 255, 0.12)",
  glowWarm: "rgba(255, 106, 0, 0.08)",

  // Legacy and specific shade tokens
  blue: "#006EFF",
  blueInk: "#0058D6",
  action: "#0062EB",
  deepBlue: "#082B73",
  cyan: "#00CFFF",
  orange: "#F4511E",
  brightOrange: "#FF6A00",
  gold: "#FFB300",
  yellow: "#FFD21F",
  red: "#B71C1C",
  navy: "#071A3D",
  graphite: "#111827",
  black: "#050816",
  offWhite: "#F7F9FC",
  gray: "#E9EEF5",
  slate: "#66758B",
} as const;
