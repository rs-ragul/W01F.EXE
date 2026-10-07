import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import {
  Code,
  ExternalLink,
  GitBranch,
  Star,
  Lock,
  Terminal,
  Users,
  Search,
  Copy,
  Check,
  ArrowUpRight,
  Filter,
  Layers,
  LayoutGrid,
  List,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  development: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  classified: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "matrix">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyClone = (e: React.MouseEvent, gitUrl: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    cyberAudio.playClick();
    navigator.clipboard.writeText(`git clone ${gitUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allTags = Array.from(
    new Set((projects || []).flatMap((p) => p.tags || []))
  );

  const filteredProjects = (projects || []).filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.language || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag =
      selectedTag === "all" || (p.tags || []).includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <Layout>
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#081220]/80 border border-cyan-500/30 rounded-full mb-4">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">
                SYSTEMS ARCHITECTURE & TOOLS
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              <span className="text-cyan-400">&lt;</span>
              Engineering Blueprints
              <span className="text-cyan-400">/&gt;</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
              Cybersecurity frameworks, mobile applications, AI analytics, and open-source software built and maintained by w0lf.exe operatives.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mb-10 p-4 rounded-2xl bg-[#070d18]/90 border border-cyan-500/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, language, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#030712] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1 bg-[#030712] p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setViewMode("grid");
                  }}
                  className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
                    viewMode === "grid"
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Card Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setViewMode("matrix");
                  }}
                  className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
                    viewMode === "matrix"
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Matrix Table"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tag Pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setSelectedTag("all")}
                className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all ${
                  selectedTag === "all"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                All ({projects?.length || 0})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all ${
                    selectedTag === tag
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Content Loading or Empty */}
          {isLoading ? (
            <div className="text-center py-20">
              <Terminal className="w-10 h-10 text-cyan-400 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-400 font-mono text-sm">Querying Supabase repositories...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-[#060b14]/70 border border-zinc-800 rounded-2xl">
              <Code className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-mono text-sm">No repositories found matching your query.</p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-2xl p-1 bg-gradient-to-b from-cyan-500/15 via-zinc-800/20 to-transparent border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
                  onMouseEnter={() => cyberAudio.playHover()}
                >
                  <div className="h-full rounded-[calc(1rem-2px)] bg-[#070d18]/90 p-6 flex flex-col justify-between backdrop-blur-xl">
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                            <GitBranch className="w-4 h-4" />
                          </div>
                          <div>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                                statusColors[project.status] || statusColors.active
                              }`}
                            >
                              {project.status || "ACTIVE"}
                            </span>
                            <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-1">
                              {project.title}
                            </h3>
                          </div>
                        </div>

                        {project.github_url && (
                          <button
                            onClick={(e) => handleCopyClone(e, project.github_url!, project.id)}
                            title="Copy clone command"
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
                        {project.description || "Active production codebase by w0lf.exe."}
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

                      {/* Contributors */}
                      {project.is_team_project ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 mb-4 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/40">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Team Collaboration</span>
                        </div>
                      ) : project.owner ? (
                        <div className="text-[11px] font-mono text-zinc-400 mb-4">
                          <span>Architect: </span>
                          <span className="text-cyan-400 font-bold">@{project.owner.username}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-400">
                        {project.language || "Multi-stack"}
                      </span>

                      <div className="flex items-center gap-2">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
                          >
                            Live <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <Link
                          to={`/project/${project.id}`}
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-bold"
                        >
                          Dossier <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Matrix Table View */
            <div className="rounded-2xl border border-cyan-500/20 bg-[#070d18]/90 overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#09111e] border-b border-cyan-500/20 text-cyan-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Repository</th>
                      <th className="p-4">Stack / Languages</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Type</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-cyan-950/20 transition-colors group"
                        onMouseEnter={() => cyberAudio.playHover()}
                      >
                        <td className="p-4 font-bold text-white group-hover:text-cyan-300">
                          <Link to={`/project/${project.id}`} className="flex items-center gap-2">
                            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{project.title}</span>
                          </Link>
                        </td>
                        <td className="p-4 text-zinc-400">{project.language || "TypeScript"}</td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                              statusColors[project.status] || statusColors.active
                            }`}
                          >
                            {project.status || "ACTIVE"}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-400">
                          {project.is_team_project ? "Squad Repo" : "Specialist Lab"}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded text-zinc-400 hover:text-cyan-400"
                                title="Open GitHub"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <Link
                              to={`/project/${project.id}`}
                              className="text-cyan-400 hover:underline font-bold"
                            >
                              Inspect ›
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
