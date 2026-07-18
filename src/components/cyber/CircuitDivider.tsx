import { cn } from "@/lib/utils";

interface CircuitDividerProps {
  className?: string;
}

export function CircuitDivider({ className }: CircuitDividerProps) {
  return (
    <div
      className={cn("relative mx-auto flex w-full max-w-5xl items-center px-4", className)}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#FF3B30]/40" />
      <span className="relative mx-3 flex h-3 w-3 shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-3 w-3 rotate-45 animate-ping rounded-[2px] bg-gradient-to-br from-[#FF3B30]/40 to-[#29A9FF]/40" />
        <span className="relative inline-flex h-1.5 w-1.5 rotate-45 rounded-[1px] bg-gradient-to-br from-[#FF3B30] to-[#29A9FF]" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#29A9FF]/40" />
    </div>
  );
}
