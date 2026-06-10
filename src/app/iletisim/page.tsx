import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/sections/ContactForm";
import { site } from "@/lib/site";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Bir proje brifi gönder veya doğrudan e-posta yaz.",
  alternates: { canonical: "/iletisim" },
  openGraph: {
    title: "İletişim · CAWELT",
    description: "Bir proje brifi gönder veya doğrudan e-posta yaz.",
    url: "/iletisim",
  },
};

export default function IletisimPage() {
  return (
    <>
      <PageHeader
        eyebrow="İletişim — şimdi"
        title="Hadi"
        serif="başlayalım."
        description="Aşağıdaki formu doldurmak en hızlı yol. Tercih edersen doğrudan e-posta da yazabilirsin."
      />

      <section className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-12 border-t border-line/60 pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <div className="space-y-10 lg:col-span-4">
            <div>
              <p className="eyebrow mb-3">E-posta</p>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-2 text-2xl text-bone hover:underline"
              >
                {site.email}
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
            <div>
              <p className="eyebrow mb-3">Telefon</p>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="text-2xl text-bone hover:underline"
              >
                {site.phone}
              </a>
            </div>
            <div>
              <p className="eyebrow mb-3">Stüdyo</p>
              <p className="text-2xl text-bone">{site.city}</p>
            </div>
            <div>
              <p className="eyebrow mb-3">Sosyal</p>
              <ul className="space-y-2">
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 text-bone-muted hover:text-bone"
                    >
                      {s.label}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-all group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1440px] px-6 py-32 lg:px-10 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Sık sorulanlar</p>
            <h2 className="headline text-5xl text-bone md:text-6xl lg:text-7xl">
              Cevap{" "}
              <span className="headline-serif text-champagne">
                aradığın
              </span>{" "}
              şeyler.
            </h2>
          </div>
          <div className="space-y-px overflow-hidden rounded-card border border-line bg-line lg:col-span-7">
            {[
              {
                q: "Hangi teknolojilerle çalışıyorsunuz?",
                a: "Web'de Next.js/React ve Laravel/PHP, mobilde React Native; arka planda Node.js, PostgreSQL/MySQL ve modern API mimarileri. Her projede ihtiyaca en uygun olanı seçiyoruz, moda olanı değil.",
              },
              {
                q: "Ne kadar sürede teslim?",
                a: "Marketing siteleri 4–8 hafta, mobil uygulamalar 8–14 hafta, panel + API sistemleri kapsama göre 10–20 hafta arasında değişir.",
              },
              {
                q: "Sadece tasarım veya sadece geliştirme yapar mısınız?",
                a: "Evet. Her iki alanı tek başına da üstleniyoruz; ancak tasarım ve mühendisliğin aynı ekipten geldiği projelerde sonuçlar belirgin biçimde iyi.",
              },
              {
                q: "Yayın sonrası destek?",
                a: "Aylık veya retainer bakım anlaşmalarımız var. Lansmandan sonra ürünü canlı tutup iyileştirmek dahildir.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group bg-surface p-6 transition-colors lg:p-8"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-bone marker:hidden">
                  <span className="text-lg md:text-xl">{f.q}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-mute transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-bone-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
