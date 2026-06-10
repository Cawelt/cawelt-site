import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ProcessSection from "@/components/sections/ProcessSection";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/ui/Reveal";
import { CyberMatrixBg } from "@/components/ui/cyber-matrix-bg";

export const metadata: Metadata = {
  title: "Süreç",
  description:
    "Beş adımlı işleyiş: keşif, strateji, tasarım, geliştirme, yayın & bakım.",
  alternates: { canonical: "/surec" },
  openGraph: {
    title: "Süreç · CAWELT",
    description:
      "Beş adımlı işleyiş: keşif, strateji, tasarım, geliştirme, yayın & bakım.",
    url: "/surec",
  },
};

const principles = [
  {
    k: "Sürpriz yok",
    v: "Her sprint sonunda bir demo, her hafta bir özet. Kararlar yazılı paylaşılır.",
  },
  {
    k: "Tek ekip",
    v: "Tasarımcı, geliştirici ve product lead aynı kanalda. Aracı yok.",
  },
  {
    k: "Üretken kısıtlar",
    v: "Süre, kapsam ve hedefi tanımlarız; bunun dışındaki her şey değişebilir.",
  },
  {
    k: "Ölçülebilir hedef",
    v: "Lansmandan önce başarı kriterlerini birlikte tanımlarız.",
  },
];

export default function SurecPage() {
  return (
    <>
      {/* Hero zone with matrix backdrop — fades in below the navbar
          and out before the ProcessSection timeline. */}
      <div className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 78%, transparent 100%)",
          }}
        >
          <CyberMatrixBg
            tileSize={64}
            hue={75}
            radiusFactor={0.28}
            baseOpacity={0.08}
          />
        </div>
        <PageHeader
          eyebrow="Süreç — beraber"
          title="Nasıl"
          serif="çalışıyoruz."
          description="İlk e-postadan canlıya çıkana kadar her aşamayı, ne sen ne biz tahmin etmek zorunda kalmayalım diye yazdık."
        />
      </div>

      <ProcessSection />

      <section className="relative isolate py-32 lg:py-40">
        {/* Matrix backdrop — clipped to this section, fades top/bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
          }}
        >
          <CyberMatrixBg
            tileSize={62}
            hue={75}
            radiusFactor={0.28}
            baseOpacity={0.1}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow mb-6">İlkeler</p>
            <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
              İşleyişin{" "}
              <span className="headline-serif text-champagne">değişmez</span>{" "}
              kuralları.
            </h2>
            <p className="mt-6 max-w-md font-mono text-xs text-mute">
              <span className="text-acid">{"//"}</span> imleci ızgaranın
              üzerinde gezdir
            </p>
          </Reveal>
          <div className="relative mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal
                key={p.k}
                delay={i * 0.05}
                className="bg-surface/95 p-8 backdrop-blur-sm lg:p-10"
              >
                <p className="font-mono text-xs text-mute">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-3xl text-bone md:text-4xl">{p.k}</h3>
                <p className="mt-4 text-bone-muted">{p.v}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
