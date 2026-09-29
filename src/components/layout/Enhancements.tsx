"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide progressive enhancements, mounted once:
 *  - Scroll reveal: a single IntersectionObserver adds `.is-visible`
 *    to elements marked `data-reveal` (styles live in globals.css).
 *  - Card light: one delegated pointer listener feeds --mx/--my to the
 *    hovered `.card-interactive` so its highlight follows the cursor.
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

    const apply = () => {
      frame = 0;
      if (!lastEvent) return;
      const xPct = Math.round((lastEvent.clientX / window.innerWidth) * 100);
      const yPct = Math.round((lastEvent.clientY / window.innerHeight) * 100);
      document.documentElement.style.setProperty("--cursor-x", `${xPct}%`);
      document.documentElement.style.setProperty("--cursor-y", `${yPct}%`);

      const target = (lastEvent.target as Element | null)?.closest<HTMLElement>(".card-interactive, [data-light]");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${lastEvent.clientX - rect.left}px`);
      target.style.setProperty("--my", `${lastEvent.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
