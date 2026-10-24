/**
 * approvalMail.ts — W0LF.EXE Recruitment: Auto-fill Welcome Email for Approved Candidates
 *
 * Generates a pre-filled email (mailto: + Gmail compose) after an admin
 * approves a join request / creates a member account.
 *
 * No breaking changes: pure utility, no side-effects on import.
 */

export interface ApprovalMailData {
  requestId: string;
  candidateName: string;
  candidateEmail: string;
  password: string;
  teamRole: string;
  department: string;
  loginUrl: string;
  // optional personalization — defaults to "W0LF.EXE Command"
  adminName?: string;
}

/**
 * Subject used for the approval email.
 * Includes the tactical Application ID so the candidate can reference it.
 */
export function buildApprovalSubject(data: Pick<ApprovalMailData, "requestId">): string {
  return `🎉 Welcome to W0LF.EXE — Application Approved | ID: ${data.requestId}`;
}

/**
 * Plain-text body for the approval email.
 * Uses CRLF line breaks and is intentionally plain-text so it works in
 * every mail client (Outlook, Gmail, Apple Mail, etc.).
 *
 * Contains:
 * - approval confirmation + Request ID + OFFICIAL MEMBER status
 * - login credentials (email + temporary password)
 * - login URL
 * - step-by-step guidance to change password via Dashboard → Edit Profile
 * - security best-practices
 */
export function buildApprovalBody(data: ApprovalMailData): string {
  const {
    requestId,
    candidateName,
    candidateEmail,
    password,
    teamRole,
    department,
    loginUrl,
    adminName,
  } = data;

  const safeName = candidateName?.trim() || "Operative";
  const safeRole = teamRole?.trim() || "Operative";
  const safeDept = department?.trim() || "W0LF.EXE";
  const fromName = adminName?.trim() || "W0LF.EXE Command";

  // Keep body concise but complete — mailto URLs have length limits (~2000 chars soft).
  // This template is ~1.1-1.4k chars typical.
  return [
    `Hi ${safeName},`,
    ``,
    `Great news — your application to join W0LF.EXE has been APPROVED!`,
    ``,
    `You are now an OFFICIAL MEMBER of the W0LF.EXE engineering & cybersecurity collective.`,
    ``,
    `────────────────────────────────────────`,
    `APPLICATION SUMMARY`,
    `────────────────────────────────────────`,
    `Request ID : ${requestId}`,
    `Status     : APPROVED ➜ OFFICIAL MEMBER`,
    `Name       : ${safeName}`,
    `Department : ${safeDept}`,
    `Team Role  : ${safeRole}`,
    ``,
    `────────────────────────────────────────`,
    `YOUR LOGIN CREDENTIALS`,
    `────────────────────────────────────────`,
    `Login Email : ${candidateEmail}`,
    `Temp Password : ${password}`,
    `Login URL   : ${loginUrl}`,
    ``,
    `⚠️  This is a temporary password. Please change it immediately after your first login.`,
    ``,
    `────────────────────────────────────────`,
    `HOW TO LOGIN & CHANGE YOUR PASSWORD`,
    `────────────────────────────────────────`,
    `1) Open the login page: ${loginUrl}`,
    `2) Sign in with the Email & Temporary Password above.`,
    `3) You will be redirected to your Operative Dashboard (/dashboard for members, /admin for admins).`,
    `4) Click “Edit Profile” (top of dashboard or profile card).`,
    `5) Scroll to “Change Password” → expand it.`,
    `6) Enter your new password + confirm it, then click “Update Password”.`,
    `7) You’re done! Use your new password for all future logins.`,
    ``,
    `If you ever forget your password, contact an admin to reset it — there is no self-service reset yet.`,
    ``,
    `────────────────────────────────────────`,
    `SECURITY TIPS`,
    `────────────────────────────────────────`,
    `• Change your password on first login — don't reuse this temporary one.`,
    `• Use 12+ characters with letters, numbers & symbols.`,
    `• Never share your password in chats/screenshots.`,
    `• Your dashboard lets you manage projects, achievements & profile.`,
    ``,
    `────────────────────────────────────────`,
    `WHAT'S NEXT?`,
    `────────────────────────────────────────`,
    `• Log in and complete your profile (bio, avatar, GitHub/LinkedIn).`,
    `• Explore team projects & achievements on w0lf.exe.`,
    `• Watch for invites to labs, CTFs, and hackathons on your team channel.`,
    ``,
    `We're thrilled to have you in the pack, ${safeName}. Let's build, break, and ship. 🐺⚡`,
    ``,
    `Welcome aboard,`,
    `${fromName}`,
    `W0LF.EXE — PSNACET | CSE (Cyber Security)`,
    `────────────────────────────────────────`,
    `This is an automated onboarding email after your approval (Request ID: ${requestId}). Reply to this email if you need help.`,
  ].join("\r\n");
}

/**
 * Build a `mailto:` URL with pre-filled To, Subject, Body.
 * Opens the user's default mail client (Outlook, Gmail desktop, Apple Mail, etc.)
 */
export function buildMailtoLink(data: ApprovalMailData): string {
  const to = data.candidateEmail.trim();
  const subject = buildApprovalSubject(data);
  const body = buildApprovalBody(data);
  // encode To separately so + and @ are safe, though most clients accept raw
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Build a Gmail web-compose URL (opens Gmail in browser).
 * Useful as a fallback when mailto is blocked or user prefers Gmail web.
 */
export function buildGmailComposeUrl(data: ApprovalMailData): string {
  const to = data.candidateEmail.trim();
  const subject = buildApprovalSubject(data);
  const body = buildApprovalBody(data);
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Build an Outlook web-compose URL (outlook.live.com / Microsoft 365)
 */
export function buildOutlookComposeUrl(data: ApprovalMailData): string {
  const to = data.candidateEmail.trim();
  const subject = buildApprovalSubject(data);
  const body = buildApprovalBody(data);
  const params = new URLSearchParams({
    to,
    subject,
    body,
  });
  // Outlook web uses compose path
  return `https://outlook.live.com/mail/0/deeplink/compose?${params.toString()}`;
}

/**
 * Trigger the approval email: tries mailto, falls back hint is handled by caller.
 * Safe to call in a click handler — uses window.open with _blank first to avoid popup block,
 * then falls back to window.location.href if blocked.
 */
export function openApprovalEmail(data: ApprovalMailData, opts?: { prefer?: "mailto" | "gmail" | "outlook" }): void {
  if (typeof window === "undefined") return;

  const prefer = opts?.prefer || "mailto";

  let url: string;
  if (prefer === "gmail") url = buildGmailComposeUrl(data);
  else if (prefer === "outlook") url = buildOutlookComposeUrl(data);
  else url = buildMailtoLink(data);

  // Try to open without navigating away from admin dashboard
  // Using window.open in a user-triggered event is usually allowed
  const win = window.open(url, "_blank");

  // If popup was blocked (win is null), fallback to href navigation
  // For mailto: this launches the OS mail client; for https: navigates
  if (!win) {
    window.location.href = url;
  }
}

/**
 * Helper: get login URL dynamically (works in dev, staging, production)
 */
export function getLoginUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/auth`;
  }
  return "https://w0lf-exe.vercel.app/auth";
}

/**
 * Quick data builder from onboarding state + selectedApp
 */
export function createApprovalMailData(params: {
  requestId: string;
  candidateName: string;
  candidateEmail: string;
  password: string;
  teamRole: string;
  department: string;
  loginUrl?: string;
  adminName?: string;
}): ApprovalMailData {
  return {
    requestId: params.requestId,
    candidateName: params.candidateName,
    candidateEmail: params.candidateEmail,
    password: params.password,
    teamRole: params.teamRole,
    department: params.department,
    loginUrl: params.loginUrl || getLoginUrl(),
    adminName: params.adminName,
  };
}
