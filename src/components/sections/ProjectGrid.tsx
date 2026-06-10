"use client";

import Reveal from "@/components/ui/Reveal";
import Tilt from "@/components/ui/Tilt";
import { GlowingShadow } from "@/components/ui/glowing-shadow";
import BrowserMockup from "@/components/ui/BrowserMockup";
import { ArrowUpRight, Sparkles } from "lucide-react";

type Project = {
  slug: string;
  client: string;
  title: string;
  discipline: readonly string[];
  year: string;
  accent: string;
  href?: string;
  image?: string;
  status?: "live" | "in-progress";
};

function StatusBadge() {
  return (
    <span className="absolute -top-3 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-bone/20 bg-ink-2/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-bone backdrop-blur-md">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1FA34A] opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-[#1FA34A]" />
      </span>
      devam ediyor
    </span>
  );
}

function ProjectCardInner({ p }: { p: Project }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card">
      {p.image ? (
        <BrowserMockup
          src={p.image}
          alt={`${p.client} web sitesi ekran görüntüsü`}
          url={(p.href ?? "").replace(/^https?:\/\//, "")}
          accent={p.accent}
        />
      ) : (
        <>
          <div
            className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            style={{
              background: `radial-gradient(120% 80% at 30% 20%, ${p.accent}55, transparent 60%), radial-gradient(80% 60% at 80% 80%, ${p.accent}30, transparent 70%), #15151c`,
            }}
          />
          <div className="absolute inset-x-12 inset-y-10 rounded-xl border border-bone/10 bg-ink-2/80 backdrop-blur-md transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2">
            <div className="flex items-center gap-1.5 border-b border-bone/10 px-3 py-2">
              <span className="size-1.5 rounded-full bg-bone/30" />
              <span className="size-1.5 rounded-full bg-bone/20" />
              <span className="size-1.5 rounded-full bg-bone/15" />
            </div>
            <div className="space-y-2 p-4">
              <div
                className="h-2 w-2/3 rounded-full"
                style={{ background: p.accent, opacity: 0.7 }}
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
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      <span className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
        <ArrowUpRight size={18} />
      </span>
    </div>
  );
}

export default function ProjectGrid({
  items,
}: {
  items: readonly Project[];
}) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-10">
      <div className="grid gap-x-5 gap-y-16 md:grid-cols-2">
        {items.map((p, i) => {
          const flagship = i === 0;
          return (
            <Reveal
              key={p.slug}
              delay={(i % 2) * 0.08}
              className={i % 2 === 1 ? "md:mt-20" : ""}
            >
              <a
                href={p.href ?? `#${p.slug}`}
                id={p.slug}
                target={p.href ? "_blank" : undefined}
                rel={p.href ? "noopener noreferrer" : undefined}
                className="group block"
                data-cursor="hover"
              >
                {flagship ? (
                  <div className="relative">
                    <span className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-champagne px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-ink shadow-[0_0_24px_rgba(216,203,166,0.5)]">
                      <Sparkles size={11} />
                      öne çıkan
                    </span>
                    {p.status === "in-progress" && <StatusBadge />}
                    <GlowingShadow radius="1.4rem" speed="7s" surface="#0f0f15">
                      <Tilt max={3}>
                        <ProjectCardInner p={p} />
                      </Tilt>
                    </GlowingShadow>
                  </div>
                ) : (
                  <div className="relative">
                    {p.status === "in-progress" && <StatusBadge />}
                    <Tilt max={3}>
                      <div className="rounded-card border border-line">
                        <ProjectCardInner p={p} />
                      </div>
                    </Tilt>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-12 items-start gap-4">
                  <div className="col-span-12 md:col-span-8">
                    <p className="font-mono text-xs text-mute">
                      {p.year} · {p.client}
                    </p>
                    <h3 className="mt-2 text-2xl text-bone md:text-3xl">
                      {p.title}
                    </h3>
                  </div>
                  <div className="col-span-12 flex flex-wrap gap-1.5 md:col-span-4 md:justify-end">
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
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
