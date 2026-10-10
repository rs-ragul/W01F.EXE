import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMembersPanel } from "@/components/admin/AdminMembersPanel";
import { AdminApplicationsPanel } from "@/components/admin/AdminApplicationsPanel";
import { AdminProjectsPanel } from "@/components/admin/AdminProjectsPanel";
import { AdminAchievementsPanel } from "@/components/admin/AdminAchievementsPanel";
import { AdminStatsPanel } from "@/components/admin/AdminStatsPanel";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import { useJoinRequests } from "@/hooks/useJoinRequests";
import {
  Crown,
  LogOut,
  Terminal,
  Users,
  FolderKanban,
  Trophy,
  Activity,
  Edit,
  UserPlus,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  full_name: string | null;
  department: string | null;
  team_role: string | null;
}

export default function AdminDashboard() {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { data: applications } = useJoinRequests();

  const pendingAppsCount = (applications || []).filter((a) => a.status === "pending").length;

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      navigate("/auth");
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id,user_id,username,full_name,avatar_url,department,team_role,email")
        .eq("user_id", user.id)
        .single();
      if (data) setProfile(data as Profile);
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    cyberAudio.playClick();
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <section className="min-h-[85vh] flex items-center justify-center">
          <div className="text-center">
            <Terminal className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground font-mono">Loading admin terminal...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user || role !== "admin") {
    return null;
  }

  return (
    <Layout>
      <section className="min-h-[85vh] px-4 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                <GlitchText
                  text="Admin Control Center"
                  className="text-3xl md:text-4xl font-display font-bold"
                />
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                <span className="text-secondary">$</span> root@w0lf.exe ~# sudo access granted // command node active
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="cyber"
                onClick={() => {
                  cyberAudio.playClick();
                  setIsProfileEditOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="cyber-secondary"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Admin Profile Card */}
          <CyberCard variant="glow" className="p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl border-2 border-primary overflow-hidden flex items-center justify-center bg-primary/10">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Crown className="w-10 h-10 text-yellow-500" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-bold text-xl text-foreground mb-1">
                  {profile?.full_name || profile?.username || "Admin Operative"}
                </h3>
                <p className="text-muted-foreground font-mono text-sm mb-2">
                  {user?.email}
                </p>
                {(profile?.team_role || profile?.department) && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2">
                    {profile?.team_role && (
                      <Badge
                        variant="outline"
                        className="border-destructive/60 text-destructive bg-destructive/10 font-mono text-xs"
                      >
                        {profile.team_role}
                      </Badge>
                    )}
                    {profile?.department && (
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-primary font-mono text-xs"
                      >
                        {profile.department}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-mono">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  ADMINISTRATOR
                </div>
              </div>
              <Button
                variant="cyber"
                onClick={() => {
                  cyberAudio.playClick();
                  setIsProfileEditOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CyberCard>

          {/* Tabs for management */}
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-8 bg-card/50 border border-primary/20 h-auto p-1.5 gap-1">
              <TabsTrigger
                value="members"
                onClick={() => cyberAudio.playClick()}
                className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/20 py-2.5 font-mono text-xs"
              >
                <Users className="w-4 h-4 text-primary" />
                <span>Members</span>
              </TabsTrigger>

              <TabsTrigger
                value="applications"
                onClick={() => cyberAudio.playClick()}
                className="flex items-center justify-center gap-2 data-[state=active]:bg-cyan-500/20 py-2.5 font-mono text-xs relative"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Join Requests</span>
                {pendingAppsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center ml-1 animate-pulse">
                    {pendingAppsCount}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="projects"
                onClick={() => cyberAudio.playClick()}
                className="flex items-center justify-center gap-2 data-[state=active]:bg-secondary/20 py-2.5 font-mono text-xs"
              >
                <FolderKanban className="w-4 h-4 text-secondary" />
                <span>Projects</span>
              </TabsTrigger>

              <TabsTrigger
                value="achievements"
                onClick={() => cyberAudio.playClick()}
                className="flex items-center justify-center gap-2 data-[state=active]:bg-yellow-500/20 py-2.5 font-mono text-xs"
              >
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Achievements</span>
              </TabsTrigger>

              <TabsTrigger
                value="stats"
                onClick={() => cyberAudio.playClick()}
                className="flex items-center justify-center gap-2 data-[state=active]:bg-emerald-500/20 py-2.5 font-mono text-xs"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Site Stats</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <AdminMembersPanel />
            </TabsContent>
            <TabsContent value="applications">
              <AdminApplicationsPanel />
            </TabsContent>
            <TabsContent value="projects">
              <AdminProjectsPanel />
            </TabsContent>
            <TabsContent value="achievements">
              <AdminAchievementsPanel />
            </TabsContent>
            <TabsContent value="stats">
              <AdminStatsPanel />
            </TabsContent>
          </Tabs>

          {/* Profile Edit Dialog */}
          {user && (
            <ProfileEditDialog
              open={isProfileEditOpen}
              onOpenChange={setIsProfileEditOpen}
              userId={user.id}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
