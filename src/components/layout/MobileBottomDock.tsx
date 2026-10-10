import { Link, useLocation } from "react-router-dom";
import { Home, Code, Trophy, Users, Terminal } from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

interface MobileBottomDockProps {
  onOpenTerminal: () => void;
}

export function MobileBottomDock({ onOpenTerminal }: MobileBottomDockProps) {
  const location = useLocation();

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: Code },
    { href: "/achievements", label: "Wins", icon: Trophy },
    { href: "/members", label: "Team", icon: Users },
  ];

  return (
    <nav
      className="md:hidden fixed left-3 right-3 z-50 bg-[#060b14]/95 border border-cyan-500/30 rounded-2xl p-1.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(0,240,255,0.15)] select-none"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      aria-label="Mobile Navigation Dock"
    >
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => cyberAudio.playClick()}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold scale-105"
                  : "text-zinc-400 hover:text-zinc-200 active:scale-95"
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Terminal Trigger Button */}
        <button
          onClick={() => {
            cyberAudio.playAccessGranted();
            onOpenTerminal();
          }}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 active:scale-95 transition-all"
        >
          <Terminal className="w-4 h-4 mb-1 animate-pulse" />
          <span className="text-[10px] font-mono tracking-tight font-bold">CLI</span>
        </button>
      </div>
    </nav>
  );
}
