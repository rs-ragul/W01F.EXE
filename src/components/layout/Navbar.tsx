import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Terminal, LogOut, User, Crown, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { cyberAudio } from "@/lib/cyberAudio";
import { TelemetryHud } from "@/components/cyber/TelemetryHud";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/achievements", label: "Achievements" },
  { href: "/members", label: "Members" },
  { href: "/join", label: "Join Us" },
];

interface NavbarProps {
  onOpenTerminal?: () => void;
}

export function Navbar({ onOpenTerminal }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(cyberAudio.isMuted());
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  useEffect(() => {
    const handleAudioChange = (e: Event) => {
      const custom = e as CustomEvent<{ muted: boolean }>;
      setIsMuted(custom.detail.muted);
    };
    window.addEventListener("w01f_audio_change", handleAudioChange);
    return () => window.removeEventListener("w01f_audio_change", handleAudioChange);
  }, []);

  const handleSignOut = async () => {
    cyberAudio.playClick();
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSound = () => {
    const next = cyberAudio.toggleMute();
    setIsMuted(next);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 select-none">
      {/* Top Telemetry Ticker HUD */}
      <TelemetryHud />

      {/* Floating Tactical Navbar */}
      <div className="container mx-auto px-3 sm:px-6 py-1.5 sm:py-2">
        <div
          className={cn(
            "rounded-2xl border transition-all duration-300 px-3 sm:px-6 py-2 flex items-center justify-between",
            hasScrolled
              ? "border-cyan-500/30 bg-[#060b14]/95 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(0,240,255,0.12)] backdrop-blur-xl"
              : "border-cyan-500/15 bg-[#060b14]/80 shadow-lg backdrop-blur-md"
          )}
        >
          {/* Left: Brand Identity */}
          <Link
            to="/"
            onClick={() => cyberAudio.playClick()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="group flex items-center gap-2.5 sm:gap-3 select-none"
            aria-label="w0lf.exe home"
          >
            <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-950/80 to-[#030712] border border-cyan-500/40 p-1 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all duration-300 shrink-0">
              <img
                src="/wolf-logo-transparent.png"
                alt="w0lf.exe wolf logo"
                className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-transform"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-pulse border border-[#030712]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base sm:text-xl font-black text-white tracking-wider">
                  w0lf<span className="text-cyan-400">.exe</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 font-bold">
                  SEC
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 tracking-tight hidden sm:block">
                CYBERNETICS // LAB
              </div>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#09111e]/80 border border-cyan-500/20 rounded-full px-2 py-1 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => cyberAudio.playClick()}
                  onMouseEnter={() => cyberAudio.playHover()}
                  className={cn(
                    "relative px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-all duration-300 rounded-full",
                    isActive
                      ? "text-cyan-300 bg-cyan-500/20 shadow-[0_0_12px_rgba(0,240,255,0.25)] font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Terminal, Audio, Auth) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* CLI Terminal Trigger */}
            {onOpenTerminal && (
              <button
                onClick={() => {
                  cyberAudio.playAccessGranted();
                  onOpenTerminal();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-900/50 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                title="Launch Tactical CLI"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>&gt;_ CLI</span>
              </button>
            )}

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              onMouseEnter={() => cyberAudio.playHover()}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all",
                isMuted
                  ? "bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  : "bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              )}
              title={isMuted ? "Turn On Audio FX" : "Mute Audio FX"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[10px]">MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse" />
                    <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150" />
                  </span>
                </>
              )}
            </button>

            {/* User Auth / Dashboard */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to={getDashboardLink()} onClick={() => cyberAudio.playClick()}>
                  <Button
                    size="sm"
                    className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 font-mono text-xs"
                  >
                    {role === "admin" ? (
                      <Crown className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    ) : (
                      <User className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {role === "admin" ? "Admin" : "Portal"}
                  </Button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => cyberAudio.playClick()}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold font-mono text-xs hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 mr-1.5 text-black" />
                  LOGIN
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: Sound + Menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400"
              title="Audio Toggle"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => {
                cyberAudio.playClick();
                setIsOpen(!isOpen);
              }}
              className="p-2 rounded-xl bg-zinc-900/90 border border-cyan-500/30 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden mx-3 mt-1 rounded-2xl bg-[#060b14]/98 border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-2xl animate-fade-in">
          <div className="flex flex-col gap-2 font-mono text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => {
                  cyberAudio.playClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "p-3 rounded-xl uppercase tracking-wider flex items-center justify-between transition-all",
                  location.pathname === link.href
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                )}
              >
                <span>{link.label}</span>
                <span className="text-xs text-cyan-500">›</span>
              </Link>
            ))}

            {onOpenTerminal && (
              <button
                onClick={() => {
                  cyberAudio.playAccessGranted();
                  setIsOpen(false);
                  onOpenTerminal();
                }}
                className="p-3 rounded-xl uppercase tracking-wider flex items-center justify-between text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 font-bold mt-1"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Tactical Console CLI
                </span>
                <span className="text-xs">RUN</span>
              </button>
            )}

            <div className="pt-3 border-t border-zinc-800/80 mt-2">
              {user ? (
                <div className="flex gap-2">
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    <Button className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-mono text-xs">
                      {role === "admin" ? <Crown className="w-3.5 h-3.5 mr-1 text-amber-400" /> : <User className="w-3.5 h-3.5 mr-1" />}
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="border-red-500/30 text-red-400 hover:bg-red-950/30 font-mono text-xs"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-cyan-500 text-black font-bold font-mono text-xs">
                    <Terminal className="w-3.5 h-3.5 mr-1.5" />
                    LOGIN TO LAB
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
