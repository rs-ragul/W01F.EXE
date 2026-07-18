import { ReactNode, CSSProperties } from "react";
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
  return (
    <div
      className={cn(
        "relative bg-card/70 backdrop-blur-sm p-6 transition-all duration-300",
        "border border-primary/20 hover:border-primary/[0.45]",
        "shadow-[0_18px_70px_hsl(220_42%_2%/0.32)] hover:shadow-[0_22px_90px_hsl(220_42%_2%/0.45)]",
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
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/[0.55]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/[0.55]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/[0.55]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/[0.55]" />

      {variant === "terminal" && (
        <div className="absolute top-2 left-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-destructive/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-secondary/80" />
        </div>
      )}

      <div className={cn(variant === "terminal" && "mt-4")}>{children}</div>
    </div>
  );
}
