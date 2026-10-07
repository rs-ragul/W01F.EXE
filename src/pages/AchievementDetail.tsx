import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/hooks/useAchievements";
import {
  Trophy,
  Award,
  Target,
  Flag,
  Medal,
  Star,
  Shield,
  Terminal,
  Users,
  ArrowLeft,
  Calendar,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
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

export default function AchievementDetail() {
  const { id } = useParams();
  const { data: achievements, isLoading } = useAchievements();

  const achievement = achievements?.find((a) => a.id === id);

  const triggerConfetti = () => {
    cyberAudio.playTrophyFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffd700", "#00f0ff", "#ff3366"],
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Terminal className="w-10 h-10 text-amber-400 mx-auto mb-4 animate-pulse" />
            <p className="text-zinc-400 font-mono text-sm">Querying verified credentials...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!achievement) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="p-8 rounded-2xl bg-[#070d18] border border-zinc-800 text-center max-w-md">
            <Trophy className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-white mb-2">Milestone Not Found</h2>
            <p className="text-zinc-400 font-mono text-xs mb-6">
              The requested record ID does not match any verified achievements.
            </p>
            <Link to="/achievements">
              <Button className="bg-amber-500 text-black font-mono font-bold text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Victories
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const IconComponent = iconMap[achievement.icon || "Trophy"] || Trophy;
  const colors = typeColors[achievement.achievement_type] || typeColors.competition;

  return (
    <Layout>
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Action */}
          <Link
            to="/achievements"
            onClick={() => cyberAudio.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hall of Fame
          </Link>

          {/* Victory Card */}
          <div className="rounded-3xl p-1 bg-gradient-to-b from-amber-500/25 via-zinc-800/20 to-transparent border border-amber-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-6 md:p-10 space-y-8">
              {/* Tactical Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">VERIFIED CTF / AWARD RECORD</span>
                  <span>•</span>
                  <span>ID: {achievement.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <button
                  onClick={triggerConfetti}
                  className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" /> CELEBRATE VICTORY
                </button>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}
                >
                  <IconComponent className={`w-8 h-8 ${colors.text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${colors.bg} ${colors.border} ${colors.text}`}>
                      {achievement.achievement_type}
                    </span>
                    {achievement.achievement_date && (
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {new Date(achievement.achievement_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    {achievement.title}
                  </h1>
                </div>
              </div>

              {/* Certificate or Event Photo */}
              {achievement.image_url && (
                <div className="rounded-2xl overflow-hidden border border-zinc-800 group relative">
                  <img
                    src={achievement.image_url}
                    alt={achievement.title}
                    className="w-full h-auto max-h-96 object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-transparent opacity-50" />
                </div>
              )}

              {/* Description / Summary */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Dossier Intelligence & Evaluation
                </h3>
                <div className="text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-line bg-[#040810]/60 p-6 rounded-2xl border border-zinc-800/80">
                  {achievement.description || "Verified cybersecurity achievement."}
                </div>
              </div>

              {/* Team Members or Owner */}
              <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                {achievement.is_team_achievement ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Official Team W01F.EXE Squad Victory</span>
                  </div>
                ) : achievement.owner ? (
                  <div className="text-xs font-mono text-zinc-400">
                    <span>Awarded To: </span>
                    <span className="text-amber-400 font-bold">@{achievement.owner.username}</span>
                  </div>
                ) : null}

                <Link to="/achievements">
                  <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs">
                    All Victories ›
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
