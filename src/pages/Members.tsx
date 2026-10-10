import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { useProfilesWithRoles } from "@/hooks/useProfiles";
import {
  Users,
  Shield,
  Github,
  Linkedin,
  Globe,
  Terminal,
  Crown,
  Flame,
  Radio,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

const roleBorders: Record<string, { badge: string; glow: string; text: string; bg: string }> = {
  admin: {
    badge: "COMMAND // ADMIN",
    glow: "border-red-500/40 hover:border-red-400 hover:shadow-[0_0_30px_rgba(255,59,48,0.3)]",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
  member: {
    badge: "OPERATIVE",
    glow: "border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
};

export default function Members() {
  const { data: profiles, isLoading } = useProfilesWithRoles();

  return (
    <Layout>
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#081220]/80 border border-cyan-500/30 rounded-full mb-4 select-none">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">
                TACTICAL ROSTER // AGENTS & LEADS
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              <span className="text-cyan-400">@</span> Operatives & Researchers
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
              The ethical hackers, systems architects, and competitive CTF minds driving the w0lf.exe collective.
            </p>
          </div>

          {/* Members Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <Terminal className="w-10 h-10 text-cyan-400 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-400 font-mono text-sm">Accessing classified agent dossier...</p>
            </div>
          ) : profiles && profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...profiles]
                .sort((a, b) => {
                  if (a.role === "admin" && b.role !== "admin") return -1;
                  if (a.role !== "admin" && b.role === "admin") return 1;
                  const aName = a.full_name || a.username || "";
                  const bName = b.full_name || b.username || "";
                  return aName.localeCompare(bName);
                })
                .map((member) => {
                  const roleStyle = roleBorders[member.role] || roleBorders.member;
                  const isLead = member.team_role?.toLowerCase().includes("founder") || member.team_role?.toLowerCase().includes("lead");

                  return (
                    <div
                      key={member.id}
                      className={`group rounded-2xl p-1 bg-gradient-to-b from-cyan-500/20 via-zinc-800/20 to-transparent border ${roleStyle.glow} transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between`}
                      onMouseEnter={() => cyberAudio.playHover()}
                    >
                      <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/90 p-6 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
                        {/* Corner Reticle */}
                        <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-600 select-none">
                          AGENT-{member.username.slice(0, 4).toUpperCase()}
                        </div>

                        <div>
                          {/* Role Badge & Status */}
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${roleStyle.bg} ${roleStyle.text} border border-current/30`}
                            >
                              {member.role === "admin" ? <Crown className="w-3 h-3 text-amber-400" /> : <Shield className="w-3 h-3" />}
                              {roleStyle.badge}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              ACTIVE
                            </span>
                          </div>

                          {/* Avatar & Ident */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-16 h-16 rounded-2xl bg-[#091220] border border-cyan-500/40 p-0.5 overflow-hidden group-hover:scale-105 group-hover:border-cyan-400 transition-all shrink-0">
                              {member.avatar_url ? (
                                <img
                                  src={member.avatar_url}
                                  alt={member.full_name || member.username}
                                  className="w-full h-full object-cover rounded-[calc(1rem-2px)]"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl bg-cyan-950/60 text-cyan-400">
                                  🐺
                                </div>
                              )}
                            </div>

                            <div>
                              <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {member.full_name || member.username}
                              </h3>
                              <p className="text-xs font-mono text-zinc-400">
                                @{member.username}
                              </p>
                              {member.team_role && (
                                <div className="text-[11px] font-mono font-bold text-amber-400 mt-0.5">
                                  {member.team_role}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-4">
                            {member.bio || "Active security researcher and core member of team w0lf.exe."}
                          </p>

                          {/* Department */}
                          {member.department && (
                            <div className="text-[11px] font-mono text-zinc-400 mb-3 bg-zinc-900/60 px-2 py-1 rounded border border-zinc-800">
                              <span className="text-zinc-500">Dept: </span>
                              <span className="text-zinc-300">{member.department}</span>
                            </div>
                          )}

                          {/* Skills Chips */}
                          {member.skills && member.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {member.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footer Socials & Dossier Button */}
                        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {member.github_url && (
                              <a
                                href={member.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                                aria-label="GitHub"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {member.linkedin_url && (
                              <a
                                href={member.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                                aria-label="LinkedIn"
                              >
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {member.website_url && (
                              <a
                                href={member.website_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                                aria-label="Website"
                              >
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <Link
                            to={`/member/${member.id}`}
                            onClick={() => cyberAudio.playClick()}
                            className="text-xs font-mono text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                          >
                            Profile Dossier <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#060b14]/70 border border-zinc-800 rounded-2xl">
              <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-mono text-sm">No operatives found in the roster.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
