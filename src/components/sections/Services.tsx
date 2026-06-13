"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Tilt from "@/components/ui/Tilt";
import Reveal from "@/components/ui/Reveal";
import Accent3D from "@/components/three/Accent3D";
import { services } from "@/lib/site";

function ServiceVisual({ id }: { id: string }) {
  if (id === "web") {
    return (
      <div className="relative size-full">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ember/40 via-ember/10 to-transparent" />
        <svg viewBox="0 0 400 280" className="relative size-full">
          <defs>
            <linearGradient id="webGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6B3D" />
              <stop offset="100%" stopColor="#FF6B3D" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x="40"
            y="50"
            width="320"
            height="200"
            rx="14"
            fill="#15151c"
            stroke="#26262f"
          />
          <rect x="40" y="50" width="320" height="22" rx="14" fill="#1c1c25" />
          <circle cx="56" cy="61" r="3" fill="#FF6B3D" />
          <circle cx="68" cy="61" r="3" fill="#3a3a45" />
          <circle cx="80" cy="61" r="3" fill="#3a3a45" />
          <rect x="60" y="92" width="180" height="16" rx="3" fill="#3a3a45" />
          <rect x="60" y="116" width="120" height="10" rx="3" fill="#26262f" />
          <rect x="60" y="148" width="280" height="80" rx="8" fill="url(#webGrad)" opacity="0.55" />
        </svg>
      </div>
    );
  }
  if (id === "mobil") {
    return (
      <div className="relative size-full">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-tide/40 via-tide/10 to-transparent" />
        <svg viewBox="0 0 400 280" className="relative size-full">
          <defs>
            <linearGradient id="mobGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B8DEF" />
              <stop offset="100%" stopColor="#5B8DEF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x="155"
            y="30"
            width="120"
            height="220"
            rx="22"
            fill="#15151c"
            stroke="#26262f"
          />
          <rect
            x="170"
            y="50"
            width="90"
            height="180"
            rx="10"
            fill="#0a0a0c"
          />
          <rect x="180" y="62" width="50" height="8" rx="2" fill="#3a3a45" />
          <rect x="180" y="78" width="70" height="60" rx="6" fill="url(#mobGrad)" />
          <rect x="180" y="146" width="70" height="10" rx="3" fill="#26262f" />
          <rect x="180" y="162" width="50" height="10" rx="3" fill="#26262f" />
          <rect x="180" y="190" width="70" height="32" rx="6" fill="#5B8DEF" opacity="0.4" />
          <circle cx="305" cy="100" r="22" fill="#5B8DEF" opacity="0.18" />
          <circle cx="100" cy="200" r="32" fill="#5B8DEF" opacity="0.12" />
        </svg>
      </div>
    );
  }
  if (id === "altyapi") {
    return (
      <div className="relative size-full">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-champagne/30 via-champagne/10 to-transparent" />
        <svg viewBox="0 0 400 280" className="relative size-full">
          {/* sunucu birimleri */}
          <rect x="36" y="62" width="206" height="46" rx="8" fill="#15151c" stroke="#26262f" />
          <circle cx="58" cy="85" r="4" fill="#D8CBA6" />
          <rect x="76" y="81" width="120" height="8" rx="2" fill="#26262f" />
          <rect x="36" y="118" width="206" height="46" rx="8" fill="#15151c" stroke="#26262f" />
          <circle cx="58" cy="141" r="4" fill="#D8CBA6" />
          <rect x="76" y="137" width="100" height="8" rx="2" fill="#26262f" />
          <rect x="36" y="174" width="206" height="46" rx="8" fill="#15151c" stroke="#26262f" />
          <circle cx="58" cy="197" r="4" fill="#3a3a45" />
          <rect x="76" y="193" width="120" height="8" rx="2" fill="#26262f" />
          {/* güvenlik kalkanı */}
          <path
            d="M325 64 L367 82 L367 130 Q367 180 325 204 Q283 180 283 130 L283 82 Z"
            fill="#15151c"
            stroke="#D8CBA6"
            strokeWidth="2"
          />
          <polyline
            points="306,134 320,150 346,116"
            fill="none"
            stroke="#D8CBA6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="relative size-full">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-acid/30 via-acid/10 to-transparent" />
      <svg viewBox="0 0 400 280" className="relative size-full">
        <rect x="30" y="40" width="240" height="200" rx="12" fill="#15151c" stroke="#26262f" />
        <rect x="30" y="40" width="240" height="22" rx="12" fill="#1c1c25" />
        <rect x="46" y="76" width="60" height="148" rx="6" fill="#0a0a0c" />
        <rect x="54" y="92" width="40" height="6" rx="2" fill="#3a3a45" />
        <rect x="54" y="106" width="32" height="6" rx="2" fill="#26262f" />
        <rect x="54" y="120" width="40" height="6" rx="2" fill="#26262f" />
        <rect x="54" y="134" width="36" height="6" rx="2" fill="#26262f" />
        <rect x="118" y="76" width="138" height="80" rx="6" fill="#1c1c25" />
        <polyline
          points="128,140 150,120 170,128 190,108 215,118 245,90"
          fill="none"
          stroke="#D6FF5E"
          strokeWidth="2"
        />
        <rect x="118" y="166" width="138" height="58" rx="6" fill="#1c1c25" />
        <rect x="128" y="178" width="60" height="6" rx="2" fill="#3a3a45" />
        <rect x="128" y="190" width="100" height="6" rx="2" fill="#26262f" />
        <rect x="128" y="202" width="80" height="6" rx="2" fill="#26262f" />
        {/* Phone mirroring data */}
        <rect x="290" y="60" width="80" height="160" rx="14" fill="#15151c" stroke="#26262f" />
        <rect x="298" y="74" width="64" height="120" rx="8" fill="#0a0a0c" />
        <polyline
          points="304,160 314,150 326,156 340,140 356,148"
          fill="none"
          stroke="#D6FF5E"
          strokeWidth="1.5"
        />
        {/* Connection */}
        <path
          d="M 270 140 Q 280 140 290 140"
          stroke="#D6FF5E"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </svg>
    </div>
  );
}

export default function Services() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      id="hizmetler"
      className="relative mx-auto max-w-[1440px] overflow-hidden px-6 py-32 lg:px-10 lg:py-40"
    >
      <Accent3D
        variant="ico"
        color="#D8CBA6"
        wireframe
        className="pointer-events-none absolute right-4 top-20 hidden size-[240px] opacity-70 lg:block xl:right-10 xl:size-[300px]"
      />
      <div className="relative mb-16 grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow mb-5">Hizmetler — 04</p>
          <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
            Birkaç alanda derinleşiriz,{" "}
            <span className="headline-serif text-champagne">birinde değil.</span>
          </h2>
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.15}>
          <motion.p style={{ y }} className="text-bone-muted lg:text-lg">
            Web, mobil, panel + API ve altyapı/güvenlik. Çoğu zaman birkaçı aynı
            projede buluşur — ve doğru iş birliği hepsini tek nefes gibi
            hissettirir.
          </motion.p>
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {services.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 0.08}
            className={
              i === 0
                ? "lg:col-span-7"
                : i === 1
                  ? "lg:col-span-5"
                  : "lg:col-span-12"
            }
          >
            <Tilt max={4} className="h-full">
              <Link
                href={`/hizmetler#${s.id}`}
                className="group relative flex h-full flex-col gap-8 overflow-hidden rounded-card border border-line bg-surface p-8 transition-colors hover:border-line-strong lg:p-10"
                data-cursor="hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-mute">{s.index}</p>
                    <h3 className="mt-2 text-3xl text-bone md:text-4xl">
                      {s.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-mute transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-bone"
                  />
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line/60 bg-ink-2">
                  <ServiceVisual id={s.id} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <p className="text-bone-muted md:text-[15px]">{s.long}</p>
                  <ul className="grid grid-cols-1 gap-1.5 text-sm text-bone-muted">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 border-b border-line/40 py-1.5 last:border-b-0"
                      >
                        <span className="size-1 rounded-full bg-mute" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
