import * as React from "react";
import { cn } from "~/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 sm:h-12 w-full rounded-[4px] border border-white/20 bg-[#181818] px-4 py-2.5 text-base sm:text-sm text-white placeholder:text-neutral-500 transition-colors focus-visible:outline-none focus-visible:border-[#0070d1] focus-visible:ring-1 focus-visible:ring-[#0070d1] disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
