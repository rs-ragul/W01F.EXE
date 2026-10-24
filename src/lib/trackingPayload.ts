/**
 * trackingPayload.ts — allow cross-device tracking even without Supabase
 * Encodes a JoinRequest into a shareable URL param as fallback.
 * Uses base64 with URI-safe encoding.
 */

import type { JoinRequest } from "@/hooks/useJoinRequests";

export function encodeTrackingPayload(req: JoinRequest): string {
  try {
    const json = JSON.stringify(req);
    // handle unicode: encode then btoa
    return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
  } catch {
    return "";
  }
}

export function decodeTrackingPayload(payload: string): JoinRequest | null {
  try {
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const obj = JSON.parse(json);
    if (obj && obj.id && obj.email && obj.full_name) return obj as JoinRequest;
    return null;
  } catch {
    return null;
  }
}

export function buildTrackingUrl(id: string, req?: JoinRequest): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (req) {
    const payload = encodeTrackingPayload(req);
    return `${origin}/join?track=${encodeURIComponent(id)}&p=${encodeURIComponent(payload)}`;
  }
  return `${origin}/join?track=${encodeURIComponent(id)}`;
}
