import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAchievements } from "@/hooks/useAchievements";
import { useSiteStats } from "@/hooks/useSiteStats";
import { TrophyShowcase } from "@/components/cyber/TrophyShowcase";
import {
  Trophy,
  Award,
  Target,
  Flag,
  Calendar,
  Medal,
  Star,
  Shield,
  Terminal,
  ExternalLink,
  Users,
  Sparkles,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Target,
  Flag,
  Medal,
  Star,
  Shield,
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  competition: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/40",
  },
  recognition: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/40",
  },
  discovery: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
  },
  certification: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/40",
  },
};

export default function Achievements() {
  const { data: achievements, isLoading } = useAchievements();
  const { data: stats } = useSiteStats();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Milestones" },
    { id: "competition", label: "CTFs & Tournaments" },
    { id: "discovery", label: "Labs & Exploits" },
    { id: "recognition", label: "Awards & Honors" },
  ];

  const filteredAchievements = (achievements || []).filter((a) => {
    if (activeFilter === "all") return true;
    return a.achievement_type === activeFilter;
  });

  return (
    <Layout>
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#081220]/80 border border-amber-500/30 rounded-full mb-4 select-none">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-amber-300 uppercase tracking-widest font-bold">
                COMPETITIVE RECORD & HALL OF FAME
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              <span className="text-amber-400">#</span> Championship Victories
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
              National & international Capture The Flag wins, technical hackathon recognitions, and ethical hacking milestones.
            </p>
          </div>

          {/* Championship Podium Highlight */}
          <div className="mb-20">
            <TrophyShowcase />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveFilter(c.id);
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className={`text-xs font-mono px-4 py-2 rounded-full border transition-all ${
                  activeFilter === c.id
                    ? "bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(255,184,0,0.3)] font-bold scale-105"
                    : "bg-[#070d18]/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Milestones Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <Terminal className="w-10 h-10 text-amber-400 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-400 font-mono text-sm">Loading verified victory records...</p>
            </div>
          ) : filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAchievements.map((achievement) => {
                const colors = typeColors[achievement.achievement_type] || typeColors.competition;
                const IconComponent = iconMap[achievement.icon || "Trophy"] || Trophy;

                return (
                  <Link
                    to={`/achievement/${achievement.id}`}
                    key={achievement.id}
                    onClick={() => cyberAudio.playClick()}
                    onMouseEnter={() => cyberAudio.playHover()}
                    className="group rounded-2xl p-1 bg-gradient-to-b from-amber-500/10 via-zinc-800/20 to-transparent border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                  >
                    <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/90 p-6 flex flex-col justify-between backdrop-blur-xl">
                      <div>
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border} transition-transform group-hover:scale-110`}
                          >
                            <IconComponent className={`w-6 h-6 ${colors.text}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                                {achievement.title}
                              </h3>
                              {achievement.is_highlighted && (
                                <span className="text-amber-400 text-sm">★</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                              <Calendar className="w-3 h-3 text-zinc-500" />
                              <span>
                                {achievement.achievement_date
                                  ? new Date(achievement.achievement_date).toLocaleDateString("en-US", {
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "Verified"}
                              </span>
                              <span>•</span>
                              <span className={`uppercase font-bold ${colors.text}`}>
                                {achievement.achievement_type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-4">
                          {achievement.description}
                        </p>

                        {/* Operatives Tag */}
                        {achievement.is_team_achievement ? (
                          <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 mb-2 bg-cyan-950/30 px-2.5 py-1 rounded border border-cyan-900/40">
                            <Users className="w-3 h-3 text-cyan-400" />
                            <span>Team W01F.EXE Squad</span>
                          </div>
                        ) : achievement.owner ? (
                          <div className="text-[11px] font-mono text-zinc-400 mb-2">
                            <span>Operative: </span>
                            <span className="text-amber-400 font-bold">@{achievement.owner.username}</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500">Verified Milestone</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View Dossier ›
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#060b14]/70 border border-zinc-800 rounded-2xl">
              <Trophy className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-mono text-sm">No records found for this category.</p>
            </div>
          )}

          {/* Telemetry Stats Banner */}
          {stats && stats.length > 0 && (
            <div className="mt-16 p-6 rounded-2xl bg-[#070d18]/80 border border-cyan-500/20 backdrop-blur-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((s) => (
                  <div key={s.id}>
                    <div className="font-display text-3xl font-black text-amber-400 mb-1">
                      {s.stat_value}
                    </div>
                    <div className="text-xs font-mono text-zinc-400 uppercase">
                      {s.stat_label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
