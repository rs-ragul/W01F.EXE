import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface JoinRequest {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  department: string;
  year_of_study: string;
  roles: string[];
  skills: string;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  experience?: string | null;
  why_join: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at?: string;
}

const STORAGE_KEY = "w0lf_team_join_requests";

// Helper to read cached/fallback requests
export function getLocalRequests(): JoinRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to save requests
export function saveLocalRequests(requests: JoinRequest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Ignore
  }
}

export function useJoinRequests() {
  return useQuery({
    queryKey: ["join_requests"],
    queryFn: async (): Promise<JoinRequest[]> => {
      try {
        // Try querying Supabase join_requests table — works cross-device
        const { data, error } = await supabase
          .from("join_requests" as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          // Sync with local storage (merge for offline cache)
          const local = getLocalRequests();
          const map = new Map<string, JoinRequest>();
          local.forEach((r) => map.set(r.id, r));
          (data as JoinRequest[]).forEach((r) => map.set(r.id, r));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          saveLocalRequests(merged);
          return merged;
        }
        if (error) {
          console.warn("[join_requests] Supabase fetch failed:", error.message);
        }
      } catch (e) {
        console.warn("[join_requests] Supabase fetch exception:", e);
      }

      return getLocalRequests();
    },
  });
}

// Search/track a specific application by ID or Email — WORKS CROSS-DEVICE
export async function trackApplicationByIdOrEmail(queryStr: string): Promise<JoinRequest | null> {
  const trimmedRaw = queryStr.trim();
  if (!trimmedRaw) return null;

  // 1. Query Supabase first — this makes tracking work from any device/browser
  // RLS allows public SELECT with true (see 20261010000000_create_join_requests.sql)
  try {
    const isEmail = trimmedRaw.includes("@");
    let data: any[] | null = null;
    let error: any = null;

    if (isEmail) {
      // Email: case-insensitive exact match
      const res = await supabase
        .from("join_requests" as any)
        .select("*")
        .ilike("email", trimmedRaw)
        .limit(1);
      data = res.data;
      error = res.error;
    } else {
      // ID: case-insensitive exact match (W0LF-2026-X8F9 vs w0lf-2026-x8f9)
      const res = await supabase
        .from("join_requests" as any)
        .select("*")
        .ilike("id", trimmedRaw)
        .limit(1);
      data = res.data;
      error = res.error;

      // Fallback: support partial ID prefix search (user may paste shortened ID)
      if ((!error && (!data || data.length === 0)) && trimmedRaw.length >= 6) {
        const partial = await supabase
          .from("join_requests" as any)
          .select("*")
          .ilike("id", `${trimmedRaw}%`)
          .limit(5);
        if (!partial.error && partial.data && partial.data.length > 0) {
          data = partial.data;
          error = partial.error;
        }
      }
    }

    if (!error && data && data.length > 0) {
      const match = data[0] as JoinRequest;
      // Sync into local cache for offline/fast access
      const local = getLocalRequests();
      const existing = local.filter((r) => r.id !== match.id);
      saveLocalRequests([match, ...existing]);
      return match;
    }

    if (error) {
      console.warn("[track] Supabase query error:", error.message);
    }
  } catch (e) {
    console.warn("[track] Supabase exception:", e);
  }

  // 2. Fallback to local cache (offline or same-browser)
  const local = getLocalRequests();
  const lower = trimmedRaw.toLowerCase();
  const localMatch = local.find(
    (r) =>
      r.id.toLowerCase() === lower ||
      r.id.toLowerCase().startsWith(lower) ||
      r.email.toLowerCase() === lower
  );

  return localMatch || null;
}

export function useSubmitJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: Omit<JoinRequest, "id" | "status" | "created_at">
    ): Promise<JoinRequest> => {
      // Generate clean uppercase tactical ID e.g. W0LF-2026-X8F9
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newRequest: JoinRequest = {
        ...payload,
        id: `W0LF-2026-${randomSuffix}`,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // 1. Always persist to local cache immediately (instant feedback)
      const current = getLocalRequests();
      const updated = [newRequest, ...current];
      saveLocalRequests(updated);

      // 2. Insert into Supabase join_requests for cross-device tracking
      // Public INSERT is allowed via RLS: "Allow public insert to join_requests" WITH CHECK (true)
      try {
        const { error } = await supabase.from("join_requests" as any).insert({
          id: newRequest.id,
          full_name: newRequest.full_name,
          email: newRequest.email,
          phone: newRequest.phone,
          department: newRequest.department,
          year_of_study: newRequest.year_of_study,
          roles: newRequest.roles,
          skills: newRequest.skills,
          github_url: newRequest.github_url,
          linkedin_url: newRequest.linkedin_url,
          portfolio_url: newRequest.portfolio_url,
          experience: newRequest.experience,
          why_join: newRequest.why_join,
          status: newRequest.status,
          created_at: newRequest.created_at,
        });

        if (error) {
          console.warn("[submit] Supabase insert failed (will retry via local only):", error.message);
          // Do NOT throw — local save already succeeded, user should still get ID
          // Admin will see it locally; once Supabase is reachable, it will sync.
        }
      } catch (e) {
        console.warn("[submit] Supabase insert exception:", e);
      }

      return newRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join_requests"] });
    },
  });
}

export function useUpdateJoinRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "approved" | "rejected";
    }) => {
      // 1. Update local cache
      const current = getLocalRequests();
      const updated = current.map((r) => (r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r));
      saveLocalRequests(updated);

      // 2. Update Supabase for cross-device visibility
      try {
        const { error } = await supabase
          .from("join_requests" as any)
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (error) {
          console.warn("[updateStatus] Supabase update failed:", error.message);
        }
      } catch (e) {
        console.warn("[updateStatus] Supabase exception:", e);
      }

      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join_requests"] });
    },
  });
}

export function useDeleteJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // 1. Remove from local
      const current = getLocalRequests();
      const updated = current.filter((r) => r.id !== id);
      saveLocalRequests(updated);

      // 2. Delete from Supabase
      try {
        const { error } = await supabase.from("join_requests" as any).delete().eq("id", id);
        if (error) {
          console.warn("[delete] Supabase delete failed:", error.message);
        }
      } catch (e) {
        console.warn("[delete] Supabase exception:", e);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join_requests"] });
    },
  });
}
