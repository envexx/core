import { HaloButton, type HaloButtonProps } from "./halo-button";
import { cn } from "@/lib/utils";

/** Use the installed Cult UI button while keeping navigation as an actual link. */
export function AgencyAction({ href, className, ...props }: HaloButtonProps & { href?: string }) {
  return <HaloButton className={cn("agency-halo-action", className)} {...(href ? { render: <a href={href} />, nativeButton: false, role: "link" as const } : {})} {...props} />;
}
