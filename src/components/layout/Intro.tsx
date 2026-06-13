"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// "Merhaba" farklı dillerde — son kelime Türkçe (markanın dili) ile biter.
const GREETINGS = [
  "Hello",
  "Bonjour",
  "Hola",
  "Ciao",
  "こんにちは",
  "안녕하세요",
  "Olá",
  "Hallo",
  "Привет",
  "مرحبا",
  "Merhaba",
];

const SEEN_KEY = "cawelt-intro-seen";
const STEP_MS = 200; // her kelimenin ekranda kalma süresi
const HOLD_LAST_MS = 520; // son kelime (Merhaba) biraz daha dursun

export default function Intro() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [i, setI] = useState(0);

  // Oturumda daha önce görüldüyse hiç gösterme (yeniden boyamadan önce kapat).
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* sessionStorage kapalı olabilir */
    }
    if (seen) {
      setVisible(false);
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* yok say */
    }

    // Açılırken kaydırmayı kilitle.
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const timers: ReturnType<typeof setTimeout>[] = [];
    const last = GREETINGS.length - 1;

    if (reduce) {
      // Hareket azaltılmışsa: tek kelime göster, kısa tut.
      setI(last);
      timers.push(setTimeout(() => setVisible(false), 650));
    } else {
      for (let step = 1; step <= last; step++) {
        timers.push(setTimeout(() => setI(step), step * STEP_MS));
      }
      timers.push(
        setTimeout(() => setVisible(false), last * STEP_MS + HOLD_LAST_MS),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = prev;
    };
  }, [reduce]);

  // Perde kapandığında kaydırmayı serbest bırak.
  const handleExitComplete = () => {
    document.documentElement.style.overflow = "";
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
        >
          {/* yumuşak şampanya ışıltısı */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/10 blur-[120px]"
          />

          <div className="flex items-center gap-4 px-6">
            <motion.span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full bg-champagne"
              animate={
                reduce ? undefined : { scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }
              }
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            <div className="relative inline-flex overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={i}
                  className="headline block whitespace-nowrap text-4xl text-bone sm:text-6xl"
                  style={{ lineHeight: 1.15 }}
                  initial={reduce ? false : { y: "115%" }}
                  animate={{ y: "0%" }}
                  exit={reduce ? { opacity: 0 } : { y: "-115%" }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  {GREETINGS[i]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
