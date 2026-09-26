/**
 * Site-wide atmospheric background. Pure CSS/SVG: soft blue and orange
 * light fields, a fine grid that fades out below the header, film grain,
 * and two slow flowing lines that echo the curve of the symbol's wings.
 * Rendered on the server; animations run on the compositor and are
 * disabled on small screens and for reduced-motion users (globals.css).
 */
export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="site-bg">
      <div className="site-bg__field" />
      <div className="site-bg__grid" />
      <svg
        className="site-bg__lines"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="bg-line-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--vanikara-gold)", stopOpacity: 0 }} />
            <stop offset="45%" style={{ stopColor: "var(--vanikara-orange)", stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: "var(--vanikara-orange)", stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="bg-line-cool" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--vanikara-cyan)", stopOpacity: 0 }} />
            <stop offset="45%" style={{ stopColor: "var(--vanikara-blue)", stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: "var(--vanikara-blue)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path d="M-40 120 C 320 180, 560 420, 700 900" stroke="url(#bg-line-warm)" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M1480 80 C 1120 160, 880 420, 740 900" stroke="url(#bg-line-cool)" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
      <div className="site-bg__noise" />
    </div>
  );
}
