import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Growth Social — Creator-focused. Outcome-obsessed. Against the grain.";

export default function OpengraphImage() {
  const logo = readFileSync(join(process.cwd(), "public/logo-green.png")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F1F1E7",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={`data:image/png;base64,${logo}`} width={40} height={42} alt="" />
          <span style={{ fontSize: 28, fontWeight: 700, color: "#111110" }}>Growth Social</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(17,17,16,0.5)",
              marginBottom: 20,
            }}
          >
            UGC Agency — Est. 2026
          </span>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: "#111110" }}>
            <span>Creator-focused.</span>
            <span style={{ fontFamily: "serif", fontStyle: "italic", fontWeight: 500 }}>
              Outcome-obsessed.
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
