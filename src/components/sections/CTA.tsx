"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import Reveal from "@/components/ui/Reveal";
import { GlowingShadow } from "@/components/ui/glowing-shadow";
import { site } from "@/lib/site";

export default function CTA() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-32 lg:px-10 lg:py-40">
      <GlowingShadow radius="2rem" speed="9s" surface="#101015">
        <div className="relative overflow-hidden p-10 md:p-16 lg:p-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-[440px] rounded-full bg-champagne/15 blur-[150px]"
          />
          <Reveal className="relative">
            <p className="eyebrow mb-6">Hadi başlayalım</p>
            <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[7.5rem]">
              Sıradaki proje{" "}
              <span className="headline-serif text-champagne">
                seninki olsun.
              </span>
            </h2>
            <p className="mt-8 max-w-xl text-bone-muted md:text-lg">
              İlk görüşmeyi yapmak için kısa bir form veya bir e-posta yeterli.
              Genelde 24 saat içinde geri dönüyoruz.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/iletisim"
                  className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 text-sm font-medium text-ink"
                >
                  Brifini gönder
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="text-bone underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </div>
          </Reveal>
        </div>
      </GlowingShadow>
    </section>
  );
}
