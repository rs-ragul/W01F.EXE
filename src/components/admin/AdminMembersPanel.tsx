import { useState } from "react";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfilesWithRoles, ProfileWithRole } from "@/hooks/useProfiles";
import {
  buildMailtoLink,
  buildGmailComposeUrl,
  buildOutlookComposeUrl,
  buildApprovalBody,
  buildApprovalSubject,
  getLoginUrl,
  type ApprovalMailData,
} from "@/lib/approvalMail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Users,
  Plus,
  Trash2,
  Edit,
  Mail,
  Send,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  X,
} from "lucide-react";

export function AdminMembersPanel() {
  const { data: profiles, isLoading, refetch } = useProfilesWithRoles();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ userId: string; username: string } | null>(null);
  const [newMember, setNewMember] = useState({
    email: "",
    password: "",
    role: "member" as "admin" | "member",
    department: "",
    team_role: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProfileWithRole | null>(null);
  const [editData, setEditData] = useState({
    role: "member" as "admin" | "member",
    department: "",
    team_role: "",
  });

  // Post-create email state — mirrors AdminApplicationsPanel for manual adds
  const [emailDraft, setEmailDraft] = useState<ApprovalMailData | null>(null);
  const [showEmailBanner, setShowEmailBanner] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const setUserRole = async (userId: string, role: "admin" | "member") => {
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });

    if (insertError) throw insertError;
  };

  const handleAddMember = async () => {
    if (!newMember.email || !newMember.password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading2(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const response = await supabase.functions.invoke("create-user", {
        body: {
          email: newMember.email,
          password: newMember.password,
          role: newMember.role,
          department: newMember.department,
          team_role: newMember.team_role,
          callingUserId: session.user.id,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create user");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Member Added",
        description: `${newMember.email} has been added as ${newMember.role}. Opening email draft…`,
      });

      // ── Build welcome email for manual add (uses DIRECT-ADD id) ──
      const manualMailData: ApprovalMailData = {
        requestId: `DIRECT-ADD-${Date.now().toString(36).toUpperCase()}`,
        candidateName: newMember.email.split("@")[0] || "Operative",
        candidateEmail: newMember.email,
        password: newMember.password,
        teamRole: newMember.team_role || (newMember.role === "admin" ? "Admin" : "Operative"),
        department: newMember.department || "W0LF.EXE",
        loginUrl: getLoginUrl(),
      };
      setEmailDraft(manualMailData);
      setShowEmailBanner(true);
      try {
        const mailtoLink = buildMailtoLink(manualMailData);
        const win = window.open(mailtoLink, "_blank");
        if (!win) window.location.href = mailtoLink;
      } catch (e) {
        console.error("Failed to open mail client:", e);
      }

      setNewMember({ email: "", password: "", role: "member", department: "", team_role: "" });
      setIsAddOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading2(false);
    }
  };

  const handleEditMember = (member: ProfileWithRole) => {
    setEditTarget(member);
    setEditData({
      role: member.role || "member",
      department: member.department || "",
      team_role: member.team_role || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editTarget) return;

    setIsLoading2(true);
    try {
      const originalRole = editTarget.role || "member";
      if (editData.role !== originalRole) {
        await setUserRole(editTarget.user_id, editData.role);
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          department: editData.department || null,
          team_role: editData.team_role || null,
        })
        .eq("id", editTarget.id);

      if (profileError) throw profileError;

      toast({
        title: "Member Updated",
        description: `@${editTarget.username || "member"} updated successfully.`,
      });

      setIsEditOpen(false);
      setEditTarget(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading2(false);
    }
  };

  const confirmDeleteMember = async () => {
    if (!deleteTarget) return;

    // Prevent accidental self-deletion in UI
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession && deleteTarget.userId === currentSession.user.id) {
      toast({
        title: "Action Blocked",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      setDeleteTarget(null);
      return;
    }

    setIsLoading2(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session — please log in again.");
      }

      if (!deleteTarget.userId) {
        throw new Error("Invalid member record — missing user ID.");
      }

      const response = await supabase.functions.invoke("delete-user", {
        body: { 
          userId: deleteTarget.userId,
          callingUserId: session.user.id,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Edge Function returns non-2xx → response.error is FunctionsHttpError with context
      if (response.error) {
        // Try to extract the real server message (not the generic "non-2xx")
        // Supabase-js nests it in context.json or context.text
        const ctx: any = (response.error as any).context;
        let serverMsg: string | undefined;
        try {
          // ctx.json is often a promise-like body; attempt to parse
          if (ctx?.json && typeof ctx.json === "object" && ctx.json.error) serverMsg = ctx.json.error;
          else if (typeof ctx?.text === "string" && ctx.text) {
            const parsed = JSON.parse(ctx.text);
            if (parsed?.error) serverMsg = parsed.error;
          }
        } catch {}
        // Also check data payload directly (some deployments return error there)
        if (!serverMsg && (response.data as any)?.error) serverMsg = (response.data as any).error;
        // Fallback to generic context message
        if (!serverMsg) serverMsg = (response.error as any).message || "Edge Function failed";

        console.warn("[delete-user] Edge Function error:", { status: (response.error as any).status, serverMsg, ctx, data: response.data });

        // Detect common deployment issues to give actionable guidance
        const lower = serverMsg.toLowerCase();
        const isNotDeployed = lower.includes("not found") || lower.includes("404") || lower.includes("not deployed") || (response.error as any).message?.includes("Failed to fetch");
        const isAuthIssue = lower.includes("authorization") || lower.includes("unauthorized") || lower.includes("jwt");
        const isAdminIssue = lower.includes("admin access") || lower.includes("admin required");

        if (isNotDeployed) {
          throw new Error(`Delete service unavailable (Edge Function not deployed). ${serverMsg} — trying fallback cleanup…`);
        }
        if (isAdminIssue) {
          throw new Error(`${serverMsg} — ensure your account has 'admin' role in user_roles.`);
        }
        if (isAuthIssue) {
          throw new Error(`${serverMsg} — session expired, please log out and log in again.`);
        }

        throw new Error(serverMsg);
      }

      if ((response.data as any)?.error) {
        throw new Error((response.data as any).error);
      }

      toast({
        title: "User Deleted",
        description: `@${deleteTarget.username || 'User'} has been removed from the system.`,
      });
      
      refetch();
      setDeleteTarget(null);
      return;
    } catch (error: any) {
      console.error("[delete-user] primary path failed:", error);

      // ── Fallback: direct table cleanup if Edge Function missing/not deployed ──
      // This removes the member from UI (profiles + user_roles) even if auth.users remains.
      // Auth deletion requires service_role, so we do best-effort cleanup + guide to deploy.
      try {
        console.warn("[delete-user] Attempting fallback manual cleanup for", deleteTarget.userId);
        // Try deleting role first, then profile (foreign key cascades may already handle)
        const { error: roleErr } = await supabase.from("user_roles" as any).delete().eq("user_id", deleteTarget.userId);
        const { error: profileErr } = await supabase.from("profiles" as any).delete().eq("user_id", deleteTarget.userId);

        // If either succeeded or at least one had no error, consider it partial success
        const fallbackSuccess = (!roleErr || roleErr.message.includes("0 rows")) && (!profileErr || profileErr.message.includes("0 rows") || !profileErr);
        // Also check if profile was deleted by re-querying
        const { data: remaining } = await supabase.from("profiles" as any).select("id").eq("user_id", deleteTarget.userId).limit(1);

        if (fallbackSuccess || (remaining && remaining.length === 0)) {
          toast({
            title: "Member Removed (Partial)",
            description: `@${deleteTarget.username || 'User'} profile cleared from database. Auth user may still exist — deploy 'delete-user' Edge Function for full deletion (supabase functions deploy delete-user).`,
          });
          refetch();
          setDeleteTarget(null);
          return;
        }

        if (roleErr) console.warn("Fallback role delete error:", roleErr);
        if (profileErr) console.warn("Fallback profile delete error:", profileErr);

        // If fallback also failed, surface original error with deployment hint
        throw error;
      } catch (fallbackErr: any) {
        console.error("[delete-user] fallback also failed:", fallbackErr);
        const msg = error?.message || fallbackErr?.message || "Unknown error";
        const hint = msg.toLowerCase().includes("fallback") || msg.toLowerCase().includes("not deployed")
          ? " — deploy Edge Function: supabase functions deploy delete-user (and verify service_role key)."
          : " — check Supabase Dashboard → Edge Functions logs for details.";

        toast({
          title: "Delete Failed",
          description: `${msg}${hint}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading2(false);
      // Ensure dialog closes only after handling
      // (already closed in success paths, close here for error paths)
      if (deleteTarget) setDeleteTarget(null);
    }
  };

  return (
    <CyberCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Manage Members</h3>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="cyber" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/30">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="member@w0lf.exe"
                />
              </div>
              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="text"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  placeholder="Initial password"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newMember.role}
                  onValueChange={(value: "admin" | "member") =>
                    setNewMember({ ...newMember, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newMember.department}
                  onChange={(e) =>
                    setNewMember({ ...newMember, department: e.target.value })
                  }
                  placeholder="CSE(Cyber Security)"
                />
              </div>
              <div>
                <Label htmlFor="team_role">Team Role</Label>
                <Input
                  id="team_role"
                  value={newMember.team_role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, team_role: e.target.value })
                  }
                  placeholder="Technical Support"
                />
              </div>
              <Button
                variant="cyber"
                className="w-full"
                onClick={handleAddMember}
                disabled={isLoading2}
              >
                {isLoading2 ? "Creating..." : "Create Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Email Banner — shown after manual member create */}
      {showEmailBanner && emailDraft && (
        <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-950/30 backdrop-blur-xl p-4 space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-display font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Member Created — Email Draft Ready
                </h4>
                <p className="text-xs font-mono text-emerald-200/80 mt-1">
                  Welcome email for <span className="text-white font-bold">{emailDraft.candidateEmail}</span> — auto-filled and sent to your mail app. If it didn’t open, use the quick actions below.
                </p>
                <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-emerald-800/30 font-mono text-[11px] space-y-1">
                  <div className="flex flex-wrap gap-1"><span className="text-zinc-500">To:</span> <span className="text-white">{emailDraft.candidateEmail}</span></div>
                  <div className="flex flex-wrap gap-1"><span className="text-zinc-500">Subject:</span> <span className="text-white">{buildApprovalSubject(emailDraft)}</span></div>
                  <div className="flex items-center gap-2"><span className="text-zinc-500">Password:</span> <span className="text-amber-300 font-bold">{emailDraft.password}</span>
                    <button onClick={async () => { await navigator.clipboard.writeText(emailDraft.password); setCopiedPassword(true); setTimeout(()=>setCopiedPassword(false),2000); toast({title:"Password Copied"}); }} className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] flex items-center gap-1">
                      {copiedPassword ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copiedPassword ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setShowEmailBanner(false)} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="cyber" size="sm" onClick={() => { const m = buildMailtoLink(emailDraft); const w = window.open(m, "_blank"); if(!w) window.location.href=m; }} className="h-8 text-xs font-mono"><Mail className="w-3.5 h-3.5 mr-1.5" />Open Mail App</Button>
            <Button variant="outline" size="sm" onClick={() => window.open(buildGmailComposeUrl(emailDraft), "_blank")} className="h-8 text-xs font-mono bg-[#0a1020] border-zinc-700 hover:bg-zinc-800 text-zinc-200"><ExternalLink className="w-3.5 h-3.5 mr-1.5" />Open in Gmail</Button>
            <Button variant="outline" size="sm" onClick={() => window.open(buildOutlookComposeUrl(emailDraft), "_blank")} className="h-8 text-xs font-mono bg-[#0a1020] border-zinc-700 hover:bg-zinc-800 text-zinc-200"><ExternalLink className="w-3.5 h-3.5 mr-1.5" />Open in Outlook</Button>
            <Button variant="ghost" size="sm" onClick={async () => { await navigator.clipboard.writeText(buildApprovalBody(emailDraft)); setCopiedBody(true); setTimeout(()=>setCopiedBody(false),2000); toast({title:"Email Body Copied"}); }} className="h-8 text-xs font-mono text-zinc-400 hover:text-white">
              {copiedBody ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}{copiedBody ? "Body Copied!" : "Copy Email Body"}
            </Button>
          </div>
          <details className="group"><summary className="cursor-pointer text-[11px] font-mono text-zinc-400 hover:text-cyan-300 list-none flex items-center gap-1.5 mt-1"><span className="group-open:rotate-90 transition-transform">▶</span>Preview email body</summary><pre className="mt-2 p-3 rounded-lg bg-black/60 border border-zinc-800 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap max-h-64 overflow-auto">{buildApprovalBody(emailDraft)}</pre></details>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading members...</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-mono text-primary">
                    @{profile.username || "—"}
                  </TableCell>
                  <TableCell>{profile.full_name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMember(profile)}
                      disabled={isLoading2}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget({ userId: profile.user_id, username: profile.username || '' })}
                      disabled={isLoading2}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!profiles || profiles.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Editing{" "}
              <span className="font-mono text-primary">
                @{editTarget?.username || "member"}
              </span>
            </div>
            <div>
              <Label htmlFor="edit-role">Access Role</Label>
              <Select
                value={editData.role}
                onValueChange={(value: "admin" | "member") =>
                  setEditData({ ...editData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={editData.department}
                onChange={(e) =>
                  setEditData({ ...editData, department: e.target.value })
                }
                placeholder="CSE(Cyber Security)"
              />
            </div>
            <div>
              <Label htmlFor="edit-team-role">Team Role</Label>
              <Input
                id="edit-team-role"
                value={editData.team_role}
                onChange={(e) =>
                  setEditData({ ...editData, team_role: e.target.value })
                }
                placeholder="Technical Support"
              />
            </div>
            <Button
              variant="cyber"
              className="w-full"
              onClick={handleUpdateMember}
              disabled={isLoading2}
            >
              {isLoading2 ? "Updating..." : "Update Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-destructive">
              Delete Member
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete <span className="font-mono text-primary">@{deleteTarget?.username || 'this user'}</span>? 
              This action cannot be undone and will permanently remove the user and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-muted-foreground/30">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMember}
              disabled={isLoading2}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading2 ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CyberCard>
  );
}
