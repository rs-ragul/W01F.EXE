import { ReactNode, CSSProperties, useRef } from "react";
import { cn } from "@/lib/utils";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glow" | "terminal";
  style?: CSSProperties;
  enableTilt?: boolean;
}

export function CyberCard({
  children,
  className,
  variant = "default",
  style,
  enableTilt = true,
}: CyberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--spot-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--spot-y", `${(y / rect.height) * 100}%`);

    if (enableTilt && window.innerWidth > 768) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative bg-[#070d18]/80 backdrop-blur-md p-6 transition-transform duration-200 ease-out",
        "border border-cyan-500/20 hover:border-cyan-400/60",
        "shadow-[0_18px_70px_hsl(220_42%_2%/0.4)]",
        "hover:shadow-[0_24px_90px_rgba(0,240,255,0.15)]",
        variant === "glow" && "cyber-glow",
        variant === "terminal" && "font-mono",
        className
      )}
      style={{
        clipPath:
          "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
        willChange: "transform",
        ...style,
      }}
    >
      {/* Specular light spot */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle 220px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0, 240, 255, 0.12), transparent 70%)",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 transition-colors duration-300 group-hover:border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 transition-colors duration-300 group-hover:border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 transition-colors duration-300 group-hover:border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 transition-colors duration-300 group-hover:border-cyan-400" />

      {variant === "terminal" && (
        <div className="absolute top-2.5 left-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
        </div>
      )}

      <div className={cn("relative z-10", variant === "terminal" && "mt-3")}>{children}</div>
    </div>
  );
}
