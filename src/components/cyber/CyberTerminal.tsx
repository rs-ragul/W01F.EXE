import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2, CornerDownLeft, Volume2, VolumeX } from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";
import { Project, Achievement, Profile, SiteStat } from "@/types/database";

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const WOLF_ASCII = `
 ██╗    ██╗ ██████╗  ██╗███████╗   ███████╗██╗  ██╗███████╗
 ██║    ██║██╔═████╗███║██╔════╝   ██╔════╝╚██╗██╔╝██╔════╝
 ██║ █╗ ██║██║██╔██║╚██║█████╗     █████╗   ╚███╔╝ █████╗  
 ██║███╗██║████╔╝██║ ██║██╔══╝     ██╔══╝   ██╔██╗ ██╔══╝  
 ╚███╔███╔╝╚██████╔╝ ██║██║        ███████╗██╔╝ ██╗███████╗
  ╚══╝╚══╝  ╚═════╝  ╚═╝╚═╝        ╚══════╝╚═╝  ╚═╝╚══════╝
           [ CSE CYBERSECURITY & ENGINEERING COLLECTIVE ]
`;

interface CyberTerminalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
  projects?: Project[];
  achievements?: Achievement[];
  profiles?: Profile[];
  stats?: SiteStat[];
}

export function CyberTerminal({
  isOpen = true,
  onClose,
  isFloating = false,
  projects = [],
  achievements = [],
  profiles = [],
  stats = [],
}: CyberTerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "init",
      command: "init",
      output: (
        <div className="space-y-1 text-xs">
          <pre className="text-cyan-400 font-mono text-[9px] sm:text-[11px] leading-tight select-none">
            {WOLF_ASCII}
          </pre>
          <p className="text-emerald-400 font-bold">
            [+] W01F.EXE TACTICAL OS v3.5.0 // DYNAMIC REALTIME LINKED
          </p>
          <p className="text-zinc-400">
            Type <span className="text-cyan-300 font-bold">help</span> to list commands, or tap the quick chips below.
          </p>
        </div>
      ),
      timestamp: "00:00",
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMuted, setIsMuted] = useState(cyberAudio.isMuted());
  const [isExpanded, setIsExpanded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (bottomRef.current?.parentElement) {
      bottomRef.current.parentElement.scrollTop = bottomRef.current.parentElement.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleAudioChange = (e: Event) => {
      const custom = e as CustomEvent<{ muted: boolean }>;
      setIsMuted(custom.detail.muted);
    };
    window.addEventListener("w01f_audio_change", handleAudioChange);
    return () => window.removeEventListener("w01f_audio_change", handleAudioChange);
  }, []);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    cyberAudio.playAccessGranted();
    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const now = new Date().toLocaleTimeString("en-GB", { hour12: false });
    const id = Math.random().toString();
    const cleanCmd = cmd.toLowerCase();

    let output: React.ReactNode = null;

    switch (cleanCmd) {
      case "help":
        output = (
          <div className="space-y-1 text-xs text-zinc-300 font-mono">
            <p className="text-cyan-400 font-bold mb-1">DYNAMIC OPERATIONS CLI:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <div><span className="text-yellow-400 font-bold">projects</span> : Live database repositories ({projects.length})</div>
              <div><span className="text-yellow-400 font-bold">wins</span> : Live verified achievements ({achievements.length})</div>
              <div><span className="text-yellow-400 font-bold">team</span> : Active operatives roster ({profiles.length})</div>
              <div><span className="text-yellow-400 font-bold">stats</span> : Live platform telemetry & stats</div>
              <div><span className="text-yellow-400 font-bold">skills</span> : Technical combat & dev capabilities</div>
              <div><span className="text-yellow-400 font-bold">whoami</span> : Current security clearance</div>
              <div><span className="text-yellow-400 font-bold">audio</span> : Toggle procedural sound synthesizer</div>
              <div><span className="text-yellow-400 font-bold">banner</span> : Render ASCII Wolf Crest</div>
              <div><span className="text-yellow-400 font-bold">clear</span> : Purge terminal log screen</div>
            </div>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="space-y-2 text-xs">
            <p className="text-cyan-400 font-bold">[ LIVE REPOSITORIES & BLUEPRINTS ({projects.length}) ]</p>
            {projects.length > 0 ? (
              <div className="space-y-1.5 font-mono">
                {projects.map((p, idx) => (
                  <div key={p.id} className="p-2 rounded bg-cyan-950/30 border border-cyan-800/40">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">{idx + 1}. {p.title}</span>
                      <span className="text-[10px] uppercase text-zinc-400">[{p.status}]</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-0.5 line-clamp-1">{p.description}</div>
                    <div className="text-[10px] text-cyan-300 mt-1">Stack: {p.language || "Multi-stack"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 font-mono">No projects found in database.</p>
            )}
            <p className="text-muted-foreground text-[11px] font-mono">
              View interactive catalog at <a href="/projects" className="text-cyan-400 underline">/projects</a>
            </p>
          </div>
        );
        break;

      case "wins":
      case "achievements":
        output = (
          <div className="space-y-2 text-xs">
            <p className="text-yellow-400 font-bold">🏆 [ LIVE COMPETITION & MILESTONE RECORDS ({achievements.length}) ]</p>
            {achievements.length > 0 ? (
              <div className="space-y-1.5 font-mono">
                {achievements.map((a, idx) => (
                  <div key={a.id} className="p-2 rounded bg-yellow-950/20 border border-yellow-600/40 text-yellow-200">
                    <div className="font-bold text-yellow-400 flex items-center justify-between">
                      <span>{idx + 1}. {a.title}</span>
                      <span className="text-[10px] text-zinc-400 uppercase">[{a.achievement_type}]</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2">{a.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 font-mono">No achievements logged in database.</p>
            )}
            <p className="text-muted-foreground text-[11px] font-mono">
              Examine full Hall of Fame at <a href="/achievements" className="text-yellow-400 underline">/achievements</a>
            </p>
          </div>
        );
        break;

      case "team":
      case "members":
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-cyan-400 font-bold">[ ACTIVE OPERATIVES ROSTER ({profiles.length}) ]</p>
            {profiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profiles.map((m) => (
                  <div key={m.id} className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800">
                    <div className="text-white font-bold flex items-center justify-between">
                      <span>{m.full_name || m.username}</span>
                      {m.team_role && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono uppercase">
                          {m.team_role}
                        </span>
                      )}
                    </div>
                    <div className="text-cyan-400 text-[11px] mt-0.5">@{m.username}</div>
                    {m.department && (
                      <div className="text-zinc-400 text-[10px] mt-0.5">{m.department}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 font-mono">No operatives found in database.</p>
            )}
          </div>
        );
        break;

      case "stats":
        output = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-cyan-400 font-bold">[ LIVE TELEMETRY STATS ]</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {stats.length > 0 ? (
                stats.map((s) => (
                  <div key={s.id} className="bg-zinc-900/80 p-2.5 border border-zinc-800 rounded text-center">
                    <div className="text-xl font-bold text-amber-400">{s.stat_value}</div>
                    <div className="text-[10px] text-zinc-400 uppercase mt-0.5">{s.stat_label}</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-zinc-900/80 p-2 border border-zinc-800 rounded text-center">
                    <div className="text-xl font-bold text-amber-400">{achievements.length}</div>
                    <div className="text-[10px] text-zinc-400 uppercase">Achievements</div>
                  </div>
                  <div className="bg-zinc-900/80 p-2 border border-zinc-800 rounded text-center">
                    <div className="text-xl font-bold text-cyan-400">{projects.length}</div>
                    <div className="text-[10px] text-zinc-400 uppercase">Projects</div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-emerald-400 font-bold">[ STUDENT ENGINEERING & COMBAT CAPABILITIES ]</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
              <div>● Full-Stack Web: React 18, Next.js, Vite, Tailwind CSS, Supabase</div>
              <div>● Mobile Development: Android, Kotlin, Jetpack Compose, Firebase</div>
              <div>● Systems & Tooling: Rust CLI, Multi-threading, Automation</div>
              <div>● CTF Offensive: Web Exploitation, Binary Pwn, Reverse Engineering</div>
              <div>● CTF Defensive: Digital Forensics, Memory Analysis, Volatility</div>
              <div>● Hackathon Execution: Rapid MVP prototyping under 24–48hr deadlines</div>
            </div>
          </div>
        );
        break;

      case "whoami":
        output = (
          <div className="text-xs font-mono text-zinc-300 space-y-1">
            <p className="text-cyan-400 font-bold">[ VISITOR TELEMETRY ]</p>
            <p>Role: <span className="text-emerald-400">GUEST_ENGINEER</span></p>
            <p>Session: <span className="text-zinc-400">w0lf.exe public terminal</span></p>
            <p>Time: <span className="text-zinc-300">{now} IST</span></p>
          </div>
        );
        break;

      case "audio":
        const newMuted = cyberAudio.toggleMute();
        setIsMuted(newMuted);
        output = (
          <p className="text-xs font-mono text-cyan-300">
            [AUDIO] Synthesizer is now{" "}
            <span className={newMuted ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {newMuted ? "MUTED" : "ONLINE (ACTIVE)"}
            </span>
            .
          </p>
        );
        break;

      case "banner":
        output = (
          <pre className="text-cyan-400 font-mono text-[9px] sm:text-[11px] leading-tight select-none">
            {WOLF_ASCII}
          </pre>
        );
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      default:
        output = (
          <p className="text-xs font-mono text-red-400">
            Command not recognized: "{cmd}". Type <span className="text-cyan-400 font-bold">help</span> to list commands.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      { id, command: cmd, output, timestamp: now },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    cyberAudio.playTerminalKey();
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= cmdHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(nextIndex);
          setInput(cmdHistory[nextIndex]);
        }
      }
    }
  };

  if (!isOpen) return null;

  const suggestions = ["help", "projects", "wins", "team", "skills", "stats", "audio", "clear"];

  return (
    <div
      className={`bg-[#060b14]/95 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 flex flex-col ${
        isFloating
          ? "fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:w-[580px] max-h-[75vh] shadow-[0_20px_80px_rgba(0,240,255,0.25)]"
          : isExpanded
          ? "w-full h-[600px]"
          : "w-full h-[450px]"
      }`}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#09111e] border-b border-cyan-500/20 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block hover:opacity-100 cursor-pointer" onClick={() => setHistory([])} title="Clear screen" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block hover:opacity-100 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} title="Expand/Collapse" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block hover:opacity-100 cursor-pointer" onClick={() => handleCommand("help")} title="Help" />
          </div>
          <div className="flex items-center gap-2 ml-3 text-xs font-mono text-cyan-400">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold tracking-wider">w0lf@terminal: ~</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const res = cyberAudio.toggleMute();
              setIsMuted(res);
            }}
            className="p-1 rounded text-zinc-400 hover:text-cyan-400 hover:bg-cyan-950/40 transition-colors"
            title={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            onClick={() => setHistory([])}
            className="p-1 rounded text-zinc-400 hover:text-yellow-400 hover:bg-yellow-950/40 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-zinc-400 hover:text-cyan-400 hover:bg-cyan-950/40 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Log Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono scrollbar-thin scrollbar-thumb-cyan-500/20 text-xs select-text">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command !== "init" && (
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="text-red-400">w0lf@lab:~$</span>
                <span className="text-zinc-100 font-semibold">{item.command}</span>
                <span className="text-[10px] text-zinc-600 ml-auto">{item.timestamp}</span>
              </div>
            )}
            <div className="pl-0">{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 py-1.5 bg-[#09111e]/90 border-t border-cyan-500/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-zinc-500 uppercase shrink-0">Chips:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => handleCommand(s)}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 hover:bg-cyan-800/60 text-cyan-300 border border-cyan-700/40 transition-all shrink-0 active:scale-95"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#040810] border-t border-cyan-500/20">
        <span className="text-emerald-400 font-mono text-sm font-bold animate-pulse">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Execute command... (try 'projects', 'wins', 'team')"
          className="flex-1 bg-transparent text-zinc-100 font-mono text-xs focus:outline-none placeholder:text-zinc-600"
        />
        <button
          onClick={() => handleCommand(input)}
          className="p-1 text-cyan-400 hover:text-cyan-200 transition-colors"
          title="Send"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
