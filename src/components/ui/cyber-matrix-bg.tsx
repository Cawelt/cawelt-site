"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Tile size in px. Bigger = fewer nodes, sparser look. */
  tileSize?: number;
  /** Hue (0-360). Default 75 = brand acid lime. Try 16 for ember, 216 for tide. */
  hue?: number;
  /** Influence radius as fraction of viewport width. */
  radiusFactor?: number;
  /** Character pool drawn into tiles. */
  chars?: string;
  /** Base opacity at rest. Default 0.035 — very subtle. */
  baseOpacity?: number;
  /** Tile font size. */
  fontSize?: string;
}

export function CyberMatrixBg({
  className,
  tileSize = 64,
  hue = 75,
  radiusFactor = 0.26,
  chars = "/<>{}[]()=;:.,?!@#%&*+-_~^|01abcdefghijklmnopqrstuvwxyz",
  baseOpacity = 0.09,
  fontSize = "0.72rem",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const dimsRef = useRef({ cols: 1, rows: 1, tileW: 0, tileH: 0 });
  const rafRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cols = Math.max(1, Math.floor(rect.width / tileSize));
      const rows = Math.max(1, Math.floor(rect.height / tileSize));
      grid.style.setProperty("--cmx-cols", String(cols));
      grid.style.setProperty("--cmx-rows", String(rows));
      grid.innerHTML = "";
      const tiles: HTMLDivElement[] = [];
      const total = cols * rows;
      for (let i = 0; i < total; i++) {
        const tile = document.createElement("div");
        tile.className = "cmx-tile";
        tile.textContent = chars[Math.floor(Math.random() * chars.length)];
        tile.style.setProperty("--i", "0");
        grid.appendChild(tile);
        tiles.push(tile);
      }
      tilesRef.current = tiles;
      dimsRef.current = {
        cols,
        rows,
        tileW: rect.width / cols,
        tileH: rect.height / rows,
      };
    };

    let mouseX = -99999;
    let mouseY = -99999;
    let pending = false;

    const update = () => {
      pending = false;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const radius = window.innerWidth * radiusFactor;
      const { cols, tileW, tileH } = dimsRef.current;
      const tiles = tilesRef.current;
      const len = tiles.length;
      const r2 = radius * radius;

      for (let i = 0; i < len; i++) {
        const c = i % cols;
        const r = (i - c) / cols;
        const tx = rect.left + c * tileW + tileW * 0.5;
        const ty = rect.top + r * tileH + tileH * 0.5;
        const dx = mouseX - tx;
        const dy = mouseY - ty;
        const d2 = dx * dx + dy * dy;
        if (d2 > r2) {
          tiles[i].style.setProperty("--i", "0");
          continue;
        }
        const intensity = 1 - Math.sqrt(d2) / radius;
        tiles[i].style.setProperty("--i", intensity.toFixed(3));
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!pending) {
        pending = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    const ro = new ResizeObserver(() => buildGrid());
    ro.observe(container);

    buildGrid();
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, tileSize, radiusFactor, chars]);

  const styleVars = {
    "--cmx-hue": String(hue),
    "--cmx-base": String(baseOpacity),
    "--cmx-font-size": fontSize,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={styleVars}
    >
      <div ref={gridRef} className="cmx-grid" />

      {/* Static low-contrast scanline texture for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 3px)",
        }}
      />

      <style>{`
        .cmx-grid {
          --cmx-cols: 1;
          --cmx-rows: 1;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(var(--cmx-cols), 1fr);
          grid-template-rows: repeat(var(--cmx-rows), 1fr);
        }
        .cmx-tile {
          --i: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: var(--cmx-font-size);
          letter-spacing: 0;
          opacity: calc(var(--cmx-base) + var(--i) * 0.9);
          color: hsl(
            var(--cmx-hue),
            calc(35% + var(--i) * 65%),
            calc(55% + var(--i) * 28%)
          );
          text-shadow:
            0 0 calc(var(--i) * 12px) hsl(var(--cmx-hue), 100%, 60%),
            0 0 calc(var(--i) * 22px) hsl(var(--cmx-hue), 100%, 50% / 0.55);
          transform: scale(calc(1 + var(--i) * 0.18));
          transition:
            color 0.2s ease,
            text-shadow 0.2s ease,
            transform 0.2s ease,
            opacity 0.2s ease;
          will-change: transform, opacity;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
