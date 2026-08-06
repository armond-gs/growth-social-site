import { createSign } from "crypto";

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getPrivateKeyPem(): string {
  const b64 = process.env.CLOUDFLARE_STREAM_KEY_PEM_B64;
  if (!b64) throw new Error("CLOUDFLARE_STREAM_KEY_PEM_B64 is not set");
  return Buffer.from(b64, "base64").toString("utf-8");
}

/**
 * Signs a short-lived playback token for a Cloudflare Stream video that has
 * `requireSignedURLs` enabled. Server-only — never call from client code,
 * the private key must never reach the browser.
 */
export function signStreamToken(videoUid: string, expiresInSeconds = 3600): string {
  const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID;
  if (!keyId) throw new Error("CLOUDFLARE_STREAM_KEY_ID is not set");

  const header = { alg: "RS256", kid: keyId };
  const payload = {
    sub: videoUid,
    kid: keyId,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(getPrivateKeyPem());

  return `${signingInput}.${base64url(signature)}`;
}

const THUMBNAIL_TTL_SECONDS = 60 * 60 * 6;
// Re-sign an hour before expiry so a cached URL is never handed out close
// enough to its deadline that a slow page load could outlive it.
const THUMBNAIL_REFRESH_MS = (THUMBNAIL_TTL_SECONDS - 60 * 60) * 1000;

const thumbnailCache = new Map<string, { url: string; signedAt: number }>();

/**
 * Builds a signed thumbnail URL (a still frame from the video) for a
 * Stream video that has `requireSignedURLs` enabled. Same rule as
 * playback: the token goes in the URL *path* in place of the video UID,
 * not as a query param. Longer-lived than a playback token since it's
 * just a JPEG, not the actual gated content.
 *
 * Memoized per-video: a thumbnail token carries no user identity and is
 * valid for hours, so re-signing one per card per request is pure waste —
 * a full 32-lesson curriculum costs ~31ms of blocking RSA otherwise.
 */
export function getThumbnailUrl(videoUid: string): string {
  const cached = thumbnailCache.get(videoUid);
  if (cached && Date.now() - cached.signedAt < THUMBNAIL_REFRESH_MS) return cached.url;

  const customerCode = process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE;
  if (!customerCode) throw new Error("NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE is not set");

  const token = signStreamToken(videoUid, THUMBNAIL_TTL_SECONDS);
  const url = `https://${customerCode}.cloudflarestream.com/${token}/thumbnails/thumbnail.jpg`;
  thumbnailCache.set(videoUid, { url, signedAt: Date.now() });
  return url;
}
