"use client";

import { useEffect, useRef, useState } from "react";
import { LightboxShell } from "@/components/ui/LightboxShell";
import { getSignedStreamToken } from "@/lib/cloudflare/actions";

const CUSTOMER_CODE = process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE;
const STREAM_SDK_SRC = "https://embed.cloudflarestream.com/embed/sdk.latest.js";

type StreamPlayerInstance = {
  addEventListener: (event: string, handler: () => void) => void;
};

declare global {
  interface Window {
    Stream?: (el: HTMLIFrameElement) => StreamPlayerInstance;
  }
}

let sdkLoadPromise: Promise<void> | null = null;

function loadStreamSdk(): Promise<void> {
  if (typeof window !== "undefined" && window.Stream) return Promise.resolve();
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = STREAM_SDK_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cloudflare Stream SDK"));
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

// Keyed by videoUid at the call site below, so switching videos remounts
// this fresh (clean token/error state) instead of needing manual resets.
function StreamPlayer({ videoUid, onEnded }: { videoUid: string; onEnded?: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Latest-callback ref so the SDK-attach effect below only needs to run
  // once per token (not every time the caller passes a new onEnded closure).
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    let cancelled = false;
    getSignedStreamToken(videoUid).then((t) => {
      if (cancelled) return;
      if (!t) setError("You need to be logged in to watch this.");
      else setToken(t);
    });
    return () => {
      cancelled = true;
    };
  }, [videoUid]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    loadStreamSdk().then(() => {
      if (cancelled || !iframeRef.current || !window.Stream) return;
      const player = window.Stream(iframeRef.current);
      player.addEventListener("ended", () => onEndedRef.current?.());
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-cream">{error}</div>
    );
  }
  if (!token) {
    return <div className="flex h-full items-center justify-center text-cream/60">Loading…</div>;
  }
  return (
    <iframe
      ref={iframeRef}
      src={`https://${CUSTOMER_CODE}.cloudflarestream.com/${token}/iframe?autoplay=true`}
      className="h-full w-full"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
      allowFullScreen
    />
  );
}

export function StreamLightbox({
  videoUid,
  onClose,
  onEnded,
}: {
  videoUid: string | null;
  onClose: () => void;
  onEnded?: () => void;
}) {
  return (
    <LightboxShell open={!!videoUid} onClose={onClose}>
      <div className="aspect-video w-[92vw] max-w-[960px] overflow-hidden rounded-2xl bg-black">
        {videoUid && <StreamPlayer key={videoUid} videoUid={videoUid} onEnded={onEnded} />}
      </div>
    </LightboxShell>
  );
}
