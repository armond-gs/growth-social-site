import { AGENCY_TIMEZONE, SLOT_DURATION_MINUTES } from "@/lib/booking/config";
import type { BookingRequest } from "@/lib/supabase/booking-actions";

/**
 * Emails the team when someone books a call.
 *
 * Deliberately never throws. A booking that made it into the database is a
 * real booking — if the notification fails (Resend down, bad key, quota) the
 * prospect must still see their confirmation. Failures are logged server-side
 * instead, where they show up in the Vercel logs.
 *
 * Uses Resend's REST API directly rather than the SDK: it's one POST, and it
 * keeps a dependency out of the bundle.
 *
 * Server-only by construction — its single caller is the "use server"
 * createBooking action, and RESEND_API_KEY has no NEXT_PUBLIC_ prefix so Next
 * never inlines it into the client bundle. Don't import this from a component.
 */

function formatIn(startsAt: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(startsAt));
}

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#666;font:13px -apple-system,sans-serif;vertical-align:top;white-space:nowrap">${label}</td>
    <td style="padding:6px 0;color:#111;font:14px -apple-system,sans-serif">${escapeHtml(value)}</td>
  </tr>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyBooking(request: BookingRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_TO;
  // Resend only allows arbitrary from-addresses on a verified domain; until
  // growthsocialhq.com is verified, its own onboarding sender works.
  const from = process.env.BOOKING_NOTIFY_FROM || "Growth Social <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("[booking] notification skipped — RESEND_API_KEY or BOOKING_NOTIFY_TO not set");
    return;
  }

  const agencyTime = formatIn(request.startsAt, AGENCY_TIMEZONE);
  const guestZone = request.guestTimezone || "UTC";
  // Their local time matters as much as ours — it's what they'll turn up at.
  const guestTime = guestZone === AGENCY_TIMEZONE ? null : formatIn(request.startsAt, guestZone);

  const html = `
    <div style="max-width:520px;font:14px -apple-system,sans-serif;color:#111">
      <p style="margin:0 0 4px;font-size:13px;color:#666">New booking</p>
      <h2 style="margin:0 0 18px;font-size:20px">${escapeHtml(request.name)} booked a call</h2>
      <table style="border-collapse:collapse">
        ${row("When", `${agencyTime} (${SLOT_DURATION_MINUTES} min)`)}
        ${guestTime ? row("Their time", `${guestTime} — ${guestZone.replace(/_/g, " ")}`) : ""}
        ${row("Email", request.email)}
        ${row("Brand", request.brand)}
        ${row("Website", request.website)}
        ${row("Budget", request.budgetRange)}
        ${row("Looking for", request.details)}
      </table>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((a) => a.trim()),
        // Replying goes straight to the prospect rather than to the sender.
        reply_to: request.email,
        subject: `New booking — ${request.name}${request.brand ? ` (${request.brand})` : ""}, ${agencyTime}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[booking] notification failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[booking] notification threw", err);
  }
}
