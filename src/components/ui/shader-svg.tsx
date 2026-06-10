"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Mesh gradient palette. Defaults to site brand palette. */
  colors?: string[];
  /** Gradient animation speed */
  speed?: number;
  /** Eye fill color (CSS color or var) */
  eyeColor?: string;
  /** Idle bobbing motion */
  bob?: boolean;
};

const DEFAULT_COLORS = [
  "#F5DCC1", // warm cream highlight
  "#FF8A63", // ember soft
  "#FF6B3D", // ember
  "#5B8DEF", // tide
  "#15151c", // ink shadow
];

export function MeshGradientSVG({
  className,
  colors = DEFAULT_COLORS,
  speed = 0.9,
  eyeColor = "#0a0a0c",
  bob = true,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const clipId = useId();

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.06;
      const dy = (e.clientY - cy) * 0.06;
      const max = 9;
      setEyeOffset({
        x: Math.max(-max, Math.min(max, dx)),
        y: Math.max(-max, Math.min(max, dy)),
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <motion.div
      className={cn("relative", className)}
      animate={
        bob
          ? {
              y: [0, -6, 0],
              scaleY: [1, 1.06, 1],
              rotate: [-1.5, 1.5, -1.5],
            }
          : undefined
      }
      transition={{
        duration: 3.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      style={{ transformOrigin: "top center" }}
    >
      {/* Soft drop shadow behind the ghost */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 70%, rgba(255,107,61,0.35) 0%, rgba(91,141,239,0.18) 40%, transparent 70%)",
        }}
      />

      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="231"
        height="289"
        viewBox="0 0 231 289"
        className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M230.809 115.385V249.411C230.809 269.923 214.985 287.282 194.495 288.411C184.544 288.949 175.364 285.718 168.26 280C159.746 273.154 147.769 273.461 139.178 280.23C132.638 285.384 124.381 288.462 115.379 288.462C106.377 288.462 98.1451 285.384 91.6055 280.23C82.912 273.385 70.9353 273.385 62.2415 280.23C55.7532 285.334 47.598 288.411 38.7246 288.462C17.4132 288.615 0 270.667 0 249.359V115.385C0 51.6667 51.6756 0 115.404 0C179.134 0 230.809 51.6667 230.809 115.385Z" />
          </clipPath>
        </defs>

        <foreignObject
          width="231"
          height="289"
          clipPath={`url(#${clipId})`}
        >
          <div className="h-full w-full">
            <MeshGradient
              colors={colors}
              className="h-full w-full"
              speed={speed}
            />
          </div>
        </foreignObject>

        {/* Inner highlight ring */}
        <path
          d="M230.809 115.385V249.411C230.809 269.923 214.985 287.282 194.495 288.411C184.544 288.949 175.364 285.718 168.26 280C159.746 273.154 147.769 273.461 139.178 280.23C132.638 285.384 124.381 288.462 115.379 288.462C106.377 288.462 98.1451 285.384 91.6055 280.23C82.912 273.385 70.9353 273.385 62.2415 280.23C55.7532 285.334 47.598 288.411 38.7246 288.462C17.4132 288.615 0 270.667 0 249.359V115.385C0 51.6667 51.6756 0 115.404 0C179.134 0 230.809 51.6667 230.809 115.385Z"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />

        <motion.ellipse
          rx="20"
          ry="30"
          fill={eyeColor}
          className="ghost-eye"
          initial={{ cx: 80, cy: 120 }}
          animate={{
            cx: 80 + eyeOffset.x,
            cy: 120 + eyeOffset.y,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
        <motion.ellipse
          rx="20"
          ry="30"
          fill={eyeColor}
          className="ghost-eye"
          initial={{ cx: 150, cy: 120 }}
          animate={{
            cx: 150 + eyeOffset.x,
            cy: 120 + eyeOffset.y,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />

        {/* Tiny eye highlight */}
        <motion.circle
          r="3"
          fill="rgba(255,255,255,0.85)"
          initial={{ cx: 87, cy: 110 }}
          animate={{ cx: 87 + eyeOffset.x, cy: 110 + eyeOffset.y }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
        <motion.circle
          r="3"
          fill="rgba(255,255,255,0.85)"
          initial={{ cx: 157, cy: 110 }}
          animate={{ cx: 157 + eyeOffset.x, cy: 110 + eyeOffset.y }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      </svg>
    </motion.div>
  );
}
