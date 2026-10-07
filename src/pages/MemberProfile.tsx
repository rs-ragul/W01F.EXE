import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfiles";
import { useProjects } from "@/hooks/useProjects";
import { useAchievements } from "@/hooks/useAchievements";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Globe,
  Terminal,
  Trophy,
  Code,
  Shield,
  Crown,
  Mail,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

export default function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading } = useProfile(id);
  const { data: allProjects } = useProjects();
  const { data: allAchievements } = useAchievements();

  const memberProjects = allProjects?.filter(
    (p) => p.owner_id === id || p.members?.some((m) => m.id === id)
  );
  const memberAchievements = allAchievements?.filter(
    (a) => a.owner_id === id || a.members?.some((m) => m.id === id)
  );

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Terminal className="w-10 h-10 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <p className="text-zinc-400 font-mono text-sm">Decoding operative dossier...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="p-8 rounded-2xl bg-[#070d18] border border-zinc-800 text-center max-w-md">
            <Shield className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-white mb-2">Operative Not Found</h2>
            <p className="text-zinc-400 font-mono text-xs mb-6">
              No operative matches this profile identifier.
            </p>
            <Link to="/members">
              <Button className="bg-cyan-500 text-black font-mono font-bold text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Roster
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Action */}
          <Link
            to="/members"
            onClick={() => cyberAudio.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Team Roster
          </Link>

          {/* Operative Dossier Card */}
          <div className="rounded-3xl p-1 bg-gradient-to-b from-cyan-500/25 via-zinc-800/20 to-transparent border border-cyan-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden mb-12">
            <div className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-6 md:p-10 space-y-6">
              {/* Top Telemetry */}
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                <span className="text-cyan-400 font-bold">OPERATIVE ID: {profile.id.slice(0, 8).toUpperCase()}</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: ACTIVE COMMAND
                </span>
              </div>

              {/* Profile Bio & Avatar Header */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="relative w-28 h-28 rounded-2xl bg-[#091220] border-2 border-cyan-500/50 p-1 shrink-0 overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.25)]">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || profile.username}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-cyan-950 text-cyan-400">
                      🐺
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      {profile.full_name || profile.username}
                    </h1>
                    {profile.team_role && (
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">
                        {profile.team_role}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-mono text-cyan-400 font-bold">@{profile.username}</p>

                  {profile.department && (
                    <p className="text-xs font-mono text-zinc-400">
                      Department: <span className="text-zinc-200">{profile.department}</span>
                    </p>
                  )}

                  {profile.bio && (
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed pt-2 max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 justify-center sm:justify-start">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-800/50 text-cyan-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Channels */}
                  <div className="flex items-center gap-3 pt-4 justify-center sm:justify-start">
                    {profile.github_url && (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {profile.website_url && (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-red-400 hover:border-red-500/40 transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member's Engineering Projects */}
          {memberProjects && memberProjects.length > 0 && (
            <div className="mb-12 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                <Code className="w-4 h-4" />
                Active Repositories & Engineering Systems ({memberProjects.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberProjects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/project/${p.id}`}
                    onClick={() => cyberAudio.playClick()}
                    className="p-5 rounded-2xl bg-[#070d18]/90 border border-zinc-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 block group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {p.title}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400" />
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                      {p.description || "Engineering codebase."}
                    </p>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      {p.language || "TypeScript"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Member's CTF & Competition Victories */}
          {memberAchievements && memberAchievements.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Captured Flags & Championships ({memberAchievements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberAchievements.map((a) => (
                  <Link
                    key={a.id}
                    to={`/achievement/${a.id}`}
                    onClick={() => cyberAudio.playClick()}
                    className="p-5 rounded-2xl bg-[#070d18]/90 border border-zinc-800 hover:border-amber-500/40 transition-all hover:-translate-y-1 block group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                        {a.title}
                      </h4>
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {a.description || "Verified competition victory."}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
