import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(120px 120px at 50% 0%, rgba(216,203,166,0.25), transparent 70%)",
          color: "#d8cba6",
          fontSize: 92,
          fontWeight: 600,
          letterSpacing: "-4px",
          fontFamily: "serif",
        }}
      >
        CW
      </div>
    ),
    { ...size },
  );
}
