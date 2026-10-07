import { useState, useEffect } from "react";
import { ShieldAlert, Activity, Wifi, Compass, Clock } from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

export function TelemetryHud() {
  const [time, setTime] = useState("");
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const pingTimer = setInterval(() => {
      setPing(Math.floor(18 + Math.random() * 12));
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, []);

  return (
    <div
      className="w-full bg-[#030712]/90 border-b border-cyan-500/15 backdrop-blur-md text-[11px] font-mono tracking-wider text-muted-foreground select-none overflow-x-auto no-scrollbar py-1 px-4 z-40 relative"
      onMouseEnter={() => cyberAudio.playHover()}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 whitespace-nowrap min-w-max">
        {/* Left Telemetry */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-400">SYS.ONLINE</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-zinc-400">NODE: W01F-PRIME</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>10.0270° N, 77.9803° E</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>DEFCON 4 [TACTICAL LAB]</span>
          </div>
        </div>

        {/* Right Telemetry */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-zinc-400">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <span>CHAMPIONS: $N1PH€RS 3.0 // EXPLOIT-X</span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-400">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span>RTT: {ping}ms</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300 font-bold bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{time || "00:00:00"} IST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
