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

function isSupabaseConfigured(): boolean {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const key = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  return !!url && !!key && !url.includes("your_supabase") && url.startsWith("http");
}

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
      if (!isSupabaseConfigured()) {
        return getLocalRequests();
      }
      try {
        const { data, error } = await supabase
          .from("join_requests" as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
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
          console.warn("[join_requests] Supabase fetch failed:", error.message, error);
        }
      } catch (e) {
        console.warn("[join_requests] Supabase exception:", e);
      }
      return getLocalRequests();
    },
  });
}

// Search/track a specific application by ID or Email — WORKS CROSS-DEVICE when Supabase configured
export async function trackApplicationByIdOrEmail(queryStr: string): Promise<JoinRequest | null> {
  const trimmedRaw = queryStr.trim();
  if (!trimmedRaw) return null;

  // 1) Check URL payload first (for shared offline links: ?track=ID&p=BASE64)
  try {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const payload = urlParams.get("p");
      if (payload) {
        // Lazy import to avoid circular dep
        const { decodeTrackingPayload } = await import("@/lib/trackingPayload");
        const decoded = decodeTrackingPayload(payload);
        if (decoded && (decoded.id.toLowerCase() === trimmedRaw.toLowerCase() || decoded.email.toLowerCase() === trimmedRaw.toLowerCase())) {
          // Also seed local cache
          const local = getLocalRequests();
          if (!local.find((r) => r.id === decoded.id)) saveLocalRequests([decoded, ...local]);
          return decoded;
        }
      }
    }
  } catch {}

  // 2) Query Supabase for cross-device (primary path)
  if (isSupabaseConfigured()) {
    try {
      const isEmail = trimmedRaw.includes("@");
      let data: any[] | null = null;
      let error: any = null;

      if (isEmail) {
        const res = await supabase.from("join_requests" as any).select("*").ilike("email", trimmedRaw).limit(1);
        data = res.data; error = res.error;
      } else {
        const res = await supabase.from("join_requests" as any).select("*").ilike("id", trimmedRaw).limit(1);
        data = res.data; error = res.error;
        if ((!error && (!data || data.length === 0)) && trimmedRaw.length >= 4) {
          const partial = await supabase.from("join_requests" as any).select("*").ilike("id", `${trimmedRaw}%`).limit(5);
          if (!partial.error && partial.data && partial.data.length > 0) {
            data = partial.data; error = partial.error;
          }
        }
      }

      if (!error && data && data.length > 0) {
        const match = data[0] as JoinRequest;
        const local = getLocalRequests();
        const existing = local.filter((r) => r.id !== match.id);
        saveLocalRequests([match, ...existing]);
        return match;
      }
      if (error) console.warn("[track] Supabase query error:", error.message || error);
    } catch (e) {
      console.warn("[track] Supabase exception:", e);
    }
  } else {
    console.warn("[track] Supabase not configured — falling back to local cache. Set VITE_SUPABASE_URL/KEY for cross-device sync.");
  }

  // 3) Fallback to local cache (same-browser offline)
  const local = getLocalRequests();
  const lower = trimmedRaw.toLowerCase();
  const localMatch = local.find(
    (r) => r.id.toLowerCase() === lower || r.id.toLowerCase().startsWith(lower) || r.email.toLowerCase() === lower
  );
  return localMatch || null;
}

export function useSubmitJoinRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<JoinRequest, "id" | "status" | "created_at">): Promise<JoinRequest> => {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newRequest: JoinRequest = {
        ...payload,
        id: `W0LF-2026-${randomSuffix}`,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      const current = getLocalRequests();
      saveLocalRequests([newRequest, ...current]);

      if (isSupabaseConfigured()) {
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
            console.warn("[submit] Supabase insert failed — tracking will be local-only until DB configured:", error.message, error);
          } else {
            console.log("[submit] Supabase insert ok:", newRequest.id);
          }
        } catch (e) {
          console.warn("[submit] Supabase insert exception:", e);
        }
      } else {
        console.warn("[submit] Supabase not configured — join request saved locally only. Set VITE_SUPABASE_URL in Vercel env for cross-device tracking.");
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
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" }) => {
      const current = getLocalRequests();
      saveLocalRequests(current.map((r) => (r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r)));
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase.from("join_requests" as any).update({ status, updated_at: new Date().toISOString() }).eq("id", id);
          if (error) console.warn("[updateStatus] Supabase update failed:", error.message);
        } catch (e) {
          console.warn("[updateStatus] Supabase exception:", e);
        }
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
      const current = getLocalRequests();
      saveLocalRequests(current.filter((r) => r.id !== id));
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase.from("join_requests" as any).delete().eq("id", id);
          if (error) console.warn("[delete] Supabase delete failed:", error.message);
        } catch (e) {
          console.warn("[delete] Supabase exception:", e);
        }
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join_requests"] });
    },
  });
}
