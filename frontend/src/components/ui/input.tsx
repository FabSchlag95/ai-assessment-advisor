import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      style={{boxShadow:props.value?"0 1px 0 rgba(0, 0, 0, 0.2)":""}}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
        "flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "border-none focus:shadow-[0_1px_0_rgba(0,0,0,0.2)] transition-shadow",
        "not-placeholder-shown:shadow-[0_1px_0_rgba(0,0,0,0.2)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
