import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitJoinRequest } from "@/hooks/useJoinRequests";
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
  const submitMutation = useSubmitJoinRequest();

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

  const toggleRole = (roleLabel: string) => {
    cyberAudio.playClick();
    setSelectedRoles((prev) =>
      prev.includes(roleLabel)
        ? prev.filter((r) => r !== roleLabel)
        : [...prev, roleLabel]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.skills.trim()) {
      toast({
        title: "Incomplete Telemetry",
        description: "Please provide your full name, email, and skills.",
        variant: "destructive",
      });
      return;
    }

    cyberAudio.playAccessGranted();

    try {
      const res = await submitMutation.mutateAsync({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        department: formData.department,
        year_of_study: formData.yearOfStudy,
        roles: selectedRoles,
        skills: formData.skills,
        github_url: formData.githubUrl || null,
        linkedin_url: formData.linkedinUrl || null,
        portfolio_url: formData.portfolioUrl || null,
        experience: formData.experience || null,
        why_join: formData.whyJoin || "Eager to learn, build, and compete with team w0lf.exe.",
      });

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#29a9ff", "#00ff88", "#ffd700"],
      });

      setSubmittedData({ id: res.id, name: res.full_name });

      toast({
        title: "Application Transmitted!",
        description: "Your application has been received and queued for review.",
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#081220]/80 border border-cyan-500/30 rounded-full mb-4 select-none">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">
                OPERATIVE RECRUITMENT PORTAL
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
              Join the <span className="text-cyan-400">w0lf.exe</span> Collective
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto font-sans text-sm sm:text-base leading-relaxed">
              We are a team of CSE (Cyber Security) engineering students who build production software, develop Android apps, build hackathon MVPs, and win CTFs. Ready to build with us?
            </p>
          </div>

          {submittedData ? (
            /* Success Confirmation Screen */
            <div className="rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-zinc-800/20 to-transparent border border-emerald-500/40 backdrop-blur-2xl shadow-2xl animate-fade-in">
              <div className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-8 sm:p-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(0,255,136,0.3)]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-bold">
                    TRANSMISSION CONFIRMED // APPLICATION LOGGED
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Welcome to the Pipeline, {submittedData.name}!
                  </h2>
                  <p className="text-sm text-zinc-300 max-w-lg mx-auto font-sans leading-relaxed">
                    Your candidate dossier has been forwarded to team administration. Our team leads will review your credentials and get back to you shortly.
                  </p>
                </div>

                {/* Tactical Receipt Box */}
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 max-w-md mx-auto text-left font-mono text-xs space-y-1 text-zinc-400">
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <span>APPLICATION ID:</span>
                    <span className="text-cyan-400 font-bold">{submittedData.id.slice(0, 12)}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <span>STATUS:</span>
                    <span className="text-amber-400 font-bold">PENDING REVIEW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NEXT STEPS:</span>
                    <span className="text-zinc-300">Admin onboarding & login credentials</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Link to="/" onClick={() => cyberAudio.playClick()}>
                    <Button variant="cyber">
                      Back to Operations Hub
                    </Button>
                  </Link>
                  <Link to="/projects" onClick={() => cyberAudio.playClick()}>
                    <Button variant="cyber-secondary">
                      Explore Current Blueprints
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Application Form */
            <div className="rounded-3xl p-1 bg-gradient-to-b from-cyan-500/20 via-zinc-800/20 to-transparent border border-cyan-500/30 backdrop-blur-2xl shadow-2xl">
              <form onSubmit={handleSubmit} className="rounded-[calc(1.5rem-2px)] bg-[#070d18]/95 p-6 sm:p-10 space-y-8">
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
                        placeholder="e.g. alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-mono text-zinc-300">
                        Phone / WhatsApp (Optional)
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
                        Department & Branch *
                      </Label>
                      <Input
                        id="department"
                        required
                        placeholder="e.g. CSE (Cyber Security) / CSE / IT"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="yearOfStudy" className="text-xs font-mono text-zinc-300">
                        Year of Study *
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
                      placeholder="e.g. Kotlin, React, Python, Burp Suite, Rust, Git, Linux, Figma..."
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="experience" className="text-xs font-mono text-zinc-300">
                      Projects / Hackathons / CTF Experience (Optional)
                    </Label>
                    <Textarea
                      id="experience"
                      rows={3}
                      placeholder="Tell us about any projects you've built, hackathons you've attended, TryHackMe/HackTheBox rooms solved, or apps deployed..."
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono resize-none"
                    />
                  </div>
                </div>

                {/* Section 4: Web Presence */}
                <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    04 // Links & Proof of Work (Optional)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="githubUrl" className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> GitHub Profile
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
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
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
                        <Globe className="w-3.5 h-3.5" /> Portfolio / Website
                      </Label>
                      <Input
                        id="portfolioUrl"
                        placeholder="https://..."
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Statement of Intent */}
                <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    05 // Motivation & Vision
                  </h3>

                  <div className="space-y-1.5">
                    <Label htmlFor="whyJoin" className="text-xs font-mono text-zinc-300">
                      Why do you want to join team w0lf.exe?
                    </Label>
                    <Textarea
                      id="whyJoin"
                      rows={3}
                      placeholder="What drives you? What do you want to build or achieve with the squad?"
                      value={formData.whyJoin}
                      onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                      className="bg-[#030712] border-zinc-800 focus:border-cyan-500/50 text-xs font-mono resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs font-mono text-zinc-500 text-center sm:text-left">
                    Transmission is encrypted. Reviewed exclusively by team administrators.
                  </p>

                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    variant="cyber"
                    className="w-full sm:w-auto px-8 py-3 text-xs tracking-wider"
                  >
                    {submitMutation.isPending ? (
                      <span className="animate-pulse">Transmitting Application...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        SUBMIT APPLICATION
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
