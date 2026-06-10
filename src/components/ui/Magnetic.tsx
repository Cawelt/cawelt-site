"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { useFinePointer } from "@/lib/useFinePointer";

export default function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.5 });

  const move = (e: React.PointerEvent) => {
    if (!fine || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  if (!fine) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
