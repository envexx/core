import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useInView } from "motion/react";

type EnergyPath = { source: string; d: string; track: string; side: number; xs: number[]; ys: number[] };
type Geometry = { width: number; height: number; paths: EnergyPath[]; trunks: string[] };

/** Measure the actual icon and logo positions so beams stay connected on resize. */
export default function HeroEnergy({ heroRef }: { heroRef: RefObject<HTMLElement> }) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  const visible = useInView(heroRef, { amount: 0.1 });
  const [geometry, setGeometry] = useState<Geometry>({ width: 1, height: 1, paths: [], trunks: [] });
  useEffect(() => {
    const hero = heroRef.current;
    const logo = hero?.querySelector<HTMLElement>(".hero-symbol-anchor");
    if (!hero || !logo) return;
    const measure = () => {
      const bounds = hero.getBoundingClientRect();
      const logoBounds = logo.getBoundingClientRect();
      const centerX = logoBounds.left + logoBounds.width / 2 - bounds.left;
      const centerY = logoBounds.top + logoBounds.height / 2 - bounds.top;
      const paths: EnergyPath[] = ["one", "two", "three", "four"].flatMap((name, index) => {
        if (bounds.width < 600 && index > 1) return [];
        const icon = hero.querySelector<HTMLElement>(`.orbit-${name}`);
        if (!icon) return [];
        const rect = icon.getBoundingClientRect();
        const startX = rect.left + rect.width / 2 - bounds.left;
        const startY = rect.top + rect.height / 2 - bounds.top;
        const side = startX < centerX ? -1 : 1;
        const endX = centerX + side * (logoBounds.width / 2 + 22);
        const endY = centerY;
        const span = Math.abs(endX - startX);
        const controlX = index > 1 ? startX : startX - side * span * 0.3;
        const controlY = index > 1 ? endY + (startY - endY) * 0.35 : startY;
        const secondX = endX + side * span * (index > 1 ? 0.65 : 0.38);
        const cubic = (start: number, a: number, b: number, end: number, t: number) => (1-t)**3*start + 3*(1-t)**2*t*a + 3*(1-t)*t*t*b + t**3*end;
        const samples = Array.from({ length: 61 }, (_, i) => i / 60);
        const track = `M ${startX} ${startY} C ${controlX} ${controlY}, ${secondX} ${endY}, ${endX} ${endY}`;
        return [{ source: name, d: `${track} L ${centerX} ${centerY}`, track, side,
          xs: [...samples.map(t => cubic(startX, controlX, secondX, endX, t)), ...Array.from({ length: 12 }, (_, i) => endX + (centerX-endX)*(i+1)/12)],
          ys: [...samples.map(t => cubic(startY, controlY, endY, endY, t)), ...Array(12).fill(centerY)],
        }];
      });
      setGeometry({ width: bounds.width, height: bounds.height, paths, trunks: [-1, 1].map(side => `M ${centerX + side * (logoBounds.width / 2 + 22)} ${centerY} L ${centerX} ${centerY}`) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(hero); observer.observe(logo);
    measure();
    return () => observer.disconnect();
  }, [heroRef]);
  useEffect(() => {
    const svg = svgRef.current;
    const logo = heroRef.current?.querySelector<HTMLElement>(".hero-symbol");
    if (!svg || !logo || !geometry.paths.length) return;
    const gradients = Array.from(svg.querySelectorAll("radialGradient"));
    const beams = Array.from(svg.querySelectorAll<SVGGElement>(".hero-energy-pulse"));
    const reset = () => {
      beams.forEach(beam => { beam.style.opacity = "0"; });
      for (const name of ["x", "y", "rx", "ry", "rz", "charge"]) logo.style.setProperty(`--energy-${name}`, "0");
    };
    reset();
    if (!visible || reducedMotion) return;
    let frame = 0;
    const started = performance.now();
    const slot = 2.8, travel = 2.15;
    const tick = (now: number) => {
      const time = Math.max(0, (now - started) / 1000);
      const index = Math.floor(time / slot) % geometry.paths.length;
      const local = time % slot;
      const path = geometry.paths[index];
      if (svg.dataset.source !== path.source) svg.dataset.source = path.source;
      const progress = Math.min(local / travel, 1);
      const sample = progress * (path.xs.length - 1);
      const left = Math.floor(sample), right = Math.min(left + 1, path.xs.length - 1);
      const mix = sample - left;
      const gradient = gradients[index];
      gradient.cx.baseVal.value = path.xs[left] * (1-mix) + path.xs[right] * mix;
      gradient.cy.baseVal.value = path.ys[left] * (1-mix) + path.ys[right] * mix;
      const light = Math.min(local / .25, 1) * Math.max(0, Math.min((travel + .25 - local) / .35, 1));
      beams.forEach((beam, i) => { beam.style.opacity = i === index ? String(light) : "0"; });
      // Reception begins as the pulse enters the shared connector, then settles.
      const arrival = Math.max(0, Math.min((local - 1.75) / (slot - 1.75), 1));
      const response = Math.sin(arrival * Math.PI);
      logo.style.setProperty("--energy-x", String(path.side * 2 * response));
      logo.style.setProperty("--energy-y", String((index > 1 ? 1 : -1) * response));
      logo.style.setProperty("--energy-rx", String((index > 1 ? 8 : -5) * response));
      logo.style.setProperty("--energy-ry", String(path.side * 13 * response));
      logo.style.setProperty("--energy-rz", String(path.side * 7 * response));
      logo.style.setProperty("--energy-charge", String(response));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); reset(); };
  }, [visible, reducedMotion, geometry, heroRef]);
  return <svg ref={svgRef} className="hero-energy" viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" data-active={visible}>
    <defs>{geometry.paths.map((path, index) => <radialGradient key={index} id={`${id}-energy-${index}`} gradientUnits="userSpaceOnUse" r={geometry.width < 600 ? 28 : 44} cx={path.xs[0]} cy={path.ys[0]}>
      <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity=".95" />
      <stop offset=".3" stopColor="hsl(var(--primary))" stopOpacity=".75" />
      <stop offset=".7" stopColor="hsl(var(--primary))" stopOpacity=".25" />
      <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />

    </radialGradient>)}</defs>
    {geometry.trunks.map((path, index) => <path key={`trunk-${index}`} className="hero-energy-track hero-energy-trunk" d={path} />)}
    {geometry.paths.map((path, index) => <path key={`branch-${index}`} className="hero-energy-track" d={path.track} />)}
    {geometry.paths.map((path, index) => <g className="hero-energy-pulse" key={index} style={{ opacity: 0 }}>
      <path className="hero-energy-aura" d={path.d} stroke={`url(#${id}-energy-${index})`} />
      <path className="hero-energy-beam" d={path.d} stroke={`url(#${id}-energy-${index})`} />
    </g>)}
  </svg>;
}



