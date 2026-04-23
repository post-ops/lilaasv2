import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  arrow?: boolean;
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", arrow, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        data-magnetic
        {...rest}
        className={cn(
          "group relative inline-flex items-center gap-2.5 font-mono uppercase tracking-widest rounded-full transition-all duration-400 ease-out-expo",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          size === "sm" && "px-4 py-2 text-[11px]",
          size === "md" && "px-6 py-3 text-xs",
          size === "lg" && "px-7 py-3.5 text-[13px]",
          variant === "primary" && "bg-signal text-ink hover:bg-white",
          variant === "ghost" && "text-fog hover:text-signal",
          variant === "outline" && "border border-white/15 text-fog hover:border-signal hover:text-signal",
          className
        )}
      >
        <span>{children}</span>
        {arrow && (
          <ArrowUpRight
            size={14}
            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
