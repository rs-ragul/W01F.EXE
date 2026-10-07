import { useState } from "react";
import { Link } from "react-router-dom";
import { Code, ExternalLink, GitBranch, Star, Terminal, ArrowUpRight, Copy, Check, Users } from "lucide-react";
import { Project } from "@/types/database";
import { cyberAudio } from "@/lib/cyberAudio";

interface ProjectsSpotlightProps {
  projects?: Project[];
  isLoading?: boolean;
}

export function ProjectsSpotlight({ projects = [], isLoading = false }: ProjectsSpotlightProps) {
  const [filter, setFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Repositories" },
    { id: "security", label: "Security & CTF" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "web", label: "Full-Stack Web" },
    { id: "systems", label: "Systems & AI" },
  ];

  const handleCopyClone = (e: React.MouseEvent, gitUrl: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    cyberAudio.playClick();
    navigator.clipboard.writeText(`git clone ${gitUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    const tags = (p.tags || []).map((t) => t.toLowerCase()).join(" ");
    const text = `${p.title} ${p.description || ""} ${p.language || ""} ${tags}`.toLowerCase();

    if (filter === "security") return text.includes("ctf") || text.includes("forensic") || text.includes("security") || text.includes("cyber");
    if (filter === "mobile") return text.includes("kotlin") || text.includes("android") || text.includes("mobile") || text.includes("lost");
    if (filter === "web") return text.includes("react") || text.includes("next") || text.includes("web") || text.includes("school");
    if (filter === "systems") return text.includes("rust") || text.includes("ai") || text.includes("analytics") || text.includes("ocr");
    return true;
  });

  return (
    <div>
      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              cyberAudio.playClick();
              setFilter(c.id);
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className={`text-xs font-mono px-4 py-2 rounded-full border transition-all duration-300 ${
              filter === c.id
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] font-bold scale-105"
                : "bg-[#09111e]/70 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Terminal className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-pulse" />
          <p className="text-zinc-400 font-mono text-sm">Querying tactical repositories...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl p-1 bg-gradient-to-b from-cyan-500/15 via-zinc-800/20 to-transparent border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
              onMouseEnter={() => cyberAudio.playHover()}
            >
              <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/90 p-6 flex flex-col justify-between backdrop-blur-xl">
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                          {project.status || "ACTIVE"}
                        </span>
                        <h4 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {project.title}
                        </h4>
                      </div>
                    </div>

                    {project.github_url && (
                      <button
                        onClick={(e) => handleCopyClone(e, project.github_url!, project.id)}
                        title="Copy 'git clone' command"
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shrink-0"
                      >
                        {copiedId === project.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-4">
                    {project.description || "Active engineering project by w0lf.exe operatives."}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Team / Author */}
                  {project.is_team_project ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 mb-4 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/40">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Team Collaboration</span>
                    </div>
                  ) : project.owner ? (
                    <div className="text-[11px] font-mono text-zinc-400 mb-4">
                      <span>Lead: </span>
                      <span className="text-cyan-400 font-semibold">@{project.owner.username}</span>
                    </div>
                  ) : null}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.language && (
                      <span className="text-[11px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {project.language.split(",")[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold p-1"
                        title="Live Preview"
                      >
                        Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <Link
                      to={`/project/${project.id}`}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-bold p-1"
                    >
                      Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-zinc-950/50 rounded-2xl border border-zinc-800">
          <Code className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-400 font-mono text-xs">No repositories matching the selected filter.</p>
        </div>
      )}
    </div>
  );
}
