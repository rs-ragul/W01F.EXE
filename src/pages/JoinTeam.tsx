import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitJoinRequest, trackApplicationByIdOrEmail, JoinRequest } from "@/hooks/useJoinRequests";
import { useToast } from "@/hooks/use-toast";
import { cyberAudio } from "@/lib/cyberAudio";
import confetti from "canvas-confetti";
import {
  UserPlus,
  Send,
  CheckCircle2,
  Shield,
  Code,
  Smartphone,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Github,
  Linkedin,
  Globe,
  Flame,
  Search,
  Copy,
  Check,
  Clock,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const AVAILABLE_ROLES = [
  { id: "fullstack", label: "Full-Stack Web Dev (React / Next.js / TypeScript)", icon: Code },
  { id: "mobile", label: "Mobile App Dev (Android / Kotlin / Compose)", icon: Smartphone },
  { id: "offensive_ctf", label: "CTF / Offensive Security (Web, Reverse Eng, Pwn)", icon: Flame },
  { id: "forensics", label: "Digital Forensics & Incident Response", icon: Shield },
  { id: "ai_systems", label: "AI, OCR & Automation Tooling", icon: Cpu },
  { id: "hackathon_squad", label: "Hackathons & Rapid MVP Execution", icon: Layers },
];

export default function JoinTeam() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const submitMutation = useSubmitJoinRequest();

  // Active view: 'apply' or 'track'
  const [activeTab, setActiveTab] = useState<"apply" | "track">("apply");

  // Application form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "CSE (Cyber Security)",
    yearOfStudy: "2nd Year",
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    experience: "",
    whyJoin: "",
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "Full-Stack Web Dev (React / Next.js / TypeScript)",
  ]);

  const [submittedData, setSubmittedData] = useState<{ id: string; name: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Tracking state
  const [trackingQuery, setTrackingQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackedRequest, setTrackedRequest] = useState<JoinRequest | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [copiedTrackingUrl, setCopiedTrackingUrl] = useState(false);

  // Read URL query parameter ?track= or ?id=
  useEffect(() => {
    const trackParam = searchParams.get("track") || searchParams.get("id");
    if (trackParam) {
      setActiveTab("track");
      setTrackingQuery(trackParam);
      handleTrackQuery(trackParam);
    }
  }, [searchParams]);

  const toggleRole = (roleLabel: string) => {
    cyberAudio.playClick();
    setSelectedRoles((prev) =>
      prev.includes(roleLabel)
        ? prev.filter((r) => r !== roleLabel)
        : [...prev, roleLabel]
    );
  };

  const handleCopyId = (id: string) => {
    cyberAudio.playClick();
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    toast({
      title: "Application ID Copied",
      description: "Keep this ID safe to track your review status anytime.",
    });
  };

  const handleCopyTrackingLink = (id: string) => {
    cyberAudio.playClick();
    const url = `${window.location.origin}/join?track=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedTrackingUrl(true);
    setTimeout(() => setCopiedTrackingUrl(false), 2000);
    toast({
      title: "Tracking Link Copied",
      description: "Bookmark this link on your device to view status updates.",
    });
  };

  const handleTrackQuery = async (queryToSearch?: string) => {
    const q = (queryToSearch || trackingQuery).trim();
    if (!q) {
      toast({
        title: "Input Required",
        description: "Please enter your Application ID or Email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchAttempted(true);
    cyberAudio.playClick();

    try {
      const result = await trackApplicationByIdOrEmail(q);
      setTrackedRequest(result);

      if (result) {
        cyberAudio.playAccessGranted();
        setSearchParams({ track: result.id });
      } else {
        cyberAudio.playError();
      }
    } catch {
      setTrackedRequest(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.skills.trim()) {
      toast({
        title: "Incomplete Telemetry",
        description: "Please provide your full name, email, and technical skills.",
        variant: "destructive",
      });
      return;
    }

    cyberAudio.playClick();

    try {
      const data = await submitMutation.mutateAsync({
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        department: formData.department,
        year_of_study: formData.yearOfStudy,
        roles: selectedRoles,
        skills: formData.skills.trim(),
        github_url: formData.githubUrl.trim() || null,
        linkedin_url: formData.linkedinUrl.trim() || null,
        portfolio_url: formData.portfolioUrl.trim() || null,
        experience: formData.experience.trim() || null,
        why_join: formData.whyJoin.trim() || "Passionate about cybersecurity and software engineering.",
      });

      cyberAudio.playAccessGranted();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#00ff88", "#29a9ff", "#ffb800"],
      });

      setSubmittedData({ id: data.id, name: formData.fullName });
      toast({
        title: "Transmission Logged!",
        description: `Your candidate dossier is registered with ID: ${data.id}`,
      });
    } catch (err: any) {
      cyberAudio.playError();
      toast({
        title: "Submission Error",
        description: err?.message || "Failed to log candidate dossier. Please retry.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <section className="py-10 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#081220]/90 border border-cyan-500/30 rounded-full mb-3 backdrop-blur-md">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] sm:text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">
                TACTICAL RECRUITMENT PIPELINE
              </span>
            </div>
            <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
              Join the w0lf.exe Pack
            </h1>
            <p className="text-zinc-300 max-w-xl mx-auto font-sans text-xs sm:text-sm md:text-base leading-relaxed">
              We recruit passionate CSE (Cyber Security) engineering students, full-stack builders, mobile developers, and CTF competitors ready to build and compete.
            </p>

            {/* Tactical Mode Navigation Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-[#070d18] border border-cyan-500/20 mt-6 max-w-md w-full">
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveTab("apply");
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "apply"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveTab("track");
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "track"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Status by ID</span>
              </button>
            </div>
          </div>

          {/* TAB 1: APPLICATION SUBMISSION OR CONFIRMATION */}
          {activeTab === "apply" && (
            submittedData ? (
              /* Success Confirmation Receipt */
              <div className="rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-cyan-500/20 to-transparent border border-emerald-500/40 backdrop-blur-2xl shadow-2xl">
                <div className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-6 sm:p-10 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(0,255,136,0.35)] animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-bold">
                      TRANSMISSION CONFIRMED // DOSSIER LOGGED
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      Welcome to the Pipeline, {submittedData.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto font-sans leading-relaxed">
                      Your candidate dossier has been forwarded to team administration. You can use your tactical Application ID below to track your review status anytime.
                    </p>
                  </div>

                  {/* Tactical Receipt Box */}
                  <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 max-w-md mx-auto text-left font-mono text-xs space-y-2 text-zinc-300">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-400">APPLICATION ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold tracking-wider">{submittedData.id}</span>
                        <button
                          onClick={() => handleCopyId(submittedData.id)}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                          title="Copy Application ID"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-400">INITIAL STATUS:</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        PENDING REVIEW
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">NEXT STEPS:</span>
                      <span className="text-zinc-300">Leadership review & credentials email</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Button
                      variant="cyber"
                      onClick={() => {
                        cyberAudio.playClick();
                        setActiveTab("track");
                        setTrackingQuery(submittedData.id);
                        handleTrackQuery(submittedData.id);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Track Status Now
                    </Button>

                    <Button
                      variant="cyber-secondary"
                      onClick={() => handleCopyTrackingLink(submittedData.id)}
                      className="w-full sm:w-auto"
                    >
                      {copiedTrackingUrl ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                      Bookmark Tracking Link
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Application Form */
              <div className="rounded-3xl p-1 bg-gradient-to-b from-cyan-500/20 via-zinc-800/20 to-transparent border border-cyan-500/30 backdrop-blur-2xl shadow-2xl">
                <form onSubmit={handleSubmit} className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                  {/* Section 1: Candidate Identity */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      01 // Personal & Academic Telemetry
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-mono text-zinc-300">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          required
                          placeholder="e.g. Alex Turner"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-mono text-zinc-300">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="e.g. operative@psnacet.edu.in"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-mono text-zinc-300">
                          Phone / Telegram
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="department" className="text-xs font-mono text-zinc-300">
                          Department
                        </Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="yearOfStudy" className="text-xs font-mono text-zinc-300">
                          Year of Study
                        </Label>
                        <select
                          id="yearOfStudy"
                          value={formData.yearOfStudy}
                          onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                          className="w-full bg-[#030712] border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500/50"
                        >
                          <option value="1st Year">1st Year (Freshman)</option>
                          <option value="2nd Year">2nd Year (Sophomore)</option>
                          <option value="3rd Year">3rd Year (Junior)</option>
                          <option value="4th Year">4th Year (Senior)</option>
                          <option value="Alumni / Researcher">Alumni / External Researcher</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Roles of Interest */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        02 // Areas of Focus & Desired Role
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-500">Select all that apply</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {AVAILABLE_ROLES.map((role) => {
                        const isSelected = selectedRoles.includes(role.label);
                        const Icon = role.icon;

                        return (
                          <div
                            key={role.id}
                            onClick={() => toggleRole(role.label)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 select-none ${
                              isSelected
                                ? "bg-cyan-950/40 border-cyan-400/70 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                : "bg-[#040810] border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-cyan-500 text-black font-bold" : "bg-zinc-900 text-zinc-400"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-mono font-medium">{role.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Technical Skills & Arsenal */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      03 // Skills, Languages & Frameworks
                    </h3>

                    <div className="space-y-1.5">
                      <Label htmlFor="skills" className="text-xs font-mono text-zinc-300">
                        Technologies & Tools Known *
                      </Label>
                      <Input
                        id="skills"
                        required
                        placeholder="e.g. Python, React, Kotlin, Ghidra, Burp Suite, Wireshark, Docker, Linux"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="experience" className="text-xs font-mono text-zinc-300">
                        Notable Projects, Hackathons, or CTFs Competed
                      </Label>
                      <Textarea
                        id="experience"
                        rows={3}
                        placeholder="Share any apps you built, hackathons attended, CTF challenges solved, or bug bounties identified..."
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Section 4: External Dossier Links */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      04 // Profiles & Repositories
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="githubUrl" className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5" />
                          GitHub Profile
                        </Label>
                        <Input
                          id="githubUrl"
                          placeholder="https://github.com/..."
                          value={formData.githubUrl}
                          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                          className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="linkedinUrl" className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5" />
                          LinkedIn Profile
                        </Label>
                        <Input
                          id="linkedinUrl"
                          placeholder="https://linkedin.com/in/..."
                          value={formData.linkedinUrl}
                          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                          className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="portfolioUrl" className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          Portfolio / CTFtime
                        </Label>
                        <Input
                          id="portfolioUrl"
                          placeholder="https://ctftime.org/team/..."
                          value={formData.portfolioUrl}
                          onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                          className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Motivation */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      05 // Why w0lf.exe?
                    </h3>

                    <div className="space-y-1.5">
                      <Label htmlFor="whyJoin" className="text-xs font-mono text-zinc-300">
                        What drives you to join our engineering & cybersecurity collective?
                      </Label>
                      <Textarea
                        id="whyJoin"
                        rows={3}
                        placeholder="Tell us what you want to learn, what you bring to the pack, and how you see yourself contributing..."
                        value={formData.whyJoin}
                        onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                        className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full py-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 text-black font-mono font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          TRANSMITTING DOSSIER TO COMMAND...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          SUBMIT APPLICATION DOSSIER
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )
          )}

          {/* TAB 2: APPLICATION STATUS TRACKER */}
          {activeTab === "track" && (
            <div className="rounded-3xl p-1 bg-gradient-to-b from-cyan-500/20 via-zinc-800/20 to-transparent border border-cyan-500/30 backdrop-blur-2xl shadow-2xl">
              <div className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-6 sm:p-10 space-y-8">
                {/* Tracker Search Input */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Query Tactical Application Pipeline
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    Enter the tactical Application ID (e.g. <span className="text-cyan-300 font-mono">W0LF-2026-X8F9</span>) or the email address used during submission.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        placeholder="e.g. W0LF-2026-X8F9 or your email"
                        value={trackingQuery}
                        onChange={(e) => setTrackingQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleTrackQuery()}
                        className="bg-[#030712] border-zinc-800 pl-10 text-xs font-mono text-white placeholder:text-zinc-600 focus:border-cyan-500/50"
                      />
                    </div>
                    <Button
                      variant="cyber"
                      onClick={() => handleTrackQuery()}
                      disabled={isSearching}
                      className="px-6"
                    >
                      {isSearching ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                      ) : (
                        <Search className="w-4 h-4 mr-1.5" />
                      )}
                      Track Status
                    </Button>
                  </div>
                </div>

                {/* TRACKING RESULTS */}
                {trackedRequest ? (
                  <div className="space-y-6 pt-4 border-t border-zinc-800/80 animate-fade-in">
                    {/* Status Badge Box */}
                    <div
                      className={`p-5 rounded-2xl border backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        trackedRequest.status === "approved"
                          ? "bg-emerald-950/40 border-emerald-400/60 shadow-[0_0_30px_rgba(0,255,136,0.25)]"
                          : trackedRequest.status === "rejected"
                          ? "bg-red-950/30 border-red-500/40"
                          : "bg-amber-950/30 border-amber-500/50 shadow-[0_0_25px_rgba(255,184,0,0.2)]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              trackedRequest.status === "approved"
                                ? "bg-emerald-400 animate-pulse"
                                : trackedRequest.status === "rejected"
                                ? "bg-red-400"
                                : "bg-amber-400 animate-ping"
                            }`}
                          />
                          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                            APPLICATION STATUS:
                          </span>
                          <span
                            className={`font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              trackedRequest.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                : trackedRequest.status === "rejected"
                                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            {trackedRequest.status === "approved"
                              ? "ACCEPTED & CLEARED"
                              : trackedRequest.status === "rejected"
                              ? "APPLICATION ARCHIVED"
                              : "PENDING LEADERSHIP REVIEW"}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 font-sans">
                          {trackedRequest.status === "approved"
                            ? "Congratulations! Your application has been approved by w0lf.exe command. Check your email for authentication credentials & tactical lab invite."
                            : trackedRequest.status === "rejected"
                            ? "Thank you for applying. We are currently at capacity for these roles, but your dossier remains recorded for future project cycles."
                            : "Your dossier is currently logged in the recruitment queue. Team leads evaluate submissions weekly."}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyTrackingLink(trackedRequest.id)}
                        className="px-3 py-1.5 rounded-lg bg-black/60 border border-zinc-700 hover:border-cyan-400 text-zinc-300 font-mono text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        {copiedTrackingUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Link Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Share Tracking URL</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Candidate Telemetry Dossier */}
                    <div className="p-5 rounded-2xl bg-[#040810] border border-zinc-800 space-y-4 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <div>
                          <span className="text-zinc-500 text-[10px] uppercase">Candidate Name</span>
                          <h4 className="text-base font-bold text-white font-display mt-0.5">
                            {trackedRequest.full_name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-500 text-[10px] uppercase">Application ID</span>
                          <p className="text-cyan-400 font-bold">{trackedRequest.id}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
                        <div>
                          <span className="text-zinc-500 text-[10px] block">EMAIL:</span>
                          <span>{trackedRequest.email}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">DEPARTMENT & YEAR:</span>
                          <span>{trackedRequest.department} • {trackedRequest.year_of_study}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">SUBMITTED AT:</span>
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {new Date(trackedRequest.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">SKILLS & ARSENAL:</span>
                          <span className="text-zinc-300 truncate block">{trackedRequest.skills}</span>
                        </div>
                      </div>

                      {/* Applied Roles Badges */}
                      <div className="pt-2 border-t border-zinc-900">
                        <span className="text-zinc-500 text-[10px] block mb-2">APPLIED ROLES:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(trackedRequest.roles || []).map((r) => (
                            <span
                              key={r}
                              className="px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-[11px]"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : searchAttempted && !isSearching ? (
                  <div className="p-8 rounded-2xl bg-black/40 border border-zinc-800 text-center space-y-3 animate-fade-in">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                    <h4 className="font-display font-bold text-white text-base">
                      No Application Dossier Found
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
                      We could not locate any application matching "<span className="text-cyan-300 font-mono">{trackingQuery}</span>". Please double-check your ID or email, or submit a new application.
                    </p>
                    <Button
                      variant="cyber-secondary"
                      onClick={() => setActiveTab("apply")}
                      className="mt-2 text-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Submit Fresh Application
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
