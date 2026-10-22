import {
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/lib/utils"
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion"

const LABEL_STAGGER_SEC = 0.018
const LABEL_CHAR_DURATION_SEC = 0.16
const DEFAULT_LOADING_STAGGER_SEC = 0.038
const DEFAULT_LOADING_CHAR_DURATION_SEC = 0.36

function usePrefersReducedMotion() {
  return useReducedMotionPreference()
}

function ButtonSpinner({
  className,
  reduceMotion,
}: {
  className?: string
  reduceMotion: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex origin-center text-muted-foreground",
        !reduceMotion && "animate-spin",
        className
      )}
    >
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5"
        focusable="false"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-[0.22]"
          cx="12"
          cy="12"
          fill="none"
          r="9"
          stroke="currentColor"
          strokeWidth="2.25"
        />
        <circle
          cx="12"
          cy="12"
          fill="none"
          r="9"
          stroke="currentColor"
          strokeDasharray="14 42"
          strokeLinecap="round"
          strokeWidth="2.25"
        />
      </svg>
    </span>
  )
}

function StaggeredTextLabel({
  text,
  reduceMotion,
  staggerSec = LABEL_STAGGER_SEC,
  charDurationSec = LABEL_CHAR_DURATION_SEC,
}: {
  text: string
  reduceMotion: boolean
  staggerSec?: number
  charDurationSec?: number
}) {
  const chars = useMemo(() => {
    const counts = new Map<string, number>()
    return Array.from(text, (char) => {
      const count = counts.get(char) ?? 0
      counts.set(char, count + 1)
      return { char, key: `${char}-${count}` }
    })
  }, [text])

  return (
    <span className="inline-flex items-center font-medium text-foreground text-sm tracking-tight antialiased">
      {chars.map((glyph, index) => (
        <span
          className="inline-block whitespace-pre"
          key={glyph.key}
          style={
            reduceMotion
              ? undefined
              : {
                  animation: `halo-char-in ${charDurationSec}s ease-out both`,
                  animationDelay: `${index * staggerSec}s`,
                }
          }
        >
          {glyph.char}
        </span>
      ))}
    </span>
  )
}

function TrailingLoadingSlot({
  reduceMotion,
  reveal,
}: {
  reduceMotion: boolean
  reveal: boolean
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-full",
        "pointer-events-none bg-muted text-muted-foreground shadow-foreground/10 shadow-sm ring-1 ring-foreground/10",
        !reduceMotion && "transition-[opacity,transform] duration-200 ease-out"
      )}
      style={{
        opacity: reveal ? 1 : 0,
        transform: reveal || reduceMotion ? "scale(1)" : "scale(0.88)",
      }}
    >
      <ButtonSpinner reduceMotion={reduceMotion} />
    </div>
  )
}

export interface HaloButtonProps
  extends Omit<ComponentProps<typeof ButtonPrimitive>, "children"> {
  children: ReactNode
  /** Frosted inner surface so gradient blobs read through (matches search translucent mode). */
  translucent?: boolean
  /** Shows trailing spinner and sets `aria-busy`; label switches to `loadingText`. */
  isLoading?: boolean
  /** Copy shown while `isLoading` (staggered when `staggerLabel` is true). */
  loadingText?: string
  /** Stagger between loading glyphs (seconds). */
  loadingStaggerSec?: number
  /** Duration of each loading glyph fade-in (seconds). */
  loadingCharDurationSec?: number
  /**
   * When `children` is a string, replay character stagger on change.
   * Ignored for non-string children.
   */
  staggerLabel?: boolean
  className?: string
}

export function HaloButton({
  children,
  className,
  translucent = true,
  isLoading = false,
  loadingText = "Working…",
  loadingStaggerSec = DEFAULT_LOADING_STAGGER_SEC,
  loadingCharDurationSec = DEFAULT_LOADING_CHAR_DURATION_SEC,
  staggerLabel = true,
  disabled,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  style,
  ...props
}: HaloButtonProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  /** Spinner fades in after the width settles, so it does not lead the expansion. */
  const [trailingRevealReady, setTrailingRevealReady] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!isLoading) {
      setTrailingRevealReady(false)
      return
    }
    if (reduceMotion) {
      setTrailingRevealReady(true)
      return
    }
    const id = window.setTimeout(() => setTrailingRevealReady(true), 480)
    return () => window.clearTimeout(id)
  }, [isLoading, reduceMotion])

  /** `disabled` + `pointer-events-none` while loading can strand `isHovered`; ignore hover then. */
  const hoverAllowed = !(disabled || isLoading)
  const rimEmphasis = isFocused || (isHovered && hoverAllowed)

  const borderGlow = useMemo(() => {
    let idleOpacity: number
    if (translucent) {
      idleOpacity = rimEmphasis ? 0.92 : 0.72
    } else {
      idleOpacity = rimEmphasis ? 0.78 : 0.5
    }
    return {
      opacityIdle: idleOpacity,
      primaryBg: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--ring)), hsl(var(--accent)), hsl(var(--primary)))",
      secondaryBg: "linear-gradient(90deg, hsl(var(--ring)), hsl(var(--primary)), hsl(var(--primary)))",
      tertiaryBg: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--ring)))",
    }
  }, [translucent, rimEmphasis])

  const labelIsString = typeof children === "string"

  const labelContent = (() => {
    if (isLoading) {
      if (staggerLabel) {
        return (
          <StaggeredTextLabel
            charDurationSec={loadingCharDurationSec}
            reduceMotion={reduceMotion}
            staggerSec={loadingStaggerSec}
            text={loadingText}
          />
        )
      }
      return (
        <span className="font-medium text-foreground text-sm tracking-tight antialiased">
          {loadingText}
        </span>
      )
    }
    if (labelIsString && staggerLabel) {
      return <StaggeredTextLabel reduceMotion={reduceMotion} text={children} />
    }
    return (
      <span className="font-medium text-foreground text-sm tracking-tight antialiased">
        {children}
      </span>
    )
  })()

  let fillBackground: string
  if (translucent) {
    if (isHovered && hoverAllowed) {
      fillBackground =
        "linear-gradient(to bottom, color-mix(in oklch, hsl(var(--card)) 88%, transparent) 0%, color-mix(in oklch, hsl(var(--card)) 74%, transparent) 100%)"
    } else {
      fillBackground =
        "linear-gradient(to bottom, color-mix(in oklch, hsl(var(--card)) 82%, transparent) 0%, color-mix(in oklch, hsl(var(--card)) 70%, transparent) 100%)"
    }
  } else if (isHovered && hoverAllowed) {
    fillBackground =
      "linear-gradient(to bottom, hsl(var(--card)) 0%, color-mix(in oklch, hsl(var(--card)) 90%, hsl(var(--muted))) 100%)"
  } else {
    fillBackground =
      "linear-gradient(to bottom, hsl(var(--card)) 0%, color-mix(in oklch, hsl(var(--card)) 94%, hsl(var(--muted))) 100%)"
  }

  return (
    <div className={cn("relative inline-flex max-w-full", className)}>
      <div className="relative rounded-full p-px">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-250 ease-out"
            style={{ opacity: borderGlow.opacityIdle }}
          >
            <div
              className={cn(
                "-bottom-4 absolute h-16 w-48 blur-xl",
                !reduceMotion && "halo-blob halo-blob-primary"
              )}
              style={{ background: borderGlow.primaryBg }}
            />
            <div
              className={cn(
                "-bottom-3 absolute h-12 w-32 blur-lg",
                !reduceMotion && "halo-blob halo-blob-secondary"
              )}
              style={{ background: borderGlow.secondaryBg }}
            />
            <div
              className={cn(
                "-bottom-2 absolute h-10 w-24 blur-lg",
                !reduceMotion && "halo-blob halo-blob-tertiary"
              )}
              style={{ background: borderGlow.tertiaryBg }}
            />
          </div>
        </div>

        <ButtonPrimitive
          aria-busy={isLoading || undefined}
          className={cn(
            "relative flex min-h-11 min-w-0 select-none items-center gap-2.5 rounded-full px-6 py-2.5",
            "border border-border/90",
            "shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_1px_2px_rgba(0,0,0,0.04),0_4px_14px_rgba(0,0,0,0.05)]",
            "dark:border-border dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_1px_2px_rgba(0,0,0,0.35),0_4px_20px_rgba(0,0,0,0.35)]",
            "outline-none focus-visible:border-ring/70 focus-visible:ring-2 focus-visible:ring-ring/30 dark:focus-visible:border-zinc-500/45",
            "transition-[transform,background-color,backdrop-filter,border-color,box-shadow] duration-200 ease-out",
            "fine-hover:hover:border-ring/50 fine-hover:hover:shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]",
            "dark:fine-hover:hover:border-zinc-500/60 dark:fine-hover:hover:shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_4px_12px_rgba(0,0,0,0.45),0_12px_32px_rgba(0,0,0,0.45)]",
            "enabled:active:scale-[0.96] motion-reduce:enabled:active:scale-100",
            "disabled:pointer-events-none disabled:opacity-50",
            translucent && "backdrop-blur-xl backdrop-saturate-150"
          )}
          disabled={disabled || isLoading}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          onFocus={(e) => {
            setIsFocused(true)
            onFocus?.(e)
          }}
          onMouseEnter={(e) => {
            setIsHovered(true)
            onMouseEnter?.(e)
          }}
          onMouseLeave={(e) => {
            setIsHovered(false)
            onMouseLeave?.(e)
          }}
          style={{
            ...style,
            background: fillBackground,
          }}
          {...props}
        >
          <span className="flex min-w-0 flex-1 items-center justify-center gap-2">
            {labelContent}
          </span>

          {isLoading ? (
            <div className="relative size-7 shrink-0">
              <TrailingLoadingSlot
                reduceMotion={reduceMotion}
                reveal={trailingRevealReady}
              />
            </div>
          ) : null}
        </ButtonPrimitive>
      </div>
    </div>
  )
}
