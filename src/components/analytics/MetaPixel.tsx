"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Meta (Facebook) Pixel — KVKK uyumlu çerez onayıyla.
 *
 * Pixel yalnızca kullanıcı "Kabul et" dedikten sonra yüklenir (önceden hiçbir
 * izleme yapılmaz). Seçim localStorage'da saklanır. Pixel ID ortam değişkeninden
 * (NEXT_PUBLIC_META_PIXEL_ID) okunur; tanımlı değilse bileşen hiç çalışmaz.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const KEY = "cawelt-cookie-consent"; // "granted" | "denied"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function injectPixel(id: string) {
  if (typeof window === "undefined" || window.fbq) return;
  // Meta Pixel base kodu (resmi snippet'in tiplenmiş hâli)
  const fbq = function (...args: unknown[]) {
    // @ts-expect-error — runtime kuyruğu, Meta snippet'i
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
  } as unknown as { (...a: unknown[]): void; queue: unknown[]; loaded: boolean; version: string; push: unknown };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  window.fbq = fbq as unknown as Window["fbq"];
  if (!window._fbq) window._fbq = fbq;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);

  window.fbq?.("init", id);
  window.fbq?.("track", "PageView");
}

type Consent = "granted" | "denied" | null;

export default function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const firstRun = useRef(true);

  // Kayıtlı seçimi oku
  useEffect(() => {
    let v: Consent = null;
    try {
      const s = localStorage.getItem(KEY);
      if (s === "granted" || s === "denied") v = s;
    } catch {
      /* localStorage kapalı olabilir */
    }
    setConsent(v);
    setReady(true);
  }, []);

  // Onay verildiyse pixel'i yükle
  useEffect(() => {
    if (consent === "granted" && PIXEL_ID) injectPixel(PIXEL_ID);
  }, [consent]);

  // SPA sayfa geçişlerinde PageView (ilk yükleme injectPixel'de sayıldı)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (consent === "granted") window.fbq?.("track", "PageView");
  }, [pathname, consent]);

  const choose = useCallback((v: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* yok say */
    }
    setConsent(v);
  }, []);

  // Env yoksa veya seçim zaten yapıldıysa banner gösterme
  if (!PIXEL_ID) return null;
  if (!ready || consent !== null) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-2xl rounded-card border border-line bg-surface/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-bone-muted">
          Deneyimini iyileştirmek ve pazarlama ölçümü için çerez kullanıyoruz.
          Kabul ederek bu çerezlere izin vermiş olursun.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border border-line px-4 py-2 text-sm text-bone-muted transition-colors hover:border-bone hover:text-bone"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-champagne px-5 py-2 text-sm font-medium text-ink transition-transform active:scale-95"
          >
            Kabul et
          </button>
        </div>
      </div>
    </div>
  );
}
