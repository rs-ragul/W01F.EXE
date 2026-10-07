import { cn } from "@/lib/utils";

interface MarkProps {
  className?: string;
}

export function WolfBrandMark({ className }: MarkProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <img
        src="/wolf-logo-transparent.png"
        alt="w0lf.exe authentic brand mark"
        className="h-full w-full object-contain filter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
      />
    </div>
  );
}
