import { testimonials } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

// Müşteri yorumları. Yorum yoksa hiç render edilmez.
export default function Testimonials() {
  if (!testimonials.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
      <Reveal>
        <p className="eyebrow mb-6">Ne diyorlar</p>
        <h2 className="headline text-4xl text-bone md:text-5xl">
          Müşteri yorumları
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 0.05} className="bg-surface">
            <figure className="flex h-full flex-col justify-between p-8 lg:p-10">
              <blockquote className="text-lg leading-relaxed text-bone-muted">
                <span className="mr-1 font-display text-2xl text-champagne">
                  “
                </span>
                {t.quote}
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-bone">{t.author}</p>
                <p className="font-mono text-xs text-mute">{t.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
