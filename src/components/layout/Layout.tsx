import { ReactNode, useState } from "react";
import { Navbar } from "./Navbar";
import { TelemetryHud } from "@/components/cyber/TelemetryHud";
import { CyberCanvas } from "@/components/cyber/CyberCanvas";
import { CyberTerminal } from "@/components/cyber/CyberTerminal";
import { MobileBottomDock } from "./MobileBottomDock";
import { Shield, Github, Linkedin, Twitter, Terminal, Heart, Globe, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { cyberAudio } from "@/lib/cyberAudio";
import { useProjects } from "@/hooks/useProjects";
import { useAchievements } from "@/hooks/useAchievements";
import { useProfiles } from "@/hooks/useProfiles";
import { useSiteStats } from "@/hooks/useSiteStats";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { data: projects } = useProjects();
  const { data: achievements } = useAchievements();
  const { data: profiles } = useProfiles();
  const { data: siteStats } = useSiteStats();

  return (
    <div className="min-h-screen bg-[#030712] text-foreground relative flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Interactive 60fps Neural Particle Canvas */}
      <CyberCanvas />

      {/* Cyberpunk CRT Scanline Effect */}
      <div className="pointer-events-none fixed inset-0 z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%)] bg-[length:100%_4px] opacity-20" />

      {/* Ambient Radial Lights */}
      <div className="fixed -top-40 left-1/4 h-[35rem] w-[35rem] bg-cyan-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 right-1/10 h-[30rem] w-[30rem] bg-red-500/[0.05] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/3 h-[32rem] w-[32rem] bg-blue-600/[0.06] rounded-full blur-[150px] pointer-events-none" />

      {/* Top Telemetry Ticker HUD */}
      <TelemetryHud />

      {/* Floating Tactical Navbar */}
      <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-20 md:pt-24 pb-20 md:pb-12">
        {children}
      </main>

      {/* Floating Tactical CLI Modal (Loaded with Dynamic Realtime Supabase Data) */}
      {isTerminalOpen && (
        <CyberTerminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          isFloating={true}
          projects={projects}
          achievements={achievements}
          profiles={profiles}
          stats={siteStats}
        />
      )}

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomDock onOpenTerminal={() => setIsTerminalOpen(true)} />

      {/* High-End Cyber Footer */}
      <footer className="relative z-20 border-t border-cyan-500/20 bg-[#050a14]/90 backdrop-blur-xl mt-24">
        {/* Subtle grid light line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand & Identity */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950 to-black border border-cyan-500/40 p-1 flex items-center justify-center">
                  <img
                    src="/wolf-logo-transparent.png"
                    alt="w0lf.exe logo"
                    className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                  />
                </div>
                <div>
                  <span className="font-display text-xl font-black text-white tracking-wider">
                    w0lf<span className="text-cyan-400">.exe</span>
                  </span>
                  <p className="text-[11px] font-mono text-zinc-400">Student Engineering & Cybersecurity Lab • PSNA CET</p>
                </div>
              </div>

              <p className="text-sm text-zinc-400 max-w-md font-sans leading-relaxed">
                CSE (Cyber Security) engineering student collective specializing in software development, Android apps, hackathons, and national & international CTF competitions.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://github.com/w0lfexe"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="GitHub Organization"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/w0lfexe"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/w0lfexe"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsTerminalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 hover:bg-emerald-900/50"
                >
                  <Terminal className="w-3 h-3" />
                  <span>CLI</span>
                </button>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                <Radio className="w-3 h-3" />
                Navigation
              </h4>
              <ul className="space-y-2 font-mono text-xs">
                <li>
                  <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                    › Operations Hub
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-zinc-400 hover:text-white transition-colors">
                    › Projects & Software
                  </Link>
                </li>
                <li>
                  <Link to="/achievements" className="text-zinc-400 hover:text-white transition-colors">
                    › Championship Record
                  </Link>
                </li>
                <li>
                  <Link to="/members" className="text-zinc-400 hover:text-white transition-colors">
                    › Operatives Roster
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Operational Dossier */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Telemetry
              </h4>
              <div className="space-y-2 font-mono text-[11px] text-zinc-400">
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>COLLEGE:</span>
                  <span className="text-zinc-300">PSNA CET</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>DEPARTMENT:</span>
                  <span className="text-zinc-300">CSE (CYBER SECURITY)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>DATABASE:</span>
                  <span className="text-emerald-400 font-bold">SUPABASE REALTIME</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>FOUNDER:</span>
                  <span className="text-zinc-300">Ragul S (@RScraft)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <div>
              © 2026 w0lf.exe Cybersecurity & Engineering Collective. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Student Builders & CTF Champions</span>
              <span>•</span>
              <span className="text-cyan-400 font-bold">PSNA CET</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
