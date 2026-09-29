/**
 * Site-wide Brand Atmosphere & Light Field.
 * Pure CSS/SVG, rendered on the server with zero client overhead.
 *
 * Derived directly from the VANIKARA logo geometry:
 * - Dual-wing aerodynamic flow (warm kinetic wing on the left, cool intelligence wing on the right)
 * - Multi-tiered blade ribbons with soft volumetric light
 * - Precision vector contour lines tracing aerodynamic airfoils and the central delta spire
 * - Technical dot-matrix intelligence grid with radial mask
 * - Traveling specular light sweep & interactive pointer-reactive glow on fine pointers
 */
export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="site-bg">
      {/* 1. Base Canvas Wash */}
      <div className="site-bg__wash" />

      {/* 2. Technical Dot Matrix Pattern (Aerospace & Intelligence Grid) */}
      <div className="site-bg__grid" />

      {/* 3. Ambient Dual-Wing Color Fields */}
      <div className="site-bg__field site-bg__field--cool" />
      <div className="site-bg__field site-bg__field--warm" />
      <div className="site-bg__field site-bg__field--apex" />

      {/* 4. Brand Shape Geometry Layer: Dual-Wing Aerodynamic Contours */}
      <svg
        className="site-bg__geometry"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Cool wing gradients (Electric Cyan -> Cobalt -> Deep Aerospace Navy) */}
          <linearGradient id="bg-blade-cool-primary" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.9" />
            <stop offset="45%" stopColor="var(--brand-primary)" stopOpacity="var(--brand-gradient-opacity)" />
            <stop offset="100%" stopColor="var(--vanikara-deep-blue)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bg-blade-cool-secondary" x1="0.95" y1="0.1" x2="0.1" y2="0.9">
            <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.75" />
            <stop offset="55%" stopColor="var(--brand-primary)" stopOpacity="calc(var(--brand-gradient-opacity) * 0.75)" />
            <stop offset="100%" stopColor="var(--vanikara-deep-blue)" stopOpacity="0" />
          </linearGradient>

          {/* Warm wing gradients (Solar Gold -> Vivid Orange -> Crimson Red) */}
          <linearGradient id="bg-blade-warm-primary" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-accent-warm)" stopOpacity="0.9" />
            <stop offset="45%" stopColor="var(--brand-secondary)" stopOpacity="calc(var(--brand-gradient-opacity) * 0.9)" />
            <stop offset="100%" stopColor="var(--vanikara-red)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bg-blade-warm-secondary" x1="0.05" y1="0.1" x2="0.9" y2="0.9">
            <stop offset="0%" stopColor="var(--brand-accent-warm)" stopOpacity="0.75" />
            <stop offset="55%" stopColor="var(--brand-secondary)" stopOpacity="calc(var(--brand-gradient-opacity) * 0.7)" />
            <stop offset="100%" stopColor="var(--vanikara-orange)" stopOpacity="0" />
          </linearGradient>

          {/* Precision contour strokes */}
          <linearGradient id="bg-contour-cool" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.95" />
            <stop offset="60%" stopColor="var(--brand-primary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bg-contour-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-accent-warm)" stopOpacity="0.95" />
            <stop offset="60%" stopColor="var(--brand-secondary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bg-spire-glow" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--brand-accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--brand-accent-warm)" stopOpacity="0" />
          </linearGradient>

          {/* Volumetric blur: adjusted to 18px so wing blade silhouettes remain distinct */}
          <filter id="bg-volumetric" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        {/* Aerodynamic Volumetric Light Streams (Soft Blades) */}
        <g filter="url(#bg-volumetric)" className="site-bg__volumetric">
          {/* Cool wing (Right): sweeping down-left toward apex */}
          <path
            d="M 1560 -60 C 1240 100, 1020 360, 810 560 S 730 840, 740 980"
            stroke="url(#bg-blade-cool-primary)"
            strokeWidth="130"
            strokeLinecap="round"
          />
          <path
            d="M 1440 120 C 1180 260, 960 480, 830 680 S 750 870, 755 980"
            stroke="url(#bg-blade-cool-secondary)"
            strokeWidth="80"
            strokeLinecap="round"
          />

          {/* Warm wing (Left): sweeping down-right toward apex */}
          <path
            d="M -120 40 C 240 140, 480 340, 630 560 S 685 840, 695 980"
            stroke="url(#bg-blade-warm-primary)"
            strokeWidth="110"
            strokeLinecap="round"
          />
          <path
            d="M -20 220 C 280 300, 500 480, 640 680 S 675 870, 680 980"
            stroke="url(#bg-blade-warm-secondary)"
            strokeWidth="70"
            strokeLinecap="round"
          />
        </g>

        {/* Architectural Wing Contours (Precision Vector Guides) */}
        <g className="site-bg__contours text-fg">
          {/* Cool wing contours */}
          <path
            d="M 1520 20 C 1220 140, 1000 380, 790 580 S 732 820, 735 940"
            stroke="url(#bg-contour-cool)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
          <path
            d="M 1400 160 C 1150 290, 940 490, 810 680 S 742 860, 745 950"
            stroke="url(#bg-contour-cool)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 1260 280 C 1060 400, 880 570, 780 740 S 735 880, 738 960"
            stroke="url(#bg-contour-cool)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />

          {/* Warm wing contours */}
          <path
            d="M -80 80 C 240 180, 480 380, 650 580 S 700 820, 705 940"
            stroke="url(#bg-contour-warm)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
          <path
            d="M 40 220 C 300 320, 510 490, 660 680 S 702 860, 700 950"
            stroke="url(#bg-contour-warm)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 180 340 C 380 440, 560 590, 675 740 S 705 880, 702 960"
            stroke="url(#bg-contour-warm)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />

          {/* Aerospace Orbital Guides (Concentric Wing Flight Arcs) */}
          <circle cx="720" cy="500" r="480" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 9" />
          <circle cx="720" cy="500" r="320" stroke="currentColor" strokeOpacity="0.06" />

          {/* Central upward delta spire negative-space axis */}
          <line
            x1="720"
            y1="240"
            x2="720"
            y2="880"
            stroke="url(#bg-spire-glow)"
            strokeWidth="2"
            strokeDasharray="4 14"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* 5. Interactive Pointer Aura (Fine pointers only, zero main-thread JS) */}
      <div className="site-bg__interactive" />

      {/* 6. Traveling Specular Sheen (Faceted light reflecting off wing ridges) */}
      <div className="site-bg__sweep" />

      {/* 7. Filmic Texture & Edge Vignette */}
      <div className="site-bg__noise" />
      <div className="site-bg__vignette" />
    </div>
  );
}
