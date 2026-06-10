import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/sections/CTA";
import { services, stack } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "Web siteleri, mobil uygulamalar ve panel + API sistemleri. Üç hizmet alanında, tek ekipten.",
  alternates: { canonical: "/hizmetler" },
  openGraph: {
    title: "Hizmetler · CAWELT",
    description:
      "Web siteleri, mobil uygulamalar ve panel + API sistemleri. Üç hizmet alanında, tek ekipten.",
    url: "/hizmetler",
  },
};

export default function HizmetlerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hizmetler — 03"
        title="Hizmetler."
        serif="ne yapıyoruz"
        description="Birbiriyle konuşan üç alan. Çoğu projede üçü birden gerekir; ama sadece birini de yapabiliriz. Aşağıda her birinin nasıl çalıştığı."
      />

      <section className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="space-y-24 lg:space-y-32">
          {services.map((s, i) => (
            <Reveal key={s.id}>
              <article
                id={s.id}
                className="grid gap-10 border-t border-line/60 pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16"
              >
                <div className="lg:col-span-4">
                  <p className="font-mono text-sm text-mute">{s.index}</p>
                  <h2 className="headline mt-3 text-5xl text-bone md:text-6xl lg:text-7xl">
                    {s.title}
                  </h2>
                  <p className="mt-6 text-bone-muted lg:text-[15px]">
                    {s.short}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <p className="max-w-2xl text-xl text-bone-muted md:text-2xl">
                    {s.long}
                  </p>
                  <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
                    {s.bullets.map((b, j) => (
                      <li
                        key={b}
                        className="flex items-start gap-4 bg-surface p-5"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-bone" />
                        <span className="text-bone">{b}</span>
                        <span className="ml-auto font-mono text-xs text-mute">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="mx-auto max-w-[1440px] px-6 py-32 lg:px-10 lg:py-40">
        <Reveal>
          <p className="eyebrow mb-6">Stack</p>
          <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
            Kullandığımız{" "}
            <span className="headline-serif text-champagne">
              araçların
            </span>{" "}
            kısa listesi.
          </h2>
        </Reveal>
        <div className="mt-12 flex flex-wrap gap-2">
          {stack.map((t, i) => (
            <Reveal key={t} delay={i * 0.02}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-bone-muted">
                <span className="font-mono text-[0.62rem] text-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
