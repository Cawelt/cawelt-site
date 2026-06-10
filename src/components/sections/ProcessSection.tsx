"use client";

import Reveal from "@/components/ui/Reveal";
import { process } from "@/lib/site";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-32 lg:px-10 lg:py-40">
      <div className="mb-16 grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow mb-5">Süreç — beraber</p>
          <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
            Beş adım,{" "}
            <span className="headline-serif text-champagne">
              sürpriz yok.
            </span>
          </h2>
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.15}>
          <p className="text-bone-muted lg:text-lg">
            Her projede aynı omurgayı takip ederiz. Bu bize tahmin edilebilirlik,
            sana zaman ve cebine net bir bütçe bırakır.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="relative grid gap-0 lg:grid-cols-12">
        {/* Vertical line for desktop */}
        <div className="absolute left-[8.33%] top-0 hidden h-full w-px bg-line lg:block">
          <motion.div
            style={{ height: lineH }}
            className="w-px bg-bone"
          />
        </div>

        {process.map((p, i) => (
          <Reveal
            key={p.step}
            delay={i * 0.08}
            className="contents"
          >
            <div className="grid grid-cols-12 items-start gap-4 border-t border-line/60 py-10 lg:col-span-12 lg:grid-cols-12 lg:py-12">
              <div className="col-span-2 lg:col-span-1">
                <span className="font-mono text-xs text-mute">{p.step}</span>
              </div>
              <div className="col-span-10 lg:col-span-5">
                <h3 className="text-3xl text-bone md:text-4xl lg:text-5xl">
                  {p.title}
                </h3>
              </div>
              <div className="col-span-12 lg:col-span-6">
                <p className="text-bone-muted">{p.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
