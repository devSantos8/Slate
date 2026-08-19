"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

function DropdownMenuTrigger({
  children,
  asChild = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const context = React.useContext(DropdownContext);
  if (!context) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context.setOpen((prev) => !prev);
    if (onClick) onClick(e);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as React.ComponentProps<"button">;
    return React.cloneElement(children as React.ReactElement<React.ComponentProps<"button">>, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        if (childProps.onClick) childProps.onClick(e);
        handleClick(e);
      },
      className: cn(childProps.className, className),
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("outline-none cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({ className, align = "right", children, ...props }: React.ComponentProps<"div"> & { align?: "left" | "right" | "start" | "end" }) {
  const context = React.useContext(DropdownContext);
  if (!context || !context.open) return null;

  const isRight = align === "right" || align === "end";

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-lg border border-border/60 bg-popover p-1.5 text-popover-foreground shadow-lg animate-in fade-in-80 zoom-in-95",
        isRight ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({ className, onClick, disabled, children, ...props }: React.ComponentProps<"div"> & { disabled?: boolean }) {
  const context = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (onClick) onClick(e);
    if (context) context.setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2.5 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-40 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-border/50", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
