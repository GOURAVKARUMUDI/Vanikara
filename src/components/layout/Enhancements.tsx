"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide progressive enhancements, mounted once:
 *  - Scroll reveal: a single IntersectionObserver adds `.is-visible`
 *    to elements marked `data-reveal` (styles live in globals.css).
 *  - Card light: one delegated pointer listener feeds --mx/--my to the
 *    hovered `.card-interactive` so its highlight follows the cursor,
 *    --rx/--ry to `[data-tilt]` cards and --tx/--ty to `[data-magnetic]`.
 *  - Scroll: --scroll (0..1) on <html> for the progress bar, and a gentle
 *    translate for `[data-parallax]` elements (value = speed factor).
 * No React state is updated per frame.
 */
export default function Enhancements() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("is-visible");
            observer.unobserve(el);

            // Once the reveal has played, hand the element back to its own
            // styles — otherwise the reveal's transform/transition rules
            // keep overriding hover states (card lift, border, shadow).
            const release = () => {
              el.removeEventListener("transitionend", onEnd);
              clearTimeout(fallback);
              el.removeAttribute("data-reveal");
            };
            const onEnd = (e: TransitionEvent) => {
              if (e.target === el && e.propertyName === "transform") release();
            };
            el.addEventListener("transitionend", onEnd);
            const fallback = setTimeout(release, 2500);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const release = (el: HTMLElement | null, props: string[]) => {
      if (!el) return;
      props.forEach((prop) => el.style.removeProperty(prop));
    };

    const apply = () => {
      frame = 0;
      if (!lastEvent) return;
      const hit = lastEvent.target as Element | null;

      // Magnetic pull: move up to ~6px toward the pointer
      const nextMagnet = hit?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextMagnet !== magnet) {
        release(magnet, ["--tx", "--ty"]);
        magnet = nextMagnet;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = (lastEvent.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (lastEvent.clientY - (r.top + r.height / 2)) / (r.height / 2);
        magnet.style.setProperty("--tx", `${(dx * 6).toFixed(2)}px`);
        magnet.style.setProperty("--ty", `${(dy * 4).toFixed(2)}px`);
      }

      // 3D tilt: at most 5deg on either axis
      const nextTilt = hit?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (nextTilt !== tilted) {
        release(tilted, ["--rx", "--ry"]);
        tilted = nextTilt;
      }
      if (tilted) {
        const r = tilted.getBoundingClientRect();
        const px = (lastEvent.clientX - r.left) / r.width - 0.5;
        const py = (lastEvent.clientY - r.top) / r.height - 0.5;
        tilted.style.setProperty("--rx", `${(-py * 10).toFixed(2)}deg`);
        tilted.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
      }

      const xPct = Math.round((lastEvent.clientX / window.innerWidth) * 100);
      const yPct = Math.round((lastEvent.clientY / window.innerHeight) * 100);
      document.documentElement.style.setProperty("--cursor-x", `${xPct}%`);
      document.documentElement.style.setProperty("--cursor-y", `${yPct}%`);

      const target = hit?.closest<HTMLElement>(".card-interactive, [data-light]");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${lastEvent.clientX - rect.left}px`);
      target.style.setProperty("--my", `${lastEvent.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      release(magnet, ["--tx", "--ty"]);
      release(tilted, ["--rx", "--ry"]);
      magnet = tilted = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parallax = reduced || window.innerWidth < 768 ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");

      const vh = window.innerHeight;
      for (const el of parallax) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const speed = Number(el.dataset.parallax) || 0.1;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      parallax.forEach((el) => (el.style.translate = ""));
    };
  }, [pathname]);

  return null;
}
