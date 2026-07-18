import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Terminal, LogOut, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/achievements", label: "Achievements" },
  { href: "/members", label: "Members" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500",
        hasScrolled
          ? "border-primary/20 bg-background/80 shadow-[0_18px_80px_hsl(220_40%_2%/0.45)] backdrop-blur-xl"
          : "border-transparent bg-background/[0.45] backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3" aria-label="w0lf.exe home">
            <div className="relative flex h-14 w-12 items-center justify-center">
              <div className="absolute inset-0 bg-primary/[0.18] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src="/wolf-logo-transparent.png"
                alt="w0lf.exe wolf logo"
                className="relative h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="font-display text-lg font-black text-foreground">
              w0lf<span className="text-primary">.exe</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold uppercase tracking-normal transition-all duration-300",
                  location.pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 bg-primary shadow-[0_0_22px_hsl(var(--primary)/0.55)]" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={getDashboardLink()}>
                  <Button variant="outline" size="sm">
                    {role === "admin" ? (
                      <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                    ) : (
                      <User className="w-4 h-4 mr-2" />
                    )}
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <Terminal className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary/20 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold uppercase tracking-normal transition-all duration-300",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10 cyber-border"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                    <Button variant="cyber" className="w-full mt-2">
                      {role === "admin" ? (
                        <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                      ) : (
                        <User className="w-4 h-4 mr-2" />
                      )}
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full mt-2" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="cyber" className="w-full mt-2">
                    <Terminal className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
