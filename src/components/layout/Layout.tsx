import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="scanline opacity-20" />
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay opacity-60 pointer-events-none" />
      <div className="particle-field fixed inset-0 opacity-[0.06] pointer-events-none" />
      
      {/* Ambient Glow Effects */}
      <div className="fixed -top-32 left-1/4 h-[34rem] w-[34rem] bg-primary/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/5 h-[30rem] w-[30rem] bg-secondary/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed left-0 top-1/3 h-80 w-72 bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="relative z-10 pt-16">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-primary/15 bg-background/80 py-10 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <img src="/wolf-logo-transparent.png" alt="w0lf.exe wolf logo" loading="lazy" className="h-12 w-auto object-contain" />
            <div>
              <p className="font-display text-sm font-black text-foreground">w0lf.exe</p>
              <p className="text-xs text-muted-foreground">Cybersecurity | CTF | Red Team | Blue Team</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 w0lf.exe Cybersecurity Team.
          </p>
        </div>
      </footer>
    </div>
  );
}
