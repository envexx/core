import { useEffect, type RefObject } from "react";

export function useHeroEntrance(heroRef: RefObject<HTMLElement>, language: string) {
  useEffect(() => {
    if (!heroRef.current) return;
    let active = true;
    let media: { add(query: string, fn: () => void | (() => void), scope?: unknown): void; revert(): void } | undefined;
    // GSAP stays out of the entry chunk; entrance runs as soon as it arrives.
    import("gsap").then(({ gsap }) => {
      // If GSAP arrives after first paint, animating from opacity 0 would hide visible content.
      if (!active || !heroRef.current || performance.now() > 1200) return;
      media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: .9 } });
        timeline.from(".hero-eyebrow", { y: 10, opacity: 0, clearProps: "transform,opacity" }, 0)
          .from(".hero-heading-word", { y: 18, opacity: 0, stagger: .055, clearProps: "transform,opacity" }, .08)
          .from(".hero-description", { y: 16, opacity: 0, clearProps: "transform,opacity" }, .26)
          .from(".hero-cta, .hero-secondary", { y: 12, opacity: 0, stagger: .1, clearProps: "transform,opacity" }, .38);
      }, heroRef);
    });
    return () => { active = false; media?.revert(); };
  }, [heroRef, language]);
}
