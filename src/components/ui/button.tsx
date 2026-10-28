import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold tracking-[0.324px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070d1] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer select-none rounded-full",
  {
    variants: {
      variant: {
        default:
          "bg-[#0070d1] text-white hover:bg-[#0064b7] active:bg-[#004d8d] shadow-none",
        primary:
          "bg-[#0070d1] text-white hover:bg-[#0064b7] active:bg-[#004d8d] shadow-none",
        commerce:
          "bg-[#d53b00] text-white hover:bg-[#aa2f00] active:bg-[#aa2f00] shadow-none",
        luxury:
          "bg-[#0070d1] text-white hover:bg-[#0064b7] active:bg-[#004d8d] shadow-none",
        gold:
          "bg-gradient-to-r from-[#ffce21] via-[#f5a623] to-[#ee8e00] text-black hover:opacity-90 active:opacity-95 shadow-none",
        sunset:
          "bg-[#d53b00] text-white hover:bg-[#aa2f00] active:bg-[#aa2f00] shadow-none",
        destructive:
          "bg-[#c81b3a] text-white hover:bg-red-700 active:bg-red-800 shadow-none",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/10 shadow-none",
        outlineLight:
          "border border-[#cccccc] bg-transparent text-black hover:bg-black/5 shadow-none",
        secondary:
          "border border-[#cccccc] dark:border-white/20 bg-transparent text-current hover:bg-black/5 dark:hover:bg-white/10",
        ghost:
          "hover:bg-white/10 text-white hover:text-white",
        ghostLight:
          "hover:bg-black/5 text-black hover:text-black",
        link:
          "text-[#0070d1] dark:text-[#53b1ff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-7 py-3 text-sm sm:text-base",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base sm:text-lg",
        icon: "h-12 w-12 p-0 rounded-full",
        pill: "h-10 px-5 text-xs sm:text-sm rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
