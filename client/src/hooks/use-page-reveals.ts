import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

export function usePageReveals(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    let active = true;
    let media: ReturnType<typeof gsap.matchMedia> | undefined;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!active || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current!;
        const reveal = (selector: string, targets?: string, stagger = 0) => {
          root.querySelectorAll<HTMLElement>(selector).forEach(group => {
            const elements = targets ? group.querySelectorAll<HTMLElement>(targets) : [group];
            if (!elements.length) return;
            gsap.from(elements, { y: 22, opacity: 0, duration: 1, stagger, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: group, start: "top 90%", once: true } });
          });
        };
        reveal(".showcase-heading, .section-heading, .home-blog-heading, .process-intro");
        reveal(".simple-flow-panel, .home-study-grid");
        reveal(".integration-strip", "a", .065);
        reveal(".services-bento", ".service-card", .09);
        reveal(".process-grid", "article", .1);
        reveal(".contact-panel", ".contact-copy, .contact-form", .12);
      }, rootRef);
    });
    return () => { active = false; media?.revert(); };
  }, [rootRef]);
}

