/**
 * Site-wide "light field". Pure CSS/SVG, rendered on the server.
 *
 * Depth planes (see globals.css): three large light fields on different
 * periods, soft flowing ribbons that converge downward like the symbol's
 * wings, and an occasional sweep. Grain and vignette sit on top. All motion
 * is transform/opacity on the compositor; it is simplified on small screens
 * and disabled for reduced-motion users.
 */
export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="site-bg">
      <div className="site-bg__wash" />
      <div className="site-bg__field site-bg__field--blue" />
      <div className="site-bg__field site-bg__field--cyan" />
      <div className="site-bg__field site-bg__field--warm" />
      <svg
        className="site-bg__ribbons"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="bg-ribbon-cool" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--vanikara-cyan)", stopOpacity: 0 }} />
            <stop offset="45%" style={{ stopColor: "var(--vanikara-blue)", stopOpacity: "var(--bg-ribbon)" }} />
            <stop offset="100%" style={{ stopColor: "var(--vanikara-deep-blue)", stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="bg-ribbon-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--vanikara-gold)", stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: "var(--vanikara-orange)", stopOpacity: "calc(var(--bg-ribbon) * 0.45)" }} />
            <stop offset="100%" style={{ stopColor: "var(--vanikara-orange)", stopOpacity: 0 }} />
          </linearGradient>
          <filter id="bg-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
        </defs>

        <g filter="url(#bg-soft)">
          <path d="M1540 -80 C 1200 120, 1000 380, 800 560 S 720 860, 730 1000" stroke="url(#bg-ribbon-cool)" strokeWidth="150" strokeLinecap="round" />
          <path d="M-120 40 C 260 140, 520 330, 640 560 S 690 860, 700 1000" stroke="url(#bg-ribbon-warm)" strokeWidth="110" strokeLinecap="round" />
        </g>

      </svg>
      <div className="site-bg__sweep" />
      <div className="site-bg__noise" />
      <div className="site-bg__vignette" />
    </div>
  );
}
