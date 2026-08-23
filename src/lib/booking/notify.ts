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

async function sendEmail(request: BookingRequest, times: Times): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_TO;
  // Resend only allows arbitrary from-addresses on a verified domain; until
  // growthsocialhq.com is verified, its own onboarding sender works.
  const from = process.env.BOOKING_NOTIFY_FROM || "Growth Social <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("[booking] email skipped — RESEND_API_KEY or BOOKING_NOTIFY_TO not set");
    return;
  }

  const { agencyTime, guestTime, guestZone } = times;

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
      console.error("[booking] email failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[booking] email threw", err);
  }
}


/** Slack's mrkdwn treats these three as control characters. */
function escapeSlack(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendSlack(request: BookingRequest, times: Times): Promise<void> {
  const webhook = process.env.SLACK_BOOKING_WEBHOOK_URL;
  if (!webhook) return; // Slack is optional; email alone is a valid setup.

  const { agencyTime, guestTime, guestZone } = times;

  const lines = [
    `*When:* ${escapeSlack(agencyTime)} (${SLOT_DURATION_MINUTES} min)`,
    guestTime ? `*Their time:* ${escapeSlack(guestTime)} — ${escapeSlack(guestZone.replace(/_/g, " "))}` : null,
    `*Email:* <mailto:${escapeSlack(request.email)}|${escapeSlack(request.email)}>`,
    request.brand ? `*Brand:* ${escapeSlack(request.brand)}` : null,
    request.website ? `*Website:* ${escapeSlack(request.website)}` : null,
    request.budgetRange ? `*Budget:* ${escapeSlack(request.budgetRange)}` : null,
    request.details ? `*Looking for:* ${escapeSlack(request.details)}` : null,
  ].filter(Boolean);

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // `text` is the notification/fallback line; blocks render in-channel.
        text: `New booking — ${request.name}${request.brand ? ` (${request.brand})` : ""}, ${agencyTime}`,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: `New booking — ${request.name}`.slice(0, 150) },
          },
          { type: "section", text: { type: "mrkdwn", text: lines.join("\n") } },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[booking] slack failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[booking] slack threw", err);
  }
}

type Times = { agencyTime: string; guestTime: string | null; guestZone: string };

/**
 * Fans out to every configured channel. Each sender swallows its own
 * failures, and allSettled means a broken Slack webhook can't stop the email
 * (or vice versa) — and neither can fail the booking that already saved.
 */
export async function notifyBooking(request: BookingRequest): Promise<void> {
  const guestZone = request.guestTimezone || "UTC";
  const times: Times = {
    agencyTime: formatIn(request.startsAt, AGENCY_TIMEZONE),
    // Their local time matters as much as ours — it's what they'll turn up at.
    guestTime: guestZone === AGENCY_TIMEZONE ? null : formatIn(request.startsAt, guestZone),
    guestZone,
  };

  await Promise.allSettled([sendEmail(request, times), sendSlack(request, times)]);
}
