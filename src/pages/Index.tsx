import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { TrophyShowcase } from "@/components/cyber/TrophyShowcase";
import { DomainsBento } from "@/components/cyber/DomainsBento";
import { ProjectsSpotlight } from "@/components/cyber/ProjectsSpotlight";
import { SkillsMatrix } from "@/components/cyber/SkillsMatrix";
import { CyberTerminal } from "@/components/cyber/CyberTerminal";
import { StatCounter } from "@/components/cyber/StatCounter";
import { CircuitDivider } from "@/components/cyber/CircuitDivider";
import { useSiteStats } from "@/hooks/useSiteStats";
import { useProjects } from "@/hooks/useProjects";
import { useAchievements } from "@/hooks/useAchievements";
import { useProfiles } from "@/hooks/useProfiles";
import { cyberAudio } from "@/lib/cyberAudio";
import {
  Shield,
  Terminal,
  Code,
  Users,
  Trophy,
  ChevronRight,
  Flame,
  Zap,
  Radio,
  ExternalLink,
  Target,
  Sparkles,
  Layers,
  Smartphone,
  Cpu,
  Mail,
  Github,
  UserPlus,
} from "lucide-react";

export default function Index() {
  const { data: siteStats, isLoading: statsLoading } = useSiteStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();
  const { data: profiles } = useProfiles();
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);

  // Dynamic Site Stats from Supabase
  const dynamicStats = (siteStats || []).map((stat) => ({
    value: stat.stat_value,
    label: stat.stat_label,
    suffix: stat.stat_key.includes("bounty") ? "+" : "+",
  }));

  // Fallback stats if database is empty initially
  const displayStats =
    dynamicStats.length > 0
      ? dynamicStats
      : [
          { value: 2, label: "CTF 1st Titles", suffix: "+" },
          { value: 6, label: "Active Codebases", suffix: "+" },
          { value: 2, label: "Core Operatives", suffix: "" },
          { value: 1, label: "Hackathons Won", suffix: "+" },
        ];

  return (
    <Layout>
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO WITH AUTHENTIC WOLF ARTWORK & MOTION
          Utilizes the user's authentic hero-wolf-bg.png with kinetic
          circuit flow streams, optic sensor pulses, and light scans.
      ───────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden px-4 py-12 sm:py-16 md:min-h-[calc(100vh-4rem)] md:py-24">
        {/* User's Exact Hero Wolf Background Image */}
        <div className="hero-home-bg absolute inset-0" />

        {/* Cinematic Gradient Overlays for High Legibility (Vertical on mobile, Horizontal on desktop) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/95 via-[#030712]/85 to-[#030712]/95 lg:bg-[linear-gradient(90deg,hsl(220_24%_5%/0.96)_0%,hsl(220_24%_5%/0.85)_40%,hsl(220_24%_5%/0.35)_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_44%,rgba(0,240,255,0.08),transparent_50%)] pointer-events-none" />

        {/* Kinetic Animated Circuit Stream Lines & Optic Sensors */}
        <div className="hero-wolf-activity pointer-events-none absolute inset-0">
          <svg
            className="hero-flow-lines absolute inset-0 h-full w-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            aria-hidden="true"
          >
            {/* Red Team Circuit Lines */}
            <g className="hero-flow hero-flow-red" strokeLinecap="round" strokeLinejoin="round">
              <path d="M780 456H646l-48-48H492" />
              <path d="M792 548H646l-56 56H474" />
              <path d="M852 642 770 724H642" />
              <path d="M828 332 760 264h-96" />
            </g>
            {/* Blue Team Circuit Lines */}
            <g className="hero-flow hero-flow-blue" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1342 332h126l54-54h78" />
              <path d="M1330 448h150l52 52h86" />
              <path d="M1294 586 1370 662h132" />
              <path d="M1362 702h92l54 54" />
            </g>
            {/* Steel Circuit Lines */}
            <g className="hero-flow hero-flow-steel" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1090 226v-88l-30-30" />
              <path d="M1130 226v-82l36-36V64" />
              <path d="M1450 236 1504 182h72" />
              <path d="M730 248 676 194h-86" />
            </g>
          </svg>

          {/* Glowing Red & Blue Sensor Optic Eyes */}
          <div className="hero-eye hero-eye-red" />
          <div className="hero-eye hero-eye-blue" />
          <div className="hero-scan-sweep" />
        </div>

        {/* Hero Content Container */}
        <div className="container relative z-10 mx-auto grid items-center gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="max-w-2xl text-left space-y-5 sm:space-y-6">
            {/* Student Engineering Identity Pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#081220]/90 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-mono tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.25)] select-none max-w-full"
              onMouseEnter={() => cyberAudio.playHover()}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="font-bold truncate">CSE (CYBER SECURITY) • PSNA CET</span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-zinc-400 hidden sm:inline">ENGINEERING COLLECTIVE</span>
            </div>

            {/* Red / Blue Team Indicator */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <span className="text-[#FF3B30]">Red</span>
              <span className="text-foreground">team.</span>
              <span className="text-[#29A9FF]">Blue</span>
              <span className="text-foreground">team.</span>
              <span className="text-zinc-400 text-xs sm:text-sm">• Software Builders & CTF Champs</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight break-words">
              ENGINEERING SYSTEMS.
              <span className="block text-cyan-400 sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-[#FF3B30] sm:via-cyan-400 sm:to-[#29A9FF] mt-1 drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                HUNTING VULNERABILITIES.
              </span>
            </h1>

            {/* Subtitle stating true identity */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-sans leading-relaxed max-w-xl">
              We are a team of CSE (Cyber Security) engineering students who build production software, develop Android apps, compete in hackathons, and win national & international CTF tournaments.
            </p>

            {/* Action Buttons: Responsive 2-Col Grid on Mobile, Flex on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg">
              <Link to="/projects" onClick={() => cyberAudio.playClick()} className="w-full">
                <button
                  onMouseEnter={() => cyberAudio.playHover()}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Code className="w-4 h-4 shrink-0" />
                  <span>VIEW ENGINEERING WORK</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-auto hidden sm:block" />
                </button>
              </Link>

              <Link to="/join" onClick={() => cyberAudio.playClick()} className="w-full">
                <button
                  onMouseEnter={() => cyberAudio.playHover()}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-mono font-bold text-xs sm:text-sm tracking-wide hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>JOIN THE PACK</span>
                </button>
              </Link>
            </div>

            {/* Secondary Action Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link to="/achievements" onClick={() => cyberAudio.playClick()}>
                <button
                  onMouseEnter={() => cyberAudio.playHover()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081220]/80 border border-amber-500/40 text-amber-300 font-mono text-xs tracking-wide hover:bg-amber-950/40 hover:border-amber-400 transition-all"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>CTF CHAMPIONSHIPS</span>
                </button>
              </Link>

              <Link to="/members" onClick={() => cyberAudio.playClick()}>
                <button
                  onMouseEnter={() => cyberAudio.playHover()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800 text-zinc-300 font-mono text-xs hover:text-white hover:border-zinc-700 transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span>OPERATIVES ROSTER</span>
                </button>
              </Link>
            </div>

            {/* Quick Live Record Bar */}
            <div className="pt-3 flex items-center gap-2 text-[11px] sm:text-xs font-mono text-zinc-400 border-t border-zinc-800/80 overflow-hidden">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <div className="overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
                <span className="text-zinc-300">
                  1st Place $N1PH€RS 3.0 International CTF • 1st Place EXPLOIT-X National CTF • Best Idea Startup Pitch
                </span>
              </div>
            </div>
          </div>

          {/* Right column empty spacer for wolf background visual balance on desktop */}
          <div className="hidden lg:block min-h-[400px]" aria-hidden="true" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: DYNAMIC STATS TELEMETRY
          Fully linked to Supabase site_stats table.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-cyan-500/15 bg-[#050a14]/75 backdrop-blur-md relative">
        <div className="container mx-auto px-4 max-w-6xl">
          {statsLoading ? (
            <div className="text-center py-4">
              <Terminal className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayStats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-[#08111e]/50 border border-zinc-800/80 hover:border-cyan-500/40 transition-colors"
                  onMouseEnter={() => cyberAudio.playHover()}
                >
                  <StatCounter end={stat.value} suffix={stat.suffix} label={stat.label} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CircuitDivider className="py-8" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CHAMPIONSHIP PODIUM (100% DYNAMIC FROM SUPABASE)
          Pulls verified achievements directly from Supabase,
          ranks them, and displays interactive celebratory effects.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold inline-flex items-center gap-1.5 mb-3">
              <Trophy className="w-3.5 h-3.5" />
              VERIFIED CHAMPIONSHIPS & AWARDS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
              Championship Record & Honors
            </h2>
            <p className="text-zinc-400 mt-3 text-sm sm:text-base font-sans">
              Our proudest moments across national & international CTF competitions, hackathons, and technical pitch events. Real-time loaded from our database.
            </p>
          </div>

          <TrophyShowcase achievements={achievements} isLoading={achievementsLoading} />
        </div>
      </section>

      <CircuitDivider className="py-8" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: STUDENT ENGINEERING DOMAINS (BENTO GRID)
          Covers Software/Mobile, Hackathons, Cybersecurity, and AI.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 relative bg-[#040812]/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-left mb-12">
            <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 font-bold inline-flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5" />
              CORE OPERATING DOMAINS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering, Not Just Theory.
            </h2>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base font-sans max-w-2xl">
              We operate across software development, mobile apps, hackathons, offensive security research, and automation.
            </p>
          </div>

          <DomainsBento />
        </div>
      </section>

      <CircuitDivider className="py-8" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: LIVE TACTICAL TERMINAL CLI (DYNAMIC PROPS)
          Linked with real projects, achievements, and members.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold inline-flex items-center gap-1.5 mb-2">
                <Terminal className="w-3.5 h-3.5" />
                INTERACTIVE CONSOLE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Live Tactical Terminal
              </h2>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              Type: <span className="text-cyan-300 font-bold">projects</span>,{" "}
              <span className="text-cyan-300 font-bold">wins</span>,{" "}
              <span className="text-cyan-300 font-bold">team</span>,{" "}
              <span className="text-cyan-300 font-bold">skills</span>
            </div>
          </div>

          <CyberTerminal
            isOpen={true}
            isFloating={false}
            projects={projects}
            achievements={achievements}
            profiles={profiles}
            stats={siteStats}
          />
        </div>
      </section>

      <CircuitDivider className="py-8" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: ENGINEERING BLUEPRINTS (100% DYNAMIC)
          Renders real projects fetched from Supabase.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 relative bg-[#040812]/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 font-bold inline-flex items-center gap-1.5 mb-2">
                <Code className="w-3.5 h-3.5" />
                OPEN-SOURCE & RESEARCH
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Engineering Projects & Codebases
              </h2>
              <p className="text-zinc-400 mt-2 text-sm max-w-xl font-sans">
                Real applications, mobile platforms, and research tools built by our team. Dynamically loaded from Supabase.
              </p>
            </div>

            <Link to="/projects" onClick={() => cyberAudio.playClick()}>
              <Button
                variant="outline"
                className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 font-mono text-xs"
              >
                View Full Catalog <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <ProjectsSpotlight projects={projects} isLoading={projectsLoading} />
        </div>
      </section>

      <CircuitDivider className="py-8" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: SKILLS & COMPETITIVE MATRIX
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <SkillsMatrix />
        </div>
      </section>

      <CircuitDivider className="py-8" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: COLLABORATION & COMMUNITY (STUDENT ENGINEERING)
          Real, sensible student engineering actions without corporate jargon.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div
            className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-cyan-950/40 via-[#070e1c]/90 to-[#02050b] border border-cyan-500/40 text-center relative overflow-hidden backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(0,240,255,0.15)]"
            onMouseEnter={() => cyberAudio.playHover()}
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <span className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <Target className="w-8 h-8" />
              </span>

              <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
                Let's Build, Hack & Collaborate.
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base font-sans max-w-xl mx-auto leading-relaxed">
                We are always excited to collaborate on open-source engineering, compete in upcoming hackathons, partner on CTF events, or brainstorm innovative software ideas.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="mailto:ragulethicalhacker@gmail.com"
                  onClick={() => cyberAudio.playClick()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-cyan-400 text-black font-mono font-bold text-sm tracking-wide hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                  GET IN TOUCH
                </a>

                <Link to="/join" onClick={() => cyberAudio.playClick()}>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono font-bold text-sm tracking-wide hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105">
                    <UserPlus className="w-4 h-4" />
                    JOIN THE PACK
                  </button>
                </Link>

                <a
                  href="https://github.com/w0lfexe"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => cyberAudio.playClick()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-sm hover:text-white hover:border-zinc-700 transition-all"
                >
                  <Github className="w-4 h-4" />
                  BROWSE GITHUB ORG
                </a>

                <Link to="/members" onClick={() => cyberAudio.playClick()}>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-400 font-mono text-sm hover:text-white hover:border-zinc-700 transition-all">
                    <Users className="w-4 h-4" />
                    MEET THE OPERATIVES
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
