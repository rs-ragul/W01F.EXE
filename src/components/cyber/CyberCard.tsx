import { ReactNode, CSSProperties, useRef } from "react";
import { cn } from "@/lib/utils";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glow" | "terminal";
  style?: CSSProperties;
}

export function CyberCard({
  children,
  className,
  variant = "default",
  style,
}: CyberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--spot-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative bg-card/70 backdrop-blur-sm p-6 transition-all duration-300",
        "border border-primary/20 hover:border-primary/60",
        "shadow-[0_18px_70px_hsl(220_42%_2%/0.32)]",
        "hover:-translate-y-1.5 hover:shadow-[0_24px_90px_hsl(220_42%_2%/0.45),0_0_30px_hsl(var(--primary)/0.16)]",
        variant === "glow" && "cyber-glow",
        variant === "terminal" && "font-mono",
        className
      )}
      style={{
        clipPath:
          "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
        ...style,
      }}
    >
      {/* Mouse spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle 200px at var(--spot-x, 50%) var(--spot-y, 50%), hsl(var(--primary) / 0.14), transparent 70%)",
        }}
      />

      {/* Border shimmer sweep on hover */}
      <div className="border-shimmer" />

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/[0.55] transition-colors duration-300 group-hover:border-primary" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/[0.55] transition-colors duration-300 group-hover:border-primary" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/[0.55] transition-colors duration-300 group-hover:border-primary" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/[0.55] transition-colors duration-300 group-hover:border-primary" />

      {variant === "terminal" && (
        <div className="absolute top-2 left-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-destructive/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-secondary/80" />
        </div>
      )}

      <div className={cn("relative z-10", variant === "terminal" && "mt-4")}>{children}</div>
    </div>
  );
}
