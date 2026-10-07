import { useState } from "react";
import { ShieldCheck, Bug, Terminal, Cpu, Database, Network } from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

interface SkillItem {
  name: string;
  level: number; // 0-100
  tier: "MASTER" | "EXPERT" | "ADVANCED";
  tools: string[];
}

const SKILL_CATEGORIES: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; skills: SkillItem[] }> = {
  offensive: {
    label: "Offensive Security (Red Team)",
    icon: Bug,
    skills: [
      { name: "Web Exploitation (XSS, SQLi, SSRF, Auth Bypass)", level: 95, tier: "MASTER", tools: ["Burp Suite Pro", "SQLMap", "ffuf", "Postman"] },
      { name: "Digital Forensics & Memory Analysis", level: 92, tier: "MASTER", tools: ["Volatility", "Autopsy", "Wireshark", "Binwalk"] },
      { name: "OSINT & Threat Intelligence Gathering", level: 90, tier: "EXPERT", tools: ["Maltego", "Spiderfoot", "Sherlock", "Shodan"] },
      { name: "Binary Exploitation & Buffer Overflows", level: 86, tier: "EXPERT", tools: ["GDB / Peda", "pwntools", "ROPgadget", "Checksec"] },
      { name: "Reverse Engineering (x86/x64, ARM)", level: 88, tier: "EXPERT", tools: ["Ghidra", "IDA Pro", "Radare2", "x64dbg"] },
      { name: "Applied Cryptography & Hash Cracking", level: 85, tier: "EXPERT", tools: ["Hashcat", "John", "CyberChef", "SageMath"] },
    ],
  },
  engineering: {
    label: "Systems & Full-Stack Engineering",
    icon: Cpu,
    skills: [
      { name: "Rust Systems Programming & Tooling", level: 88, tier: "EXPERT", tools: ["Cargo", "Tokio", "Rayon", "Serde"] },
      { name: "TypeScript / React / Next.js Architecture", level: 94, tier: "MASTER", tools: ["React 18", "Next.js 14", "Tailwind CSS", "Vite"] },
      { name: "Android App Development (Kotlin & Compose)", level: 89, tier: "EXPERT", tools: ["Android Studio", "Jetpack Compose", "Coroutines", "Room"] },
      { name: "Database Engineering & Supabase / Postgres", level: 90, tier: "EXPERT", tools: ["PostgreSQL", "RLS Policies", "Prisma", "Firestore"] },
      { name: "REST & Realtime Socket Architecture", level: 92, tier: "MASTER", tools: ["WebSockets", "Supabase Realtime", "SSE"] },
      { name: "Cloud Deployment & Edge Serverless", level: 87, tier: "EXPERT", tools: ["Vercel", "Docker", "Supabase Edge", "Linux VPS"] },
    ],
  },
  defensive: {
    label: "Defensive Operations (Blue Team)",
    icon: ShieldCheck,
    skills: [
      { name: "Network Traffic Analysis & PCAP Inspection", level: 93, tier: "MASTER", tools: ["Wireshark", "Tshark", "Zeek", "Suricata"] },
      { name: "Hardening & Role-Based Access Control (RBAC)", level: 94, tier: "MASTER", tools: ["Postgres RLS", "JWT", "OAuth 2.0", "Auth0"] },
      { name: "Incident Response & Artifact Triage", level: 89, tier: "EXPERT", tools: ["KAPE", "FTK Imager", "Velociraptor"] },
      { name: "Vulnerability Auditing & Patch Verification", level: 90, tier: "EXPERT", tools: ["Nessus", "Nikto", "OWASP ZAP", "SonarQube"] },
    ],
  },
};

export function SkillsMatrix() {
  const [activeTab, setActiveTab] = useState<string>("offensive");

  const currentCategory = SKILL_CATEGORIES[activeTab] || SKILL_CATEGORIES.offensive;
  const IconComponent = currentCategory.icon;

  return (
    <div className="rounded-2xl p-6 md:p-8 bg-[#070d18]/90 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 font-bold inline-flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3 h-3" />
            OPERATIONAL CAPABILITY MATRIX
          </span>
          <h3 className="font-display text-2xl font-bold text-white">
            Combat-Ready Technical Disciplines
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => {
                cyberAudio.playClick();
                setActiveTab(key);
              }}
              onMouseEnter={() => cyberAudio.playHover()}
              className={`text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all ${
                activeTab === key
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
              }`}
            >
              {cat.label.split(" ")[0]} {cat.label.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentCategory.skills.map((skill, index) => (
          <div
            key={skill.name}
            className="p-4 rounded-xl bg-[#091220]/70 border border-zinc-800/80 hover:border-cyan-500/40 transition-all group"
            onMouseEnter={() => cyberAudio.playHover()}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {skill.name}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  skill.tier === "MASTER"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                }`}
              >
                {skill.tier}
              </span>
            </div>

            {/* Custom Cyber Progress Meter */}
            <div className="w-full h-2 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden mb-3 p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-1000 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                style={{ width: `${skill.level}%` }}
              />
            </div>

            {/* Tools Used */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-500">Toolkit:</span>
              {skill.tools.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
