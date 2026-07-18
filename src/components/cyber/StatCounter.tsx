import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  label: string;
}

export function StatCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  className,
  label,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className={cn("group text-center", className)}>
      <div className="mx-auto mb-3 h-px w-8 bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-all duration-300 group-hover:w-14" />
      <div className="font-display text-5xl font-bold text-primary cyber-text-glow mb-2 md:text-6xl">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
