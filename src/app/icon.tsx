import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const logo = readFileSync(join(process.cwd(), "public/logo-green.png")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F1F1E7",
          borderRadius: 6,
        }}
      >
        <img src={`data:image/png;base64,${logo}`} width={22} height={23} alt="" />
      </div>
    ),
    size,
  );
}
