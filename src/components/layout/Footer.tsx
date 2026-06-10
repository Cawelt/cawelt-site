import Link from "next/link";
import { nav, site } from "@/lib/site";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line/70 bg-ink-2">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bone/30 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8">Bir sonraki proje</p>
            <h3 className="headline text-5xl text-bone md:text-7xl lg:text-[7rem]">
              Bir fikir var mı?{" "}
              <span className="headline-serif text-champagne">konuşalım.</span>
            </h3>
            <a
              href={`mailto:${site.email}`}
              className="mt-10 inline-flex items-center gap-3 text-xl text-bone underline-offset-4 hover:underline md:text-2xl"
            >
              {site.email}
              <ArrowUpRight size={22} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 lg:col-span-5 lg:grid-cols-3 lg:gap-6">
            <div>
              <p className="eyebrow mb-4">Sayfalar</p>
              <ul className="space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-bone-muted transition-colors hover:text-bone"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Sosyal</p>
              <ul className="space-y-2.5">
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-bone-muted transition-colors hover:text-bone"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="eyebrow mb-4">Stüdyo</p>
              <p className="text-sm text-bone-muted">{site.city}</p>
              <p className="mt-2 text-sm text-bone-muted">{site.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-mute md:flex-row md:items-center lg:px-10">
          <span>
            © {new Date().getFullYear()} {site.legal}. Tüm hakları saklıdır.
          </span>
          <span className="font-mono">Kocaeli · İstanbul</span>
        </div>
      </div>
    </footer>
  );
}
