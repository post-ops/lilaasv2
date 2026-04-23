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
          "group relative inline-flex items-center gap-2.5 font-mono uppercase tracking-widest rounded-full transition-all duration-400 ease-out-expo overflow-hidden",
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
        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
              backgroundSize: "220% 220%",
              animation: "shimmer 1.6s linear infinite",
              mixBlendMode: "overlay",
            }}
          />
        )}
        <span className="relative z-[1]">{children}</span>
        {arrow && (
          <ArrowUpRight
            size={14}
            className="relative z-[1] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
