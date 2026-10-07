import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import {
  Code,
  ExternalLink,
  GitBranch,
  Star,
  Lock,
  Terminal,
  Users,
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cyberAudio } from "@/lib/cyberAudio";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  development: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  classified: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: projects, isLoading } = useProjects();
  const [copied, setCopied] = useState(false);

  const project = projects?.find((p) => p.id === id);

  const handleCopyClone = (gitUrl: string) => {
    cyberAudio.playClick();
    navigator.clipboard.writeText(`git clone ${gitUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Terminal className="w-10 h-10 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <p className="text-zinc-400 font-mono text-sm">Decentralized Project Retrieval...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="p-8 rounded-2xl bg-[#070d18] border border-zinc-800 text-center max-w-md">
            <Terminal className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-white mb-2">Project Dossier Not Found</h2>
            <p className="text-zinc-400 font-mono text-xs mb-6">
              The requested repository ID does not match any public records.
            </p>
            <Link to="/projects">
              <Button className="bg-cyan-500 text-black font-mono font-bold text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Blueprints
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
            to="/projects"
            onClick={() => cyberAudio.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Blueprints
          </Link>

          {/* Main Blueprint Dossier Card */}
          <div className="rounded-3xl p-1 bg-gradient-to-b from-cyan-500/25 via-zinc-800/20 to-transparent border border-cyan-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-6 md:p-10 space-y-8">
              {/* Tactical Top Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">DOC: PRJ-{project.id.slice(0, 8).toUpperCase()}</span>
                  <span>•</span>
                  <span>SECURITY CLEARANCE: PUBLIC</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded uppercase font-bold text-[10px] border ${
                    statusColors[project.status] || statusColors.active
                  }`}
                >
                  STATUS: {project.status || "ACTIVE"}
                </span>
              </div>

              {/* Title & Headline */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
                      {project.title}
                    </h1>
                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                      {project.language && <span>Stack: {project.language}</span>}
                      {project.stars !== null && project.stars > 0 && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5" /> {project.stars} stars
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hero Showcase Image */}
                {project.image_url && (
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 mt-6 group relative">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-auto max-h-96 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-transparent opacity-60" />
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  Architectural Summary & Mission
                </h3>
                <div className="text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-line bg-[#040810]/60 p-6 rounded-2xl border border-zinc-800/80">
                  {project.description || "No architectural notes recorded."}
                </div>
              </div>

              {/* Tags Matrix */}
              {project.tags && project.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-mono text-xs text-zinc-400">Tags & Technology Vectors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Clone Command Snippet */}
              {project.github_url && (
                <div className="space-y-2">
                  <h4 className="font-mono text-xs text-zinc-400 flex items-center justify-between">
                    <span>Clone Repository:</span>
                    <span className="text-[10px] text-zinc-500">Terminal command</span>
                  </h4>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black border border-cyan-500/30 font-mono text-xs text-cyan-300">
                    <code className="truncate">git clone {project.github_url}</code>
                    <button
                      onClick={() => handleCopyClone(project.github_url!)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Contributors / Owner */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {project.is_team_project ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Multi-Operative Team Collaboration</span>
                  </div>
                ) : project.owner ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500/40 overflow-hidden">
                      {project.owner.avatar_url ? (
                        <img src={project.owner.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">🐺</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white">{project.owner.full_name || project.owner.username}</div>
                      <Link to={`/member/${project.owner.id}`} className="text-[11px] font-mono text-cyan-400 hover:underline">
                        @{project.owner.username}
                      </Link>
                    </div>
                  </div>
                ) : null}

                {/* Live Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-white font-mono text-xs transition-all"
                    >
                      <Code className="w-4 h-4 text-cyan-400" />
                      GitHub Repo
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Launch
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
