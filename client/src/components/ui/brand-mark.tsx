import type { SVGProps } from "react";
export function BrandMark({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 32 32" fill="none" className={`brand-mark ${className}`} aria-hidden="true" {...props}>
    <path d="M16 3v7M16 22v7M3 16h7M22 16h7M6.8 6.8l5 5M20.2 20.2l5 5M6.8 25.2l5-5M20.2 11.8l5-5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <circle cx="16" cy="16" r="5" fill="currentColor" />
  </svg>;
}
