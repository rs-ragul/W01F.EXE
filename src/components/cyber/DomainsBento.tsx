import { Shield, Cpu, Terminal, Sparkles, Layers, ArrowUpRight, Binary, Lock, Eye, Workflow, Smartphone, Code2, Award, Zap } from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";
import { Link } from "react-router-dom";

export function DomainsBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 grid-flow-dense">
      {/* 1. Card: Software & Mobile Development (Span 7) */}
      <div
        className="md:col-span-7 rounded-2xl p-1 bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/30 group hover:border-cyan-400/70 transition-all duration-500 hover:-translate-y-1"
        onMouseEnter={() => cyberAudio.playHover()}
      >
        <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/95 p-6 md:p-8 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 font-bold flex items-center gap-1.5">
                <Code2 className="w-3 h-3" />
                SOFTWARE SYSTEMS & APP ENGINEERING
              </span>
              <span className="text-xs font-mono text-zinc-500">01</span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-2.5 tracking-tight">
              Full-Stack & Mobile Development
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-6">
              As CSE students, we turn concepts into production-grade systems. From native Android apps with Kotlin and Jetpack Compose to high-performance web applications and backend APIs with React, Next.js, and Supabase.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs mb-6">
              <div className="p-2.5 rounded-lg bg-[#0b1424] border border-zinc-800 flex items-center gap-2 text-zinc-300">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Kotlin & Compose</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b1424] border border-zinc-800 flex items-center gap-2 text-zinc-300">
                <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>React & Next.js</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b1424] border border-zinc-800 flex items-center gap-2 text-zinc-300">
                <Cpu className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Rust Tooling</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b1424] border border-zinc-800 flex items-center gap-2 text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Postgres & RLS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b1424] border border-zinc-800 flex items-center gap-2 text-zinc-300">
                <Workflow className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Firebase Realtime</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b1424] border border-zinc-800 flex items-center gap-2 text-zinc-300">
                <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>Vercel Cloud</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">Featured: Belora, Hemorex, Srinivasa</span>
            <Link
              to="/projects"
              onClick={() => cyberAudio.playClick()}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform"
            >
              Explore Repositories <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Card: Hackathons & Fast Execution (Span 5) */}
      <div
        className="md:col-span-5 rounded-2xl p-1 bg-gradient-to-b from-amber-500/20 via-emerald-500/10 to-transparent border border-amber-500/30 group hover:border-amber-400/70 transition-all duration-500 hover:-translate-y-1"
        onMouseEnter={() => cyberAudio.playHover()}
      >
        <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/95 p-6 md:p-8 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-amber-950/60 text-amber-400 border border-amber-800/60 font-bold flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                HACKATHONS & INNOVATION
              </span>
              <span className="text-xs font-mono text-zinc-500">02</span>
            </div>

            <h3 className="font-display text-2xl font-extrabold text-white mb-2.5 tracking-tight">
              Rapid Hackathons & Tech Events
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-6">
              We excel in high-intensity 24–48hr hackathons and startup pitch competitions. Designing, building, and deploying working products that solve real problems.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#0b1424] border border-zinc-800">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Startup Idea Pitch Festival 2026
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">Won Best Idea of the Department with Belora</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0b1424] border border-zinc-800">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Hack Fest @ QEVRA '26
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">3-Day sprint building Hemorex emergency blood connect</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-6">
            <span className="text-xs font-mono text-emerald-400 font-bold">100% Shipped Code</span>
            <Link
              to="/achievements"
              onClick={() => cyberAudio.playClick()}
              className="text-xs font-mono text-amber-400 hover:text-amber-200 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform"
            >
              See Hackathon Wins <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Card: Cybersecurity & CTF Warfare (Span 7) */}
      <div
        className="md:col-span-7 rounded-2xl p-1 bg-gradient-to-b from-red-500/20 via-pink-500/10 to-transparent border border-red-500/30 group hover:border-red-400/70 transition-all duration-500 hover:-translate-y-1"
        onMouseEnter={() => cyberAudio.playHover()}
      >
        <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/95 p-6 md:p-8 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-red-950/60 text-red-400 border border-red-800/60 font-bold flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                CYBERSECURITY & CTF OPERATIONS
              </span>
              <span className="text-xs font-mono text-zinc-500">03</span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-2.5 tracking-tight">
              Offensive Security & CTF Champions
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-4">
              We specialize in Capture The Flag competitions and security research. Actively solving real-world challenges across Web Exploitation, Digital Forensics, Reverse Engineering, Cryptography, Binary Pwn, and OSINT.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] mb-4">
              <div className="p-2 rounded bg-[#0b1424] border border-zinc-800 text-zinc-300">● Web Exploitation</div>
              <div className="p-2 rounded bg-[#0b1424] border border-zinc-800 text-zinc-300">● Digital Forensics</div>
              <div className="p-2 rounded bg-[#0b1424] border border-zinc-800 text-zinc-300">● Binary Pwn</div>
              <div className="p-2 rounded bg-[#0b1424] border border-zinc-800 text-zinc-300">● Reverse Eng (IDA)</div>
              <div className="p-2 rounded bg-[#0b1424] border border-zinc-800 text-zinc-300">● Cryptography</div>
              <div className="p-2 rounded bg-[#0b1424] border border-zinc-800 text-zinc-300">● OSINT Recon</div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold">1st Place $N1PH€RS 3.0 & EXPLOIT-X</span>
            <Link
              to="/achievements"
              onClick={() => cyberAudio.playClick()}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform"
            >
              Inspect Trophies <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Card: AI & Intelligent Tooling (Span 5) */}
      <div
        className="md:col-span-5 rounded-2xl p-1 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent border border-purple-500/30 group hover:border-purple-400/70 transition-all duration-500 hover:-translate-y-1"
        onMouseEnter={() => cyberAudio.playHover()}
      >
        <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/95 p-6 md:p-8 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-purple-950/60 text-purple-400 border border-purple-800/60 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI & AUTOMATION
              </span>
              <span className="text-xs font-mono text-zinc-500">04</span>
            </div>

            <h3 className="font-display text-2xl font-extrabold text-white mb-2.5 tracking-tight">
              AI, OCR & Automation Tooling
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-4">
              Integrating applied intelligence into practical software: OCR mark analysis pipelines in GPAlytics with Tesseract.js, and automated forensic artifact correlation in forensic-rs.
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/50 text-purple-300">Tesseract.js OCR</span>
              <span className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/50 text-purple-300">GPAlytics AI</span>
              <span className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/50 text-purple-300">forensic-rs CLI</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-6">
            <span className="text-xs font-mono text-zinc-400">Computer Vision & Tooling</span>
            <Link
              to="/projects"
              onClick={() => cyberAudio.playClick()}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
            >
              Explore AI Builds <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
