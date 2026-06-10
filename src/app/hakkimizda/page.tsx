import type { Metadata } from "next";
import { Coffee, Ban, Moon, Target, Bug, Rocket } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/sections/CTA";
import { values, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${site.name} kimdir, neye inanır, kimlerle çalışır.`,
  alternates: { canonical: "/hakkimizda" },
  openGraph: {
    title: `Hakkımızda · ${site.name}`,
    description: `${site.name} kimdir, neye inanır, kimlerle çalışır.`,
    url: "/hakkimizda",
  },
};

const funFacts = [
  { icon: Coffee, value: "1.248", label: "Bu yıl içilen kahve" },
  { icon: Ban, value: "0", label: "Kullandığımız hazır şablon" },
  { icon: Moon, value: "02:47", label: "En geç “son bir düzeltme” saati" },
  { icon: Target, value: "3", label: "Aynı anda odaklandığımız proje" },
  { icon: Bug, value: "∞ → 0", label: "Eninde sonunda yakalanan bug" },
  { icon: Rocket, value: "%100", label: "Yayın günündeki heyecan" },
];

export default function HakkimizdaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımızda — kim"
        title="Küçük ekip,"
        serif="büyük dikkat."
        description={`${site.name}, web sitesi, mobil uygulama ve panel + API sistemleri tasarlayan bağımsız bir yazılım stüdyosu. Aynı anda yalnızca birkaç projeye odaklanırız; bu sayede her iş, kendi ekibinin tam zamanını alır.`}
      />

      {/* Story */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-12 border-t border-line/60 pt-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-6">Hikâye</p>
            <h2 className="headline text-4xl text-bone md:text-5xl lg:text-6xl">
              Stüdyo, freelance’ten daha sıkı; ajanstan daha sade olsun istedik.
            </h2>
          </Reveal>
          <Reveal className="space-y-6 text-bone-muted lg:col-span-7" delay={0.1}>
            <p className="text-lg">
              Onlarca proje boyunca aynı şeyleri gördük: brifler iyiydi, ekipler
              iyiydi, ama tasarım ve mühendislik arası boşluklar projeleri
              yıpratıyordu.
            </p>
            <p className="text-lg">
              {site.name}’u bu boşluğu kapatmak için kurduk. Aynı odada oturan
              küçük bir ekiple, az sayıda projeye odaklanıp her birine sahibiymiş
              gibi yaklaşıyoruz. Web’de, mobilde ve API’da; tek nefeste.
            </p>
            <p className="text-lg">
              Kocaeli ve İstanbul merkezli çalışıyor, Türkiye’nin dört bir
              yanındaki markalarla iş yapıyoruz. Yarın için planımız aynı: az
              ama derin.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1440px] px-6 py-32 lg:px-10 lg:py-40">
        <Reveal>
          <p className="eyebrow mb-6">Değerler</p>
          <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
            Neye{" "}
            <span className="headline-serif text-champagne">inanırız.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 0.05}
              className="bg-surface p-8 lg:p-10"
            >
              <p className="font-mono text-xs text-mute">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-2xl text-bone md:text-3xl">{v.title}</h3>
              <p className="mt-4 text-bone-muted">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fun facts */}
      <section className="mx-auto max-w-[1440px] px-6 py-32 lg:px-10 lg:py-40">
        <Reveal>
          <p className="eyebrow mb-6">Stüdyo gerçekleri</p>
          <h2 className="headline text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
            Rakamlarla biz,{" "}
            <span className="headline-serif text-champagne">
              pek de ciddi değil.
            </span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {funFacts.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal
                key={f.label}
                delay={i * 0.04}
                className="group bg-surface p-6"
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-mute transition-colors duration-300 group-hover:text-bone"
                />
                <p className="mt-5 text-2xl text-bone md:text-[1.75rem]">
                  {f.value}
                </p>
                <p className="mt-1 text-sm text-mute">{f.label}</p>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 font-mono text-xs text-mute">
            * Bazı veriler bilimsel olarak doğrulanmamıştır. Kahve hariç.
          </p>
        </Reveal>
      </section>

      <CTA />
    </>
  );
}
