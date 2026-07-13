import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Growth Social — UGC, done differently.";

export default function OpengraphImage() {
  const logo = readFileSync(join(process.cwd(), "public/logo-cream.png")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#143828",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(241,241,231,0.5)",
            marginBottom: 28,
          }}
        >
          UGC Agency — Est. 2026
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={`data:image/png;base64,${logo}`} width={64} height={68} alt="" />
          <span style={{ fontSize: 60, fontWeight: 800, color: "#F1F1E7", letterSpacing: -1 }}>
            Growth Social
          </span>
        </div>

        <span
          style={{
            fontFamily: "serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 34,
            color: "rgba(241,241,231,0.85)",
            marginTop: 28,
          }}
        >
          UGC, done differently.
        </span>
      </div>
    ),
    size,
  );
}
