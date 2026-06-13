import type { Metadata } from "next";
import MergeGame from "@/components/game/MergeGame";

export const metadata: Metadata = {
  title: "Birleştir — Oyun",
  description:
    "CAWELT Birleştir: pikselden tam ürüne. Aynı tasarım parçalarını birleştir, büyüt ve en yüksek skoru yap. Tarayıcında oynanan küçük bir mola.",
  alternates: { canonical: "/oyun" },
  openGraph: {
    type: "website",
    title: "Birleştir — CAWELT",
    description:
      "Aynı tasarım parçalarını birleştir, büyüt ve en yüksek skoru yap. Pikselden CAWELT'e.",
    url: "/oyun",
  },
};

export default function OyunPage() {
  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-4 pb-8 pt-20 sm:px-6 sm:pt-24 lg:px-10">
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute left-1/2 top-24 -z-10 size-[460px] -translate-x-1/2 rounded-full bg-champagne/12 blur-[150px]"
      />

      <header className="mb-4 flex items-baseline gap-3 sm:mb-6">
        <h1 className="headline text-2xl text-bone">Birleştir</h1>
        <p className="eyebrow">Mola · Web oyunu</p>
      </header>

      <div className="flex flex-1 items-start justify-center">
        <MergeGame />
      </div>
    </section>
  );
}
