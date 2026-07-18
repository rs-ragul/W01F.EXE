import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CyberCard } from "@/components/cyber/CyberCard";
import { HexagonCard } from "@/components/cyber/HexagonCard";
import { StatCounter } from "@/components/cyber/StatCounter";
import { CircuitDivider } from "@/components/cyber/CircuitDivider";
import { Reveal } from "@/components/cyber/Reveal";
import { useSiteStats } from "@/hooks/useSiteStats";
import {
  Shield,
  Terminal,
  Code,
  Users,
  Trophy,
  ChevronRight,
  Zap,
  Cpu,
  CircuitBoard,
} from "lucide-react";

interface StatDisplay {
  value: number;
  label: string;
  suffix?: string;
}

const features = [
  {
    icon: Shield,
    title: "Security Research",
    description: "Offense, defense, CTFs, and secure engineering practice.",
  },
  {
    icon: Code,
    title: "Software Systems",
    description: "Products, tooling, open-source builds, and rapid prototypes.",
  },
  {
    icon: Cpu,
    title: "AI & Automation",
    description: "Applied intelligence, agents, model experiments, and workflows.",
  },
  {
    icon: CircuitBoard,
    title: "Hardware Lab",
    description: "Embedded systems, electronics, and hands-on engineering.",
  },
];

export default function Index() {
  const { data: siteStats, isLoading: statsLoading } = useSiteStats();

  // Transform site stats for display
  const statsForDisplay: StatDisplay[] = (siteStats || []).map((stat) => ({
    value: stat.stat_value,
    label: stat.stat_label,
    suffix: stat.stat_key.includes("bounty") ? "+" : "",
  }));

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-4 py-16 md:py-24">
        <div className="hero-home-bg absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(220_24%_5%/0.94)_0%,hsl(220_24%_5%/0.78)_34%,hsl(220_24%_5%/0.2)_62%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_44%,hsl(var(--primary)/0.08),transparent_38%)]" />
        <div className="hero-wolf-activity pointer-events-none absolute inset-0">
          <svg className="hero-flow-lines absolute inset-0 h-full w-full" viewBox="0 0 1600 900" fill="none" aria-hidden="true">
            <g className="hero-flow hero-flow-red" strokeLinecap="round" strokeLinejoin="round">
              <path d="M780 456H646l-48-48H492" />
              <path d="M792 548H646l-56 56H474" />
              <path d="M852 642 770 724H642" />
              <path d="M828 332 760 264h-96" />
            </g>
            <g className="hero-flow hero-flow-blue" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1342 332h126l54-54h78" />
              <path d="M1330 448h150l52 52h86" />
              <path d="M1294 586 1370 662h132" />
              <path d="M1362 702h92l54 54" />
            </g>
            <g className="hero-flow hero-flow-steel" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1090 226v-88l-30-30" />
              <path d="M1130 226v-82l36-36V64" />
              <path d="M1450 236 1504 182h72" />
              <path d="M730 248 676 194h-86" />
            </g>
          </svg>
          <div className="hero-eye hero-eye-red" />
          <div className="hero-eye hero-eye-blue" />
          <div className="hero-scan-sweep" />
        </div>
        <div className="particle-field absolute inset-0 opacity-[0.05]" />
        <div className="container relative z-10 mx-auto grid items-center gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="max-w-lg text-left lg:-translate-y-[3%]">
            <div className="flex flex-wrap items-center gap-x-2 text-sm font-bold uppercase tracking-wider animate-reveal">
              <span className="text-[#FF3B30]">Red</span>
              <span className="text-foreground">team.</span>
              <span className="text-[#29A9FF]">Blue</span>
              <span className="text-foreground">team.</span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
              <span className="block">We hunt</span>
              <span className="block bg-gradient-to-r from-[#FF3B30] via-[#c77bd6] to-[#29A9FF] bg-clip-text text-transparent">
                vulnerabilities.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground md:text-lg">
              Offensive minds. Defensive strategies. One mission: secure the
              digital world.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/projects">
                <Button variant="cyber" size="lg" className="group w-full sm:w-auto">
                  <Terminal className="h-5 w-5" />
                  View Engineering Work
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/members">
                <Button variant="cyber-secondary" size="lg" className="w-full sm:w-auto">
                  <Users className="h-5 w-5" />
                  Meet the Team
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="dashboard-panel relative overflow-hidden py-14 md:py-20">
        <div className="grid-overlay absolute inset-0 opacity-60" />
        <div className="dashboard-glow absolute inset-0" />
        <div className="container relative mx-auto px-4">
          {statsLoading ? (
            <div className="text-center">
              <Terminal className="w-8 h-8 text-primary mx-auto animate-pulse" />
            </div>
          ) : statsForDisplay.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {statsForDisplay.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 90}>
                  <div
                    className={cn(
                      "px-4",
                      index > 0 && "md:border-l md:border-primary/[0.12]"
                    )}
                  >
                    <StatCounter end={stat.value} suffix={stat.suffix} label={stat.label} />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <CircuitDivider className="py-10 md:py-14" />

      {/* Features Section */}
      <section className="section-shell !pt-0">
        <div className="container mx-auto">
          <Reveal className="text-center mb-16">
            <span className="section-kicker">
              <Zap className="h-3.5 w-3.5" />
              Operating domains
            </span>
            <h2 className="section-title">
              Engineering, not just cybersecurity.
            </h2>
            <p className="section-copy">
              Security is the edge, but the team's work spans software, AI,
              electronics, open-source contribution, and competition-grade builds.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 100}>
                <CyberCard className="h-full text-left">
                  <div className="mb-5 h-12 w-12 relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl transition-opacity duration-300 group-hover:opacity-80" />
                    <div className="relative flex h-full w-full items-center justify-center border border-primary/[0.35] bg-background/60 transition-colors duration-300 group-hover:border-primary/70">
                      <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </CyberCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CircuitDivider className="py-10 md:py-14" />

      {/* Hexagon Showcase */}
      <section className="section-shell overflow-hidden !pt-0">
        <div className="container mx-auto">
          <Reveal className="text-center mb-16">
            <span className="section-kicker">Quick access</span>
            <h2 className="section-title">Explore the lab.</h2>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-8">
            <Reveal delay={0}>
              <Link to="/projects">
                <HexagonCard className="w-48 h-56 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="w-12 h-12 text-primary mx-auto mb-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                    <span className="font-display font-semibold text-foreground">Projects</span>
                  </div>
                </HexagonCard>
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <Link to="/achievements">
                <HexagonCard className="w-48 h-56 flex items-center justify-center" glowColor="secondary">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-secondary mx-auto mb-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                    <span className="font-display font-semibold text-foreground">Achievements</span>
                  </div>
                </HexagonCard>
              </Link>
            </Reveal>
            <Reveal delay={200}>
              <Link to="/members">
                <HexagonCard className="w-48 h-56 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-primary mx-auto mb-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                    <span className="font-display font-semibold text-foreground">Members</span>
                  </div>
                </HexagonCard>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CircuitDivider className="py-10 md:py-14" />

      {/* CTA Section */}
      <section className="section-shell !pt-0">
        <div className="container mx-auto max-w-4xl">
          <Reveal>
            <CyberCard variant="glow" className="p-8 text-center md:p-12">
              <Zap className="mx-auto mb-6 h-14 w-14 text-primary animate-pulse-glow transition-transform duration-500 group-hover:scale-110" />
              <h2 className="font-display text-3xl font-black text-foreground md:text-4xl">
                Competition pressure. Production discipline.
              </h2>
              <p className="mx-auto mb-8 mt-4 max-w-xl leading-7 text-muted-foreground">
                Browse achievements from CTFs, hackathons, research, events, and
                engineering milestones.
              </p>
              <div className="flex justify-center">
                <Link to="/achievements" className="w-full sm:w-auto">
                  <Button variant="cyber" size="lg" className="w-full">
                    <Trophy className="w-5 h-5 mr-2" />
                    View Achievements
                  </Button>
                </Link>
              </div>
            </CyberCard>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
