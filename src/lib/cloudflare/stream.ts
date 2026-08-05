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
