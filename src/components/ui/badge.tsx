import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-white/10 bg-[#181818] text-white",
        primary:
          "border border-transparent bg-[#0070d1] text-white",
        blue:
          "border border-transparent bg-[#0070d1] text-white",
        commerce:
          "border border-transparent bg-[#d53b00] text-white",
        yellow:
          "border border-transparent bg-gradient-to-r from-[#ffce21] via-[#f5a623] to-[#ee8e00] text-black font-bold uppercase tracking-wider text-[11px]",
        gold:
          "border border-transparent bg-gradient-to-r from-[#ffce21] via-[#f5a623] to-[#ee8e00] text-black font-bold uppercase tracking-wider text-[11px]",
        outline:
          "border border-white/20 bg-transparent text-white",
        outlineLight:
          "border border-[#cccccc] bg-transparent text-black",
        secondary:
          "border border-[#f3f3f3] bg-[#f5f7fa] text-black",
        admin:
          "border border-[#0070d1] bg-[#121314] text-[#53b1ff] font-mono",
        sunset:
          "border border-transparent bg-[#d53b00] text-white",
        destructive:
          "border border-transparent bg-[#c81b3a] text-white font-medium",
        success:
          "border border-transparent bg-[#22c55e] text-white font-medium",
        warning:
          "border border-transparent bg-[#f59e0b] text-black font-semibold",
        info:
          "border border-transparent bg-[#0070d1] text-white font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
