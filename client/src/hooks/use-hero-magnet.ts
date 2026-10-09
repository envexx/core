import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

export function useHeroMagnet(heroRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const targets = Array.from(hero.querySelectorAll<HTMLElement>(".orbit-icon, .hero-symbol-anchor"));
      const attracted = new Set<HTMLElement>();
      const updateLines = () => hero.dispatchEvent(new Event("hero-magnetic-update"));
      const returnHome = (element: HTMLElement) => {
        if (!attracted.delete(element)) return;
        gsap.to(element, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.38)", overwrite: true, onUpdate: updateLines });
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        targets.forEach(element => {
          const rect = element.getBoundingClientRect();
          const baseX = rect.left + rect.width / 2 - Number(gsap.getProperty(element, "x"));
          const baseY = rect.top + rect.height / 2 - Number(gsap.getProperty(element, "y"));
          const dx = event.clientX - baseX, dy = event.clientY - baseY;
          const distance = Math.hypot(dx, dy);
          const isLogo = element.classList.contains("hero-symbol-anchor");
          const radius = isLogo ? 150 : 125;
          if (distance >= radius) { returnHome(element); return; }
          attracted.add(element);
          const attraction = Math.pow(1 - distance / radius, 0.8);
          const strength = isLogo ? 0.38 : 0.52;
          gsap.to(element, { x: dx * attraction * strength, y: dy * attraction * strength, duration: .38, ease: "power3.out", overwrite: true, onUpdate: updateLines });
        });
      };
      const leave = () => targets.forEach(returnHome);
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", leave);
      return () => {
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(targets);
        gsap.set(targets, { x: 0, y: 0 });
        updateLines();
      };
    });
    return () => media.revert();
  }, [heroRef]);
}
