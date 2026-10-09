import type { SVGProps } from "react";
export function BrandMark({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 32 32" fill="none" className={`brand-mark ${className}`} aria-hidden="true" {...props}>
    <image href="/logos/core-mascot.svg" width="32" height="32" preserveAspectRatio="xMidYMid meet" />
  </svg>;
}
