import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/8 bg-deep/60 backdrop-blur-sm transition-all duration-500 ease-out-expo hover:border-white/20 hover:bg-deep/80",
        className
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div
          className="absolute -inset-px"
          style={{
            background:
              "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,107,53,0.08), transparent 40%)",
          }}
        />
      </div>
      {children}
    </div>
  );
}
