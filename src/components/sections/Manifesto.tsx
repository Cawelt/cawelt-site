"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const lines = [
  "Şablon yok.",
  "Hızlı yapılmış değil, doğru yapılmış.",
  "Tasarımcı ile geliştirici aynı odada.",
  "Yayın bir bitiş değil, ilk hafta.",
];

export default function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.2"],
  });

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-[1440px] px-6 py-32 lg:px-10 lg:py-40"
    >
      <p className="eyebrow mb-10">Manifesto — kısa hâli</p>
      <div className="space-y-3">
        {lines.map((l, i) => {
          const start = i / lines.length;
          const end = (i + 1) / lines.length;
          return (
            <ManifestoLine
              key={l}
              text={l}
              progress={scrollYProgress}
              range={[start, end]}
            />
          );
        })}
      </div>
    </section>
  );
}

function ManifestoLine({
  text,
  progress,
  range,
}: {
  text: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const x = useTransform(progress, range, [-12, 0]);
  return (
    <motion.h3
      style={{ opacity, x }}
      className="headline text-4xl text-bone md:text-6xl lg:text-7xl"
    >
      {text}
    </motion.h3>
  );
}
