import { useState } from "react";
import confetti from "canvas-confetti";
import { Trophy, Award, Target, Flag, Medal, Star, Shield, Sparkles, ExternalLink, Calendar, Users, Flame } from "lucide-react";
import { Achievement } from "@/types/database";
import { cyberAudio } from "@/lib/cyberAudio";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Target,
  Flag,
  Medal,
  Star,
  Shield,
};

interface TrophyShowcaseProps {
  achievements?: Achievement[];
  isLoading?: boolean;
}

export function TrophyShowcase({ achievements = [], isLoading = false }: TrophyShowcaseProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sort: Highlighted first, then by date descending
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.is_highlighted && !b.is_highlighted) return -1;
    if (!a.is_highlighted && b.is_highlighted) return 1;
    const dateA = a.achievement_date ? new Date(a.achievement_date).getTime() : 0;
    const dateB = b.achievement_date ? new Date(b.achievement_date).getTime() : 0;
    return dateB - dateA;
  });

  // Display top 3 for the showcase podium on the homepage
  const displayAchievements = sortedAchievements.slice(0, 3);

  const fireCelebration = (e: React.MouseEvent, id: string) => {
    setActiveId(id);
    cyberAudio.playTrophyFanfare();

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { x, y },
      colors: ["#ffd700", "#00f0ff", "#ff3366", "#00ff88"],
      disableForReducedMotion: true,
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-3 animate-pulse" />
        <p className="text-zinc-400 font-mono text-xs">Loading verified championship records...</p>
      </div>
    );
  }

  if (displayAchievements.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Ambient podium light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-amber-500/10 via-cyan-500/15 to-red-500/10 blur-3xl pointer-events-none" />

      {/* Dynamic Championship Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {displayAchievements.map((achievement) => {
          const IconComponent = iconMap[achievement.icon || "Trophy"] || Trophy;
          const isGold = achievement.is_highlighted || achievement.title.toLowerCase().includes("1st");
          const isSelected = activeId === achievement.id;

          const formattedDate = achievement.achievement_date
            ? new Date(achievement.achievement_date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Verified";

          return (
            <div
              key={achievement.id}
              onClick={(e) => fireCelebration(e, achievement.id)}
              onMouseEnter={() => cyberAudio.playHover()}
              className={`group relative rounded-2xl p-1 transition-all duration-500 cursor-pointer backdrop-blur-xl ${
                isGold
                  ? "bg-gradient-to-b from-amber-500/30 via-zinc-800/30 to-transparent border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_35px_rgba(255,184,0,0.3)]"
                  : "bg-gradient-to-b from-cyan-500/20 via-zinc-800/20 to-transparent border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,240,255,0.25)]"
              } ${isSelected ? "ring-2 ring-amber-400/50 scale-[1.02]" : "hover:-translate-y-1.5"}`}
            >
              <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/95 p-6 flex flex-col justify-between">
                <div>
                  {/* Top Bar with Badge & Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded-full uppercase font-bold flex items-center gap-1.5 ${
                        isGold
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      <Flame className="w-3 h-3 animate-pulse" />
                      {achievement.achievement_type.toUpperCase()}
                    </span>

                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {formattedDate}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-13 h-13 rounded-xl p-3 flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                        isGold
                          ? "bg-gradient-to-br from-amber-400 to-amber-700 text-black shadow-amber-500/30"
                          : "bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-cyan-500/30"
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                        {achievement.title}
                      </h3>
                      {achievement.is_highlighted && (
                        <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 mt-0.5 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" /> Highlighted Title
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Optional Achievement Photo / Thumbnail */}
                  {achievement.image_url && (
                    <div className="rounded-xl overflow-hidden border border-zinc-800 mb-4 h-32 relative group-hover:border-amber-500/40 transition-colors">
                      <img
                        src={achievement.image_url}
                        alt={achievement.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-4">
                    {achievement.description || "Verified accomplishment by team w0lf.exe."}
                  </p>

                  {/* Team Members or Owner */}
                  {achievement.is_team_achievement ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 mb-4 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/40">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Team W01F.EXE Squad</span>
                    </div>
                  ) : achievement.owner ? (
                    <div className="text-[11px] font-mono text-zinc-400 mb-4">
                      <span>Awarded to: </span>
                      <span className="text-amber-400 font-bold">@{achievement.owner.username}</span>
                    </div>
                  ) : null}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Tap for fanfare
                  </span>
                  <Link
                    to={`/achievement/${achievement.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      cyberAudio.playClick();
                    }}
                    className={`text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                      isGold ? "text-amber-400 hover:text-amber-200" : "text-cyan-400 hover:text-cyan-200"
                    }`}
                  >
                    Dossier <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
