import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Exposed — See What Websites Know About You";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
          backgroundColor: "#0a0a12",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Red recording dot */}
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: "#e81818",
            marginBottom: 32,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#e8e8ec",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Exposed
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#8888a0",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          See everything a website learns about you from a single page load.
        </div>

        {/* Category badges */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 48,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
          }}
        >
          {[
            "IP & Location",
            "Browser",
            "Hardware",
            "Canvas",
            "WebGL",
            "Audio",
            "Fonts",
            "Timezone",
            "Storage",
            "Permissions",
            "Media",
            "Behavior",
          ].map((cat) => (
            <div
              key={cat}
              style={{
                fontSize: 14,
                color: "#66667a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 4,
                padding: "6px 14px",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 14,
            color: "#44445a",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          No data stored — everything runs in your browser
        </div>
      </div>
    ),
    { ...size }
  );
}
