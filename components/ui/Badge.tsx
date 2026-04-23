import { cn } from "@/lib/cn";

export function Badge({
  className,
  children,
  tone = "default",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "signal" | "copper" | "chart";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest border",
        tone === "default" && "border-white/15 text-mist",
        tone === "signal" && "border-signal/40 text-signal bg-signal/5",
        tone === "copper" && "border-copper/40 text-copper bg-copper/5",
        tone === "chart" && "border-chart/40 text-chart bg-chart/5",
        className
      )}
    >
      {children}
    </span>
  );
}
