"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowingShadowProps {
  children: ReactNode;
  className?: string;
  /** Border radius for the card. Defaults to 1.75rem */
  radius?: string;
  /** Full animation cycle. Defaults to "8s" */
  speed?: string;
  /** Inner card surface color */
  surface?: string;
  /** Border thickness */
  border?: string;
  /** Inner content padding */
  padding?: string;
  /** Outer halo intensity. 0 = none, 1 = soft glow around the card. Default 0.35 */
  halo?: number;
}

export function GlowingShadow({
  children,
  className,
  radius = "1.75rem",
  speed = "8s",
  surface = "#13131a",
  border = "2px",
  padding = "0",
  halo = 0.35,
}: GlowingShadowProps) {
  const style = {
    "--gs-radius": radius,
    "--gs-speed": speed,
    "--gs-surface": surface,
    "--gs-border": border,
    "--gs-padding": padding,
    "--gs-halo": String(halo),
  } as CSSProperties;

  return (
    <>
      <style jsx>{`
        @property --hue {
          syntax: "<number>";
          inherits: true;
          initial-value: 16;
        }
        @property --bg-y {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --bg-x {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --bg-size {
          syntax: "<number>";
          inherits: true;
          initial-value: 1;
        }

        .gs-shell {
          --card-radius: var(--gs-radius);
          --border-width: var(--gs-border);
          --animation-speed: var(--gs-speed);
          --interaction-speed: 0.55s;
          --hue-offset: 16;
          --bg-size: 1;

          position: relative;
          z-index: 0;
          display: block;
          width: 100%;
          border-radius: var(--card-radius);
          isolation: isolate;
        }

        /* Soft outer halo — fully behind the card. Keeps the card surface
           untouched while letting a hint of color escape past the edges. */
        .gs-shell::after {
          content: "";
          position: absolute;
          inset: -1px;
          z-index: -2;
          border-radius: var(--card-radius);
          pointer-events: none;
          background: hsl(
            calc((var(--hue) + var(--hue-offset)) * 1deg) 95% 60%
          );
          filter: blur(28px);
          opacity: var(--gs-halo);
          transform: scale(1.02);
          transition: opacity var(--interaction-speed) ease,
            transform var(--interaction-speed) ease,
            filter var(--interaction-speed) ease;
          animation: gs-hue var(--animation-speed) linear infinite;
        }

        .gs-content {
          position: relative;
          z-index: 1;
          width: 100%;
          background: var(--gs-surface);
          border-radius: calc(var(--card-radius) - 2px);
          padding: var(--gs-padding);
          overflow: hidden;
        }

        /* The animated border ring — only visible in the 2px gap around
           the content, since it sits behind the opaque surface. */
        .gs-content::before {
          content: "";
          position: absolute;
          inset: calc(var(--border-width) * -1);
          z-index: -1;
          border-radius: var(--card-radius);
          background: #1c1c25
            radial-gradient(
              30% 30% at calc(var(--bg-x) * 1%) calc(var(--bg-y) * 1%),
              hsl(
                  calc((var(--hue) + var(--hue-offset)) * 1deg) 100% 88%
                )
                calc(0% * var(--bg-size)),
              hsl(
                  calc((var(--hue) + var(--hue-offset)) * 1deg) 100% 72%
                )
                calc(20% * var(--bg-size)),
              hsl(
                  calc((var(--hue) + var(--hue-offset)) * 1deg) 90% 56%
                )
                calc(40% * var(--bg-size)),
              transparent 100%
            );
          animation: gs-hue var(--animation-speed) linear infinite,
            gs-bg var(--animation-speed) linear infinite;
          transition: --bg-size var(--interaction-speed) ease;
        }

        /* Hover: only intensifies the BORDER spot — no inner halo, no
           card-wide pulse. The bright dot in the gradient grows slightly
           so the colored ring becomes more vivid at the corner currently
           being swept. */
        .gs-shell:hover .gs-content::before {
          --bg-size: 2.2;
          transition: --bg-size var(--interaction-speed) ease;
        }

        /* Halo nudges up a notch on hover — still only outside the card. */
        .gs-shell:hover::after {
          opacity: calc(var(--gs-halo) * 1.7);
          filter: blur(34px);
          transform: scale(1.05);
        }

        @keyframes gs-bg {
          0%   { --bg-x: 0;   --bg-y: 0;   }
          25%  { --bg-x: 100; --bg-y: 0;   }
          50%  { --bg-x: 100; --bg-y: 100; }
          75%  { --bg-x: 0;   --bg-y: 100; }
          100% { --bg-x: 0;   --bg-y: 0;   }
        }

        /* Brand-aligned hue range: ember (~16°) → tide (~216°) → ember.
           Bouncing keeps colors within the site palette. */
        @keyframes gs-hue {
          0%   { --hue: 0;   }
          50%  { --hue: 200; }
          100% { --hue: 360; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gs-content::before,
          .gs-shell::after {
            animation: none !important;
          }
        }
      `}</style>

      <div className={cn("gs-shell", className)} style={style}>
        <div className="gs-content">{children}</div>
      </div>
    </>
  );
}
