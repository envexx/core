# Installed Cult UI components

Installed through `pnpm dlx shadcn@latest add` from the official Cult UI registry (not recreated).

- Halo Button: https://www.cult-ui.com/docs/components/halo-button.md
- Halo Card: https://www.cult-ui.com/docs/components/halo-card.md
- Fluid AI Workloads: https://www.cult-ui.com/docs/components/fluid-ai-workloads.md
- Gateway SVG Illustration: https://www.cult-ui.com/docs/components/gateway-svg-illustration.md
- Cutout Card: https://www.cult-ui.com/docs/components/cutout-card.md
- Text Animate: https://www.cult-ui.com/docs/components/text-animate.md

Cutout Card uses native lazy-loaded images in Vite and HSL-compatible surface tokens. Text Animate retains registry presets with word wrapping, semantic heading wrappers, viewport entrances, and reduced-motion support. Cutout content enters on scroll; its link action stays visible for touch and keyboard users.

Local adaptations: theme-token gradients, HSL token compatibility for the existing Tailwind v3 project, the `fine-hover` variant and `w-[22rem]`, reduced-motion rim animation, and CORE brand marks in illustrations. Base UI is pinned to 1.3.0, which supports React 18 without the optional date-fns v4 peer conflict introduced by newer releases. Existing date-fns v3 / react-day-picker v8 are preserved.
