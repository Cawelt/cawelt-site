import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const champagne = "#d8cba6";
  const ink = "#0a0a0c";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: ink,
          backgroundImage: `radial-gradient(900px 500px at 80% -10%, rgba(216,203,166,0.22), transparent 60%), radial-gradient(700px 500px at 0% 120%, rgba(216,203,166,0.12), transparent 60%)`,
          color: "#f5f5f3",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row — wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: "#f5f5f3",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: champagne,
            }}
          >
            {site.suffix}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "1000px",
          }}
        >
          <span>Tasarım odaklı&nbsp;</span>
          <span style={{ color: champagne }}>yazılım stüdyosu.</span>
        </div>

        {/* Bottom row — disciplines + url */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(245,245,243,0.15)",
            paddingTop: "32px",
            fontSize: 28,
          }}
        >
          <div style={{ display: "flex", color: "#d6d6d0" }}>
            Web · Mobil · Panel + API
          </div>
          <div style={{ display: "flex", color: champagne, fontWeight: 600 }}>
            cawelt.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
