"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MeshGradientSVG } from "@/components/ui/shader-svg";

type Pose = {
  /** % from left (0-100) */
  x: number;
  /** % from top (0-100) */
  y: number;
  /** rotation deg */
  r: number;
  /** scale */
  s: number;
  /** width in px */
  w: number;
};

const POSES: Record<string, Pose> = {
  "/": { x: 88, y: 18, r: -8, s: 1, w: 150 },
  "/hizmetler": { x: 8, y: 22, r: 6, s: 0.95, w: 140 },
  "/calismalar": { x: 92, y: 70, r: -10, s: 1.05, w: 160 },
  "/surec": { x: 6, y: 78, r: 8, s: 1, w: 150 },
  "/hakkimizda": { x: 90, y: 12, r: -4, s: 0.9, w: 130 },
  "/iletisim": { x: 10, y: 14, r: 5, s: 1.1, w: 165 },
  "/oyun": { x: 6, y: 30, r: 8, s: 0.78, w: 110 },
};

const FALLBACK: Pose = { x: 88, y: 78, r: -6, s: 1, w: 150 };

export default function GhostMascot() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const pose = POSES[pathname] ?? FALLBACK;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-30 hidden lg:block"
      initial={false}
      animate={{
        left: `${pose.x}%`,
        top: `${pose.y}%`,
        rotate: pose.r,
        scale: mounted ? pose.s : 0.6,
        opacity: mounted ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 14,
        mass: 1.1,
        opacity: { duration: 0.6 },
      }}
      style={{
        width: pose.w,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Floating "trail" — small particles that appear during route flight */}
      <motion.span
        key={pathname + "-trail"}
        initial={{ opacity: 0.7, scale: 0.4 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -z-10 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,61,0.5), transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      <MeshGradientSVG />
    </motion.div>
  );
}
