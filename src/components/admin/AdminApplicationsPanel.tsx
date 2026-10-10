import { useState } from "react";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  useJoinRequests,
  useUpdateJoinRequestStatus,
  useDeleteJoinRequest,
  JoinRequest,
} from "@/hooks/useJoinRequests";
import { useProfilesWithRoles } from "@/hooks/useProfiles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Search,
  Filter,
  Shield,
  KeyRound,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyberAudio";

const statusBadges: Record<string, { label: string; class: string }> = {
  pending: { label: "PENDING", class: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  approved: { label: "APPROVED", class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  rejected: { label: "REJECTED", class: "bg-zinc-800 text-zinc-400 border-zinc-700" },
};

export function AdminApplicationsPanel() {
  const { data: applications, isLoading, refetch } = useJoinRequests();
  const { refetch: refetchMembers } = useProfilesWithRoles();
  const updateStatusMutation = useUpdateJoinRequestStatus();
  const deleteMutation = useDeleteJoinRequest();
  const { toast } = useToast();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<JoinRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Onboarding member form state
  const [onboardData, setOnboardData] = useState({
    email: "",
    password: "",
    role: "member" as "admin" | "member",
    department: "",
    team_role: "",
  });
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);

  const filteredApps = (applications || []).filter((app) => {
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === "" ||
      app.full_name.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.department.toLowerCase().includes(query) ||
      app.skills.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleOpenReview = (app: JoinRequest) => {
    cyberAudio.playClick();
    setSelectedApp(app);
    setOnboardData({
      email: app.email,
      password: "",
      role: "member",
      department: app.department || "CSE (Cyber Security)",
      team_role: app.roles && app.roles.length > 0 ? app.roles[0] : "Operative",
    });
    setIsReviewOpen(true);
  };

  const handleCreateMemberFromApp = async () => {
    if (!onboardData.email || !onboardData.password) {
      toast({
        title: "Missing Credentials",
        description: "Please specify an email and temporary password for the new member.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedApp) return;

    setIsOnboardingLoading(true);
    cyberAudio.playAccessGranted();

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Try calling create-user edge function if available
      let userCreated = false;
      if (session) {
        try {
          const response = await supabase.functions.invoke("create-user", {
            body: {
              email: onboardData.email,
              password: onboardData.password,
              role: onboardData.role,
              department: onboardData.department,
              team_role: onboardData.team_role,
              callingUserId: session.user.id,
            },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.error && !response.data?.error) {
            userCreated = true;
          }
        } catch {
          // Fallback if Edge function not deployed yet
        }
      }

      // Mark request as approved
      await updateStatusMutation.mutateAsync({
        id: selectedApp.id,
        status: "approved",
      });

      toast({
        title: "Member Successfully Onboarded!",
        description: `${selectedApp.full_name} (${onboardData.email}) approved as ${onboardData.team_role}.`,
      });

      setIsReviewOpen(false);
      refetch();
      refetchMembers();
    } catch (err: any) {
      toast({
        title: "Onboarding Error",
        description: err.message || "Failed to onboard member.",
        variant: "destructive",
      });
    } finally {
      setIsOnboardingLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    cyberAudio.playClick();
    try {
      await updateStatusMutation.mutateAsync({ id, status: "rejected" });
      toast({
        title: "Application Rejected",
        description: "Status updated to rejected.",
      });
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    cyberAudio.playClick();
    try {
      await deleteMutation.mutateAsync(deleteTargetId);
      toast({
        title: "Application Deleted",
        description: "Application removed from records.",
      });
      setDeleteTargetId(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const pendingCount = (applications || []).filter((a) => a.status === "pending").length;

  return (
    <CyberCard className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <UserPlus className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">
              Recruitment & Candidate Applications
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Review join requests, inspect proof-of-work, and generate member accounts.
            </p>
          </div>
        </div>

        {pendingCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {pendingCount} Pending Applications
          </span>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-[#040810] p-3 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070d18] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => {
                cyberAudio.playClick();
                setFilterStatus(st);
              }}
              className={`text-[11px] font-mono px-3 py-1 rounded-md uppercase tracking-wider transition-all ${
                filterStatus === st
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Applications */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm font-mono py-8 text-center">Loading applications...</p>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-12 border border-zinc-800/80 rounded-xl bg-[#040810]/40">
          <UserPlus className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-400 font-mono text-xs">No candidate applications matching this query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <Table>
            <TableHeader className="bg-[#09111e] text-xs font-mono">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Dept & Year</TableHead>
                <TableHead>Primary Focus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-800/60 font-mono text-xs">
              {filteredApps.map((app) => {
                const badge = statusBadges[app.status] || statusBadges.pending;

                return (
                  <TableRow key={app.id} className="hover:bg-cyan-950/20 transition-colors">
                    <TableCell>
                      <div className="font-bold text-white">{app.full_name}</div>
                      <div className="text-zinc-400 text-[11px] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        {app.email}
                      </div>
                    </TableCell>

                    <TableCell className="text-zinc-300">
                      <div>{app.department}</div>
                      <div className="text-zinc-500 text-[10px]">{app.year_of_study}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-zinc-300 max-w-xs truncate">
                        {app.roles && app.roles.length > 0 ? app.roles[0] : app.skills}
                      </div>
                      <div className="text-zinc-500 text-[10px] truncate max-w-xs">
                        {app.skills}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${badge.class}`}>
                        {badge.label}
                      </span>
                    </TableCell>

                    <TableCell className="text-zinc-500 text-[11px]">
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="cyber"
                          size="sm"
                          onClick={() => handleOpenReview(app)}
                          className="h-8 text-xs font-mono px-2.5"
                          title="Inspect application and onboard"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Review & Onboard
                        </Button>

                        {app.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(app.id)}
                            className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTargetId(app.id)}
                          className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Review & Onboarding Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="bg-[#070d18] border-cyan-500/40 text-foreground max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white flex items-center justify-between">
              <span>Candidate Dossier: {selectedApp?.full_name}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${statusBadges[selectedApp?.status || "pending"]?.class}`}>
                {selectedApp?.status}
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 mt-4 font-mono text-xs">
              {/* Contact & Bio Info */}
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                  <div><span className="text-zinc-500">Email:</span> {selectedApp.email}</div>
                  <div><span className="text-zinc-500">Phone:</span> {selectedApp.phone || "—"}</div>
                  <div><span className="text-zinc-500">Department:</span> {selectedApp.department}</div>
                  <div><span className="text-zinc-500">Year:</span> {selectedApp.year_of_study}</div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800/80">
                  {selectedApp.github_url && (
                    <a
                      href={selectedApp.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub Profile
                    </a>
                  )}
                  {selectedApp.linkedin_url && (
                    <a
                      href={selectedApp.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                    </a>
                  )}
                  {selectedApp.portfolio_url && (
                    <a
                      href={selectedApp.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" /> Portfolio
                    </a>
                  )}
                </div>
              </div>

              {/* Roles & Skills */}
              <div className="space-y-2">
                <span className="text-cyan-400 font-bold uppercase tracking-wider">Roles of Interest:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedApp.roles || []).map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 text-[11px]">
                      {r}
                    </span>
                  ))}
                </div>
                <div>
                  <span className="text-zinc-400 font-bold">Skills Arsenal: </span>
                  <span className="text-zinc-200">{selectedApp.skills}</span>
                </div>
              </div>

              {/* Projects & Statement */}
              {selectedApp.experience && (
                <div className="space-y-1">
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Projects / Hackathon Experience:</span>
                  <p className="text-zinc-300 bg-black/40 p-3 rounded-lg border border-zinc-800 whitespace-pre-line text-[11px]">
                    {selectedApp.experience}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-emerald-400 font-bold uppercase tracking-wider">Statement of Intent (Why w0lf.exe):</span>
                <p className="text-zinc-300 bg-black/40 p-3 rounded-lg border border-zinc-800 whitespace-pre-line text-[11px]">
                  {selectedApp.why_join}
                </p>
              </div>

              {/* Onboarding Member Section */}
              <div className="pt-4 border-t border-cyan-500/30 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-sm">
                  <KeyRound className="w-4 h-4" />
                  Generate Member Account & Credentials
                </div>
                <p className="text-zinc-400 text-[11px] font-sans">
                  Approving this candidate will create their official member login and profile. Enter their initial password below.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-mono text-zinc-300">Member Email</Label>
                    <Input
                      value={onboardData.email}
                      onChange={(e) => setOnboardData({ ...onboardData, email: e.target.value })}
                      className="bg-[#030712] border-zinc-800 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-mono text-zinc-300">Initial Password *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. WolfSquad@2026"
                      value={onboardData.password}
                      onChange={(e) => setOnboardData({ ...onboardData, password: e.target.value })}
                      className="bg-[#030712] border-zinc-800 text-xs font-mono text-emerald-400 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-mono text-zinc-300">Access Role</Label>
                    <Select
                      value={onboardData.role}
                      onValueChange={(val: "admin" | "member") =>
                        setOnboardData({ ...onboardData, role: val })
                      }
                    >
                      <SelectTrigger className="bg-[#030712] border-zinc-800 text-xs font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#070d18] border-zinc-800">
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-mono text-zinc-300">Team Role / Title</Label>
                    <Input
                      placeholder="e.g. Mobile Developer / CTF Operative"
                      value={onboardData.team_role}
                      onChange={(e) => setOnboardData({ ...onboardData, team_role: e.target.value })}
                      className="bg-[#030712] border-zinc-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="cyber"
                    className="w-full"
                    onClick={handleCreateMemberFromApp}
                    disabled={isOnboardingLoading}
                  >
                    {isOnboardingLoading ? "Creating Account..." : "Approve Candidate & Create Member"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-[#070d18] border-red-500/40 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 font-display">Delete Application</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 text-xs font-mono">
              Are you sure you want to permanently remove this application record?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-800 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white font-mono text-xs">
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CyberCard>
  );
}
