"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import BrowserMockup from "@/components/ui/BrowserMockup";
import { projects } from "@/lib/site";

function ProjectThumb({
  accent,
  image,
  client,
  url,
}: {
  accent: string;
  image?: string;
  client: string;
  url?: string;
}) {
  if (image) {
    return (
      <BrowserMockup
        src={image}
        alt={`${client} web sitesi ekran görüntüsü`}
        url={url ?? ""}
        accent={accent}
      />
    );
  }
  return (
    <div className="relative size-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 30% 20%, ${accent}55, transparent 60%), radial-gradient(80% 60% at 80% 80%, ${accent}30, transparent 70%), #15151c`,
        }}
      />
      {/* Wireframe card preview */}
      <div className="absolute inset-x-12 inset-y-10 rounded-xl border border-bone/10 bg-ink-2/80 backdrop-blur-md">
        <div className="flex items-center gap-1.5 border-b border-bone/10 px-3 py-2">
          <span className="size-1.5 rounded-full bg-bone/30" />
          <span className="size-1.5 rounded-full bg-bone/20" />
          <span className="size-1.5 rounded-full bg-bone/15" />
        </div>
        <div className="space-y-2 p-4">
          <div
            className="h-2 w-2/3 rounded-full"
            style={{ background: accent, opacity: 0.7 }}
          />
          <div className="h-1.5 w-1/2 rounded-full bg-bone/15" />
          <div className="mt-3 h-16 w-full rounded-md bg-bone/5" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 rounded-md bg-bone/5" />
            <div className="h-8 rounded-md bg-bone/10" />
            <div className="h-8 rounded-md bg-bone/5" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
    </div>
  );
}

export default function FeaturedWork() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const featured = projects.slice(0, 4);

  return (
    <section ref={ref} className="relative mx-auto max-w-[1440px] overflow-hidden px-6 py-32 lg:px-10 lg:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 -z-10 size-[480px] rounded-full bg-champagne/10 blur-[160px]"
      />
      <div className="relative mb-14 flex flex-col items-end justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-5">Çalışmalar — seçki</p>
          <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
            Son dönemde{" "}
            <span className="headline-serif text-champagne">
              çalıştığımız işler.
            </span>
          </h2>
        </div>
        <Link
          href="/calismalar"
          className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-bone hover:border-bone"
        >
          Tüm portföy
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid gap-x-5 gap-y-20 md:grid-cols-2">
        {featured.map((p, i) => (
          <motion.div
            key={p.slug}
            style={{ y: i % 2 === 0 ? yA : yB }}
            className={i % 2 === 1 ? "md:mt-24" : ""}
          >
            <Reveal delay={i * 0.05}>
              <Link
                href={`/calismalar#${p.slug}`}
                className="group block"
                data-cursor="hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line">
                  <ProjectThumb
                    accent={p.accent}
                    image={"image" in p ? p.image : undefined}
                    client={p.client}
                    url={"href" in p ? p.href.replace(/^https?:\/\//, "") : undefined}
                  />
                  <motion.div
                    className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5"
                    initial={false}
                  >
                    <div>
                      <p className="font-mono text-xs text-mute">
                        {p.year} · {p.client}
                      </p>
                    </div>
                    <span className="flex size-12 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
                      <ArrowUpRight size={18} />
                    </span>
                  </motion.div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <h3 className="text-xl text-bone md:text-2xl">{p.title}</h3>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {p.discipline.map((d) => (
                      <span
                        key={d}
                        className="rounded-full border border-line bg-surface px-2.5 py-1 text-[0.68rem] uppercase tracking-wider text-mute"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
