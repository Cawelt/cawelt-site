"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/lib/useFinePointer";
import type { Accent3DVariant } from "./Accent3DScene";

// three.js is only fetched when an accent actually needs to render.
const Accent3DScene = dynamic(() => import("./Accent3DScene"), { ssr: false });

export default function Accent3D({
  variant = "knot",
  color = "#FF6B3D",
  wireframe = false,
  className,
}: {
  variant?: Accent3DVariant;
  color?: string;
  wireframe?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const fine = useFinePointer();

  // Respect users who ask for less motion.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mount the canvas only while it is near the viewport; unmount on exit so
  // the WebGL context is released and the GPU stops doing work off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // No 3D on touch / coarse-pointer devices or when reduced motion is on.
  const enabled = fine && !reduced;

  return (
    <div ref={ref} className={className} aria-hidden>
      {enabled && inView && (
        <Accent3DScene variant={variant} color={color} wireframe={wireframe} />
      )}
    </div>
  );
}
