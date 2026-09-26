import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BRAND } from "@/lib/brandColors";

export const alt = "VANIKARA — Building What Comes Next";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const symbol = await readFile(join(process.cwd(), "public/brand/vanikara-symbol.png"));
  const symbolSrc = `data:image/png;base64,${symbol.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: BRAND.black,
          backgroundImage:
            "radial-gradient(circle at 78% 30%, rgba(0,110,255,0.35), transparent 45%), radial-gradient(circle at 62% 70%, rgba(244,81,30,0.22), transparent 40%)",
          color: BRAND.offWhite,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={symbolSrc} width={64} height={52} alt="" />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4 }}>VANIKARA</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
              Building what comes next.
            </div>
            <div style={{ marginTop: 28, fontSize: 26, color: "#A7B3C8", lineHeight: 1.4 }}>
              A student-founded technology company from Guntur, India.
            </div>
          </div>
          <img src={symbolSrc} width={380} height={310} alt="" style={{ marginRight: -20, marginBottom: 10 }} />
        </div>
      </div>
    ),
    size
  );
}
