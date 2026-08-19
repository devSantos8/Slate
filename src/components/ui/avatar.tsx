"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn("relative flex size-9 shrink-0 overflow-hidden rounded-full border border-border/50 shadow-xs", className)}
      {...props}
    />
  )
}

function AvatarImage({ className, alt = "", src, ...props }: React.ComponentProps<"img">) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError || !src) return null;

  return (
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted font-medium text-xs text-muted-foreground uppercase select-none",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
