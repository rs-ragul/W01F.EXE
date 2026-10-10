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
function getLocalRequests(): JoinRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to save requests
function saveLocalRequests(requests: JoinRequest[]) {
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
        // Try querying Supabase join_requests table
        const { data, error } = await supabase
          .from("join_requests" as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          // Sync with local storage
          const local = getLocalRequests();
          // Merge unique requests
          const map = new Map<string, JoinRequest>();
          local.forEach((r) => map.set(r.id, r));
          (data as JoinRequest[]).forEach((r) => map.set(r.id, r));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          saveLocalRequests(merged);
          return merged;
        }
      } catch {
        // Fallback to local storage
      }

      return getLocalRequests();
    },
  });
}

export function useSubmitJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: Omit<JoinRequest, "id" | "status" | "created_at">
    ): Promise<JoinRequest> => {
      const newRequest: JoinRequest = {
        ...payload,
        id: crypto.randomUUID ? crypto.randomUUID() : `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // 1. Always persist to local cache immediately
      const current = getLocalRequests();
      const updated = [newRequest, ...current];
      saveLocalRequests(updated);

      // 2. Try inserting into Supabase join_requests if table exists
      try {
        await supabase.from("join_requests" as any).insert({
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
      } catch {
        // Ignore Supabase error if table doesn't exist yet
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
      // 1. Update local
      const current = getLocalRequests();
      const updated = current.map((r) => (r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r));
      saveLocalRequests(updated);

      // 2. Try updating Supabase
      try {
        await supabase
          .from("join_requests" as any)
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id);
      } catch {
        // Ignore
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

      // 2. Try deleting from Supabase
      try {
        await supabase.from("join_requests" as any).delete().eq("id", id);
      } catch {
        // Ignore
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join_requests"] });
    },
  });
}
