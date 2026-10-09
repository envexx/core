// Adapted from Magic UI's MIT-licensed Interactive Grid Pattern.
// https://magicui.design/docs/components/interactive-grid-pattern
import { useId, useState, type SVGProps } from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  squaresClassName?: string;
  interactive?: boolean;
}

export function InteractiveGridPattern({ width = 64, height = 64, squares = [28, 14], className, squaresClassName, interactive = true, ...props }: InteractiveGridPatternProps) {
  const id = useId().replace(/:/g, "");
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [horizontal, vertical] = squares;
  if (!interactive) return <svg width="100%" height="100%" className={cn("interactive-grid static-grid", className)} aria-hidden="true" {...props}><defs><pattern id={`${id}-fine-grid`} width={width} height={height} patternUnits="userSpaceOnUse"><path d={`M ${width} 0 H 0 V ${height}`} fill="none" stroke="hsl(var(--border) / .48)" strokeWidth=".5" /></pattern><pattern id={`${id}-pixels`} width={width * 8} height={height * 8} patternUnits="userSpaceOnUse"><rect width={width} height={height} fill="hsl(var(--muted) / .5)" /><rect x={width * 5} y={height * 4} width={width} height={height} fill="hsl(var(--muted) / .5)" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${id}-pixels)`} /><rect width="100%" height="100%" fill={`url(#${id}-fine-grid)`} /></svg>;
  return <svg width={width * horizontal} height={height * vertical} className={cn("interactive-grid", className)} aria-hidden="true" {...props}>
    {Array.from({ length: horizontal * vertical }, (_, index) => <rect
      key={index}
      x={(index % horizontal) * width}
      y={Math.floor(index / horizontal) * height}
      width={width}
      height={height}
      className={cn("grid-square", hoveredSquare === index && "grid-square-active", index % 17 === 3 && "grid-square-filled", squaresClassName)}
      onMouseEnter={() => setHoveredSquare(index)}
      onMouseLeave={() => setHoveredSquare(null)}
    />)}
  </svg>;
}
