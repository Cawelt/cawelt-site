"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { nav, site } from "@/lib/site";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1440px] items-center justify-between px-6 transition-all duration-500 lg:px-10",
          )}
        >
          <Link
            href="/"
            className="group relative flex items-end gap-1.5 leading-none"
            aria-label={`${site.name} anasayfa`}
          >
            <span className="font-display text-[1.6rem] tracking-tight text-bone">
              {site.name}
            </span>
            <span className="mb-[5px] font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mute">
              /{site.suffix}
            </span>
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-bone transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-line/70 bg-ink/40 p-1 backdrop-blur-md md:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm transition-colors",
                    active ? "text-ink" : "text-bone-muted hover:text-bone",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-bone"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/iletisim"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-ink/40 px-4 py-2 text-sm text-bone backdrop-blur-md transition-colors hover:border-bone"
            >
              <span className="size-1.5 rounded-full bg-acid shadow-[0_0_12px_var(--color-acid)]" />
              Proje konuşalım
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] flex size-12 shrink-0 items-center justify-center rounded-full border border-bone/30 bg-bone text-ink shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-transform active:scale-95 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-28 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    className="block border-b border-line/60 py-5 text-3xl tracking-tight text-bone"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto pt-10">
              <p className="eyebrow mb-3">İletişim</p>
              <a
                href={`mailto:${site.email}`}
                className="text-xl text-bone underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
