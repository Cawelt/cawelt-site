"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";

const services = ["Web sitesi", "Mobil uygulama", "Panel + API", "Tümü"];

export default function ContactForm() {
  const [service, setService] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setError(null);
    setSending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      website: fd.get("website"),
      message: fd.get("message"),
      company_url: fd.get("company_url"), // honeypot
      service: service ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setSent(true);
      } else {
        setError(json.error ?? "Mail gönderilemedi. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handle}
      className="relative overflow-hidden rounded-card border border-line bg-surface p-6 lg:p-10"
    >
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-surface text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="grid size-16 place-items-center rounded-full bg-acid text-ink"
            >
              <Check size={28} />
            </motion.span>
            <h3 className="headline text-3xl text-bone md:text-5xl">
              Teşekkürler.
            </h3>
            <p className="max-w-md text-bone-muted">
              Brifin elimize ulaştı. 24 saat içinde sana dönüyoruz.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 flex items-center justify-between">
        <p className="eyebrow">Brif — 04 alan</p>
        <p className="font-mono text-xs text-mute">
          {[service].filter(Boolean).length} / 1 seçildi
        </p>
      </div>

      <fieldset className="mb-8">
        <legend className="mb-3 text-sm text-bone-muted">
          Ne tür bir proje?
        </legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setService(s)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                service === s
                  ? "border-bone bg-bone text-ink"
                  : "border-line bg-ink-2 text-bone-muted hover:border-bone-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ad Soyad" name="name" required />
        <Field label="E-posta" name="email" type="email" required />
        <Field label="Şirket" name="company" />
        <Field label="Web sitesi" name="website" />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm text-bone-muted">
          Projeden bahset
        </label>
        <textarea
          name="message"
          rows={5}
          required
          className="w-full resize-none rounded-xl border border-line bg-ink-2 px-4 py-3 text-bone placeholder:text-mute-2 focus:border-bone focus:outline-none"
          placeholder="Hedef, kapsam, takvim, referanslar..."
        />
      </div>

      {/* Honeypot — gerçek kullanıcılar görmez, botlar doldurur */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" >
        <label>
          Şirket web sitesi
          <input
            type="text"
            name="company_url"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-soft">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="max-w-sm text-xs text-mute">
          Bilgilerin sadece bu projeyi değerlendirmek için kullanılır. Üçüncü
          taraflarla paylaşılmaz.
        </p>
        <Magnetic className="self-stretch sm:self-auto">
          <button
            type="submit"
            disabled={sending}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {sending ? "Gönderiliyor…" : "Gönder"}
            {!sending && (
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            )}
          </button>
        </Magnetic>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-bone-muted">
        {label}
        {required && <span className="ml-1 text-ember">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-bone placeholder:text-mute-2 focus:border-bone focus:outline-none"
      />
    </label>
  );
}
