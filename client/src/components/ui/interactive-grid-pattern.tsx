// Adapted from Magic UI's MIT-licensed Interactive Grid Pattern.
// https://magicui.design/docs/components/interactive-grid-pattern
import { useState, type SVGProps } from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  squaresClassName?: string;
}

export function InteractiveGridPattern({ width = 64, height = 64, squares = [28, 14], className, squaresClassName, ...props }: InteractiveGridPatternProps) {
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [horizontal, vertical] = squares;
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
