"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import SplitWords from "@/components/ui/SplitWords";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] items-end overflow-hidden pt-32">
      {/* 3D scene */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2">
          <HeroScene />
        </div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-ink)_85%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Background pads */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -left-40 top-20 -z-10 size-[640px] rounded-full bg-ember/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -right-40 top-1/3 -z-10 size-[520px] rounded-full bg-tide/20 blur-[140px]"
        style={{ animationDelay: "-7s" }}
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 lg:px-10 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8 flex items-center gap-3"
            >
              <span className="size-1.5 rounded-full bg-acid shadow-[0_0_18px_var(--color-acid)]" />
              <span className="eyebrow">2026 — yeni proje alımı açık</span>
            </motion.div>

            <h1 className="headline text-[14vw] leading-[0.95] text-bone sm:text-[10vw] lg:text-[8.4rem] xl:text-[10rem]">
              <span className="block">
                <SplitWords text="Tasarım odaklı" />
              </span>
              <span className="block">
                <span className="headline-serif text-champagne">
                  <SplitWords text="yazılım" delay={0.15} />
                </span>{" "}
                <SplitWords text="stüdyosu." delay={0.25} />
              </span>
            </h1>
          </div>

          <div className="space-y-8 lg:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-base text-bone-muted lg:text-[15px]"
            >
              Web siteleri, mobil uygulamalar ve birbiriyle konuşan panel + API
              sistemleri. Hepsi tek ekipten, tek nefeste.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Link
                  href="/iletisim"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink transition-colors"
                >
                  <span className="relative z-10">Proje başlat</span>
                  <ArrowUpRight
                    size={16}
                    className="relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                  <span className="absolute inset-0 -z-0 translate-y-full bg-ember transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link
                  href="/calismalar"
                  className="inline-flex items-center gap-3 rounded-full border border-line px-6 py-3.5 text-sm text-bone transition-colors hover:border-bone"
                >
                  İşleri gör
                </Link>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-20 grid grid-cols-2 items-end gap-6 border-t border-line/60 pt-6 md:grid-cols-4">
          {[
            { k: "12+", v: "Yayında ürün" },
            { k: "3", v: "Hizmet alanı" },
            { k: "%99", v: "Performans skoru" },
            { k: "0", v: "Şablon, sıfır kopya" },
          ].map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.06 }}
              className="flex flex-col"
            >
              <span className="font-display text-3xl text-bone md:text-4xl">
                {s.k}
              </span>
              <span className="mt-1 text-xs text-mute">{s.v}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 right-6 hidden items-center gap-2 text-mute lg:flex">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em]">
          aşağı kaydır
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.span>
      </div>
    </section>
  );
}
