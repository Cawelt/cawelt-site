"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Circle,
  Shapes,
  Type,
  RectangleHorizontal,
  Component,
  LayoutDashboard,
  PenTool,
  Braces,
  MonitorSmartphone,
  Rocket,
  Sparkles,
  RotateCcw,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/lib/site";

// matter-js yalnızca tip için statik import edilir (derlemede silinir); çalışma
// zamanında tarayıcıda dynamic import() ile yüklenir — ana paket boyutuna etki yok.
import type * as MatterNS from "matter-js";

// ---------------------------------------------------------------------------
// Tasarım → ürün merdiveni. İki aynı disk birleşince bir üst seviyeye çıkar.
// ---------------------------------------------------------------------------
type Tier = {
  label: string;
  Icon: LucideIcon;
  /** Sanal yarıçap (PLAY_W referans alınarak). */
  r: number;
  /** Disk dolgu rengi (açık) ve kenar tonu (koyu). */
  accent: string;
  deep: string;
};

const TIERS: Tier[] = [
  { label: "Piksel", Icon: Circle, r: 16, accent: "#9a9aa2", deep: "#6f6f77" },
  { label: "İkon", Icon: Shapes, r: 23, accent: "#b8b0a4", deep: "#8f8576" },
  { label: "Tipografi", Icon: Type, r: 31, accent: "#cdbf9e", deep: "#a3946f" },
  { label: "Buton", Icon: RectangleHorizontal, r: 40, accent: "#ddcfa4", deep: "#b3a173" }, // prettier-ignore
  { label: "Bileşen", Icon: Component, r: 50, accent: "#e6d29c", deep: "#bfa667" },
  { label: "Sayfa", Icon: LayoutDashboard, r: 61, accent: "#efd595", deep: "#c8a955" },
  { label: "Tasarım", Icon: PenTool, r: 73, accent: "#f3c877", deep: "#cf9a3c" },
  { label: "Kod", Icon: Braces, r: 86, accent: "#f5b95c", deep: "#d18327" },
  { label: "Cihaz", Icon: MonitorSmartphone, r: 100, accent: "#f3a23f", deep: "#cc6f1c" }, // prettier-ignore
  { label: "Yayın", Icon: Rocket, r: 115, accent: "#f08a2a", deep: "#c25812" },
  { label: "CAWELT", Icon: Sparkles, r: 130, accent: "#ffd35e", deep: "#e0a01f" },
];

const MAX_TIER = TIERS.length - 1;
const POINTS = [0, 1, 3, 6, 10, 16, 24, 34, 46, 60, 80];
const CAWELT_POP_BONUS = 240;
// En küçük 4 seviye düşürülür, küçüklere ağırlık verilir.
const SPAWN_POOL = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3];

// Sanal oyun alanı (fizik bu sabit çözünürlükte çalışır, görsel ölçeklenir).
const PLAY_W = 480;
const PLAY_H = 680;
const DROP_Y = 48;
const DANGER_Y = 112;
const DROP_COOLDOWN = 340; // ms
const SPEED_REST = 0.7; // bu hızın altındaki disk "oturmuş" sayılır
const OVER_DELAY = 1800; // tehlike çizgisi üstünde bu süre kalınca biter
const COMBO_WINDOW = 1300; // ms — bu süre içinde gelen birleşmeler combo sayar
const HS_KEY = "cawelt-merge-highscore";

// SSR'da useLayoutEffect uyarı verir; istemcide layout-effect (boyamadan önce
// ölçek hesabı), sunucuda no-op useEffect.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const randSpawn = () => SPAWN_POOL[Math.floor(Math.random() * SPAWN_POOL.length)];

type Status = "loading" | "ready" | "playing" | "paused" | "over";
type DiscData = { id: number; tier: number };
type BodyPlugin = { id: number; tier: number };

export default function MergeGame() {
  const [status, setStatus] = useState<Status>("loading");
  const [discs, setDiscs] = useState<DiscData[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [currentTier, setCurrentTier] = useState(0);
  const [queue, setQueue] = useState<number[]>([0, 0]);
  const [combo, setCombo] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [muted, setMuted] = useState(true);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);
  const [newRecord, setNewRecord] = useState(false);

  // --- Refs (her karede React'i yeniden çalıştırmamak için) -----------------
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null); // sarsılan dış kutu
  const fieldRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const dangerRef = useRef<HTMLDivElement>(null);

  const MatterRef = useRef<typeof MatterNS | null>(null);
  const engineRef = useRef<MatterNS.Engine | null>(null);
  const bodiesRef = useRef<Map<number, MatterNS.Body>>(new Map());
  const nodesRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const pendingMergesRef = useRef<Array<{ a: number; b: number }>>([]);
  const queuedRef = useRef<Set<number>>(new Set());

  const idRef = useRef(1);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef(0);
  const lastDropRef = useRef(0);
  const dangerAccumRef = useRef(0);
  const pointerXRef = useRef(PLAY_W / 2);

  const statusRef = useRef<Status>("loading");
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const currentTierRef = useRef(0);
  const queueRef = useRef<number[]>([0, 0]);
  const comboRef = useRef(0);
  const lastMergeTsRef = useRef(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxReachedRef = useRef(0);
  const mutedRef = useRef(true);
  const audioRef = useRef<AudioContext | null>(null);
  const newRecordRef = useRef(false);

  // --- Yardımcılar ----------------------------------------------------------
  const applyTransform = useCallback(
    (node: HTMLDivElement, body: MatterNS.Body, r: number) => {
      node.style.transform = `translate(${body.position.x - r}px, ${
        body.position.y - r
      }px)`;
    },
    [],
  );

  const vibrate = useCallback((ms: number) => {
    try {
      navigator.vibrate?.(ms);
    } catch {
      /* desteklenmiyor */
    }
  }, []);

  // Sentezlenmiş ses efektleri (asset yok)
  const sound = useCallback(
    (kind: "merge" | "drop" | "over" | "record" | "cawelt", tier = 0) => {
      if (mutedRef.current) return;
      const ctx = audioRef.current;
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain).connect(ctx.destination);

      if (kind === "merge") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(190 + tier * 46, t);
        osc.frequency.exponentialRampToValueAtTime(360 + tier * 70, t + 0.12);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (kind === "drop") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.1);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.16);
      } else if (kind === "record" || kind === "cawelt") {
        osc.type = "triangle";
        const base = kind === "cawelt" ? 520 : 440;
        [0, 0.08, 0.16].forEach((d, i) => {
          osc.frequency.setValueAtTime(base * (1 + i * 0.26), t + d);
        });
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
        osc.start(t);
        osc.stop(t + 0.44);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.5);
        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        osc.start(t);
        osc.stop(t + 0.58);
      }
    },
    [],
  );

  const spawnRing = useCallback(
    (x: number, y: number, color: string, r: number) => {
      const field = fieldRef.current;
      if (!field) return;
      const ring = document.createElement("div");
      ring.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${
        r * 2
      }px;height:${r * 2}px;border-radius:9999px;pointer-events:none;border:2px solid ${color};box-shadow:0 0 26px ${color};animation:game-ring .5s var(--ease-out-expo) forwards;`;
      field.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove());
    },
    [],
  );

  const spawnBurst = useCallback(
    (x: number, y: number, color: string, count: number) => {
      const field = fieldRef.current;
      if (!field) return;
      for (let i = 0; i < count; i++) {
        const ang = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        const dist = 26 + Math.random() * 46;
        const s = document.createElement("div");
        const size = 4 + Math.random() * 5;
        s.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:9999px;pointer-events:none;background:${color};box-shadow:0 0 8px ${color};--dx:${
          Math.cos(ang) * dist
        }px;--dy:${
          Math.sin(ang) * dist
        }px;animation:game-spark ${0.45 + Math.random() * 0.25}s ease-out forwards;`;
        field.appendChild(s);
        s.addEventListener("animationend", () => s.remove());
      }
    },
    [],
  );

  const spawnFloat = useCallback(
    (x: number, y: number, text: string, color: string) => {
      const field = fieldRef.current;
      if (!field) return;
      const el = document.createElement("div");
      el.textContent = text;
      el.style.cssText = `position:absolute;left:${x}px;top:${y}px;pointer-events:none;font-family:var(--font-mono),monospace;font-size:18px;font-weight:600;color:${color};text-shadow:0 2px 8px rgba(0,0,0,.6);animation:game-float-up .8s ease-out forwards;`;
      field.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    },
    [],
  );

  const shake = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    box.classList.remove("game-shake");
    void box.offsetWidth; // reflow → animasyonu yeniden tetikle
    box.classList.add("game-shake");
  }, []);

  const addScore = useCallback(
    (gain: number) => {
      scoreRef.current += gain;
      setScore(scoreRef.current);
      if (scoreRef.current > bestRef.current) {
        const wasBehind = bestRef.current > 0 && !newRecordRef.current;
        bestRef.current = scoreRef.current;
        setBest(scoreRef.current);
        if (wasBehind) {
          newRecordRef.current = true;
          setNewRecord(true);
          sound("record");
        }
        try {
          localStorage.setItem(HS_KEY, String(scoreRef.current));
        } catch {
          /* localStorage kapalı olabilir — yok say */
        }
      }
    },
    [sound],
  );

  const createDisc = useCallback((tier: number, x: number, y: number) => {
    const Matter = MatterRef.current;
    const engine = engineRef.current;
    if (!Matter || !engine) return;
    const id = idRef.current++;
    const body = Matter.Bodies.circle(x, y, TIERS[tier].r, {
      restitution: 0.08,
      friction: 0.35,
      frictionStatic: 0.6,
      density: 0.001,
      slop: 0.02,
    });
    Matter.Body.setInertia(body, Infinity); // dönmesin → ikon hep dik
    (body.plugin as BodyPlugin) = { id, tier };
    Matter.Composite.add(engine.world, body);
    bodiesRef.current.set(id, body);
    setDiscs((prev) => [...prev, { id, tier }]);
    if (tier > maxReachedRef.current) {
      maxReachedRef.current = tier;
      setMaxReached(tier);
    }
    return id;
  }, []);

  const removeBody = useCallback((id: number) => {
    const Matter = MatterRef.current;
    const engine = engineRef.current;
    const body = bodiesRef.current.get(id);
    if (Matter && engine && body) Matter.Composite.remove(engine.world, body);
    bodiesRef.current.delete(id);
  }, []);

  const drop = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const now = performance.now();
    if (now - lastDropRef.current < DROP_COOLDOWN) return;
    lastDropRef.current = now;
    const tier = currentTierRef.current;
    const r = TIERS[tier].r;
    const x = clamp(pointerXRef.current, r + 2, PLAY_W - r - 2);
    createDisc(tier, x, DROP_Y);
    sound("drop");
    // kuyruğu kaydır
    const q = queueRef.current;
    const nextCur = q[0];
    const newQueue = [q[1], randSpawn()];
    currentTierRef.current = nextCur;
    queueRef.current = newQueue;
    setCurrentTier(nextCur);
    setQueue(newQueue);
  }, [createDisc, sound]);

  const endGame = useCallback(() => {
    if (statusRef.current === "over") return;
    statusRef.current = "over";
    setStatus("over");
    sound("over");
    shake();
  }, [shake, sound]);

  const begin = useCallback(() => {
    // ses bağlamını kullanıcı hareketiyle uyandır (tarayıcı politikası)
    audioRef.current?.resume?.();
    bodiesRef.current.forEach((_, id) => removeBody(id));
    bodiesRef.current.clear();
    pendingMergesRef.current = [];
    queuedRef.current.clear();
    setDiscs([]);
    scoreRef.current = 0;
    setScore(0);
    dangerAccumRef.current = 0;
    lastDropRef.current = 0;
    comboRef.current = 0;
    setCombo(0);
    maxReachedRef.current = 0;
    setMaxReached(0);
    newRecordRef.current = false;
    setNewRecord(false);
    setCopied(false);
    const c = randSpawn();
    const q = [randSpawn(), randSpawn()];
    currentTierRef.current = c;
    queueRef.current = q;
    setCurrentTier(c);
    setQueue(q);
    statusRef.current = "playing";
    setStatus("playing");
  }, [removeBody]);

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") {
      statusRef.current = "paused";
      setStatus("paused");
    } else if (statusRef.current === "paused") {
      statusRef.current = "playing";
      setStatus("playing");
    }
  }, []);

  // --- Pointer ---------------------------------------------------------------
  const mapX = useCallback((clientX: number) => {
    const field = fieldRef.current;
    if (!field) return PLAY_W / 2;
    const rect = field.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * PLAY_W;
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      pointerXRef.current = mapX(e.clientX);
    },
    [mapX],
  );
  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      pointerXRef.current = mapX(e.clientX);
    },
    [mapX],
  );
  const onPointerUp = useCallback(
    (e: ReactPointerEvent) => {
      pointerXRef.current = mapX(e.clientX);
      drop();
    },
    [drop, mapX],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      mutedRef.current = next;
      if (!next && !audioRef.current) {
        try {
          const Ctx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          audioRef.current = new Ctx();
        } catch {
          /* WebAudio yoksa sessiz kal */
        }
      }
      audioRef.current?.resume?.();
      return next;
    });
  }, []);

  const share = useCallback(async () => {
    const text = `CAWELT "Birleştir" oyununda ${scoreRef.current} puan yaptım! Sen de dene:`;
    const url = `${site.url}/oyun`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "CAWELT · Birleştir", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* kullanıcı iptal etti / izin yok — sessiz geç */
    }
  }, []);

  // --- Yüksek skoru yükle ----------------------------------------------------
  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(HS_KEY));
      if (Number.isFinite(stored) && stored > 0) {
        bestRef.current = stored;
        setBest(stored);
      }
    } catch {
      /* yok say */
    }
  }, []);

  // --- Ölçek (responsive) ----------------------------------------------------
  useIsoLayoutEffect(() => {
    const recompute = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const availW = wrap.clientWidth;
      const availH = window.innerHeight * 0.72;
      setScale(Math.min(1, availW / PLAY_W, availH / PLAY_H));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", recompute);
    window.addEventListener("orientationchange", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
      window.removeEventListener("orientationchange", recompute);
    };
  }, []);

  // --- Motor kurulumu --------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const Matter = await import("matter-js");
      if (cancelled) return;
      MatterRef.current = Matter;

      const engine = Matter.Engine.create();
      engine.gravity.y = 1;
      engine.world.gravity.scale = 0.0011;
      engineRef.current = engine;

      const wallOpts = { isStatic: true, friction: 0.4, restitution: 0 };
      Matter.Composite.add(engine.world, [
        Matter.Bodies.rectangle(PLAY_W / 2, PLAY_H + 30, PLAY_W + 160, 60, wallOpts), // prettier-ignore
        Matter.Bodies.rectangle(-30, PLAY_H / 2, 60, PLAY_H * 2, wallOpts),
        Matter.Bodies.rectangle(PLAY_W + 30, PLAY_H / 2, 60, PLAY_H * 2, wallOpts), // prettier-ignore
      ]);

      // Birleşmeleri olay sırasında topla, kareden sonra işle (dünya güvenliği).
      Matter.Events.on(engine, "collisionStart", (evt) => {
        for (const pair of evt.pairs) {
          const pa = pair.bodyA.plugin as BodyPlugin | undefined;
          const pb = pair.bodyB.plugin as BodyPlugin | undefined;
          if (!pa || !pb) continue;
          if (pa.tier !== pb.tier) continue;
          if (queuedRef.current.has(pa.id) || queuedRef.current.has(pb.id))
            continue;
          queuedRef.current.add(pa.id);
          queuedRef.current.add(pb.id);
          pendingMergesRef.current.push({ a: pa.id, b: pb.id });
        }
      });

      const c = randSpawn();
      const q = [randSpawn(), randSpawn()];
      currentTierRef.current = c;
      queueRef.current = q;
      setCurrentTier(c);
      setQueue(q);
      statusRef.current = "ready";
      setStatus("ready");

      const tick = (ts: number) => {
        rafRef.current = requestAnimationFrame(tick);
        const dt = lastTsRef.current ? ts - lastTsRef.current : 16;
        lastTsRef.current = ts;
        // Matter ≤16.667ms önerir; üstünü sabitle → kare düşse de tünelleme yok.
        const step = Math.min(dt, 16.667);

        if (statusRef.current === "playing") {
          Matter.Engine.update(engine, step);
        }

        // Birleşmeleri işle (sadece oyun sürerken)
        const merges = pendingMergesRef.current;
        if (merges.length && statusRef.current === "playing") {
          pendingMergesRef.current = [];
          for (const m of merges) {
            const ba = bodiesRef.current.get(m.a);
            const bb = bodiesRef.current.get(m.b);
            queuedRef.current.delete(m.a);
            queuedRef.current.delete(m.b);
            if (!ba || !bb) continue;
            const tier = (ba.plugin as BodyPlugin).tier;
            const mx = (ba.position.x + bb.position.x) / 2;
            const my = (ba.position.y + bb.position.y) / 2;

            // Combo
            const now = performance.now();
            if (now - lastMergeTsRef.current < COMBO_WINDOW)
              comboRef.current += 1;
            else comboRef.current = 1;
            lastMergeTsRef.current = now;
            const mult = comboRef.current;
            setCombo(mult);
            if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
            comboTimerRef.current = setTimeout(() => setCombo(0), COMBO_WINDOW);

            removeBody(m.a);
            removeBody(m.b);
            setDiscs((prev) =>
              prev.filter((d) => d.id !== m.a && d.id !== m.b),
            );

            if (tier === MAX_TIER) {
              // İki CAWELT → patla, büyük bonus
              const gain = CAWELT_POP_BONUS * mult;
              addScore(gain);
              spawnRing(mx, my, "#ffd35e", 150);
              spawnBurst(mx, my, "#ffd35e", 18);
              spawnFloat(mx, my, `+${gain}`, "#ffd35e");
              sound("cawelt");
              shake();
              vibrate(60);
            } else {
              const newTier = tier + 1;
              createDisc(newTier, mx, my);
              const gain = (POINTS[newTier] ?? newTier) * mult;
              addScore(gain);
              spawnRing(mx, my, TIERS[newTier].accent, TIERS[newTier].r);
              spawnBurst(
                mx,
                my,
                TIERS[newTier].accent,
                Math.min(6 + newTier, 16),
              );
              spawnFloat(
                mx,
                my,
                mult > 1 ? `+${gain} ×${mult}` : `+${gain}`,
                mult > 1 ? "#ffd35e" : TIERS[newTier].accent,
              );
              sound("merge", newTier);
              vibrate(newTier >= 7 ? 28 : 10);
              if (newTier >= 6) shake();
            }
          }
        }

        // DOM senkronu + tehlike kontrolü
        let anyAbove = false;
        bodiesRef.current.forEach((body, id) => {
          const node = nodesRef.current.get(id);
          const tier = (body.plugin as BodyPlugin).tier;
          const r = TIERS[tier].r;
          if (node) applyTransform(node, body, r);
          if (statusRef.current === "playing") {
            const speed = Math.hypot(body.velocity.x, body.velocity.y);
            if (body.position.y - r < DANGER_Y && speed < SPEED_REST)
              anyAbove = true;
          }
        });

        if (statusRef.current === "playing") {
          if (anyAbove) {
            dangerAccumRef.current += step;
            if (dangerAccumRef.current > OVER_DELAY) endGame();
          } else {
            dangerAccumRef.current = 0;
          }
        }

        // Tehlike çizgisi parlaması
        const danger = dangerRef.current;
        if (danger) {
          const heat = clamp(dangerAccumRef.current / OVER_DELAY, 0, 1);
          danger.style.borderColor =
            heat > 0.05
              ? `rgba(255,107,61,${0.35 + heat * 0.6})`
              : "rgba(216,203,166,0.3)";
          danger.style.boxShadow =
            heat > 0.05 ? `0 0 ${8 + heat * 22}px rgba(255,107,61,${heat})` : "none"; // prettier-ignore
        }

        // Önizleme + kılavuz çizgisi pointer'ı takip etsin
        if (statusRef.current === "playing") {
          const r = TIERS[currentTierRef.current].r;
          const x = clamp(pointerXRef.current, r + 2, PLAY_W - r - 2);
          const preview = previewRef.current;
          if (preview)
            preview.style.transform = `translate(${x - r}px, ${DROP_Y - r}px)`;
          const guide = guideRef.current;
          if (guide) guide.style.transform = `translateX(${x}px)`;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      const Matter = MatterRef.current;
      const engine = engineRef.current;
      if (Matter && engine) {
        Matter.Events.off(engine, "collisionStart");
        Matter.Composite.clear(engine.world, false);
        Matter.Engine.clear(engine);
      }
      bodiesRef.current.clear();
      nodesRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Render ----------------------------------------------------------------
  const current = TIERS[currentTier];
  const overlayVisible = status !== "playing" && status !== "paused";
  const playable = status === "playing" || status === "paused";

  // Kontrol düğmeleri (mobil HUD + masaüstü panelde paylaşılır)
  const controlButtons = (
    <>
      <button
        type="button"
        onClick={togglePause}
        disabled={!playable}
        aria-label={status === "paused" ? "Devam et" : "Duraklat"}
        className="grid size-9 place-items-center rounded-xl border border-line text-mute transition-colors hover:text-bone disabled:opacity-40"
      >
        {status === "paused" ? <Play size={15} /> : <Pause size={15} />}
      </button>
      <button
        type="button"
        onClick={begin}
        aria-label="Yeni oyun"
        className="grid size-9 place-items-center rounded-xl border border-line text-mute transition-colors hover:text-bone"
      >
        <RotateCcw size={15} />
      </button>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Sesi aç" : "Sesi kapat"}
        className="grid size-9 place-items-center rounded-xl border border-line text-mute transition-colors hover:text-bone"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </>
  );

  const queueChips = (count: number, size: number) =>
    [currentTier, ...queue].slice(0, count).map((t, i) => {
      const T = TIERS[t];
      const sz = i === 0 ? size : Math.round(size * 0.72);
      return (
        <span
          key={i}
          className="grid shrink-0 place-items-center rounded-full"
          style={{
            width: sz,
            height: sz,
            opacity: i === 0 ? 1 : 0.55,
            background: `radial-gradient(circle at 35% 30%, #ffffffcc, ${T.accent} 62%, ${T.deep})`,
          }}
        >
          <T.Icon
            size={Math.round(sz * 0.5)}
            className="text-ink"
            strokeWidth={2}
          />
        </span>
      );
    });

  return (
    <div className="flex w-full flex-col items-center gap-5 lg:flex-row lg:items-start lg:justify-center">
      {/* Oyun alanı */}
      <div className="order-2 flex w-full flex-col items-center lg:order-1 lg:w-auto">
        {/* Mobil HUD */}
        <div
          className="mx-auto mb-3 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 lg:hidden"
          style={{ maxWidth: PLAY_W }}
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="eyebrow">Skor</p>
              {combo >= 2 && (
                <span
                  key={combo}
                  className="game-badge-pop rounded-full bg-champagne px-2 py-0.5 font-mono text-[0.62rem] font-bold text-ink"
                >
                  ×{combo}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-display text-3xl leading-none text-bone tabular-nums">
                {score}
              </p>
              <span
                className={`flex items-center gap-1 font-mono text-xs ${
                  newRecord ? "text-champagne" : "text-mute"
                }`}
              >
                <Trophy size={12} />
                {best}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">{queueChips(2, 32)}</div>
            <div className="flex items-center gap-1.5">{controlButtons}</div>
          </div>
        </div>

        <div ref={wrapRef} className="w-full" style={{ maxWidth: PLAY_W }}>
          <div
            ref={boxRef}
            style={{
              width: PLAY_W * scale,
              height: PLAY_H * scale,
              // Ölçek henüz hesaplanmadıysa bile kutu viewport'u asla aşmasın.
              maxWidth: "100%",
              marginInline: "auto",
              // transform:scale layout boyutunu küçültmez; iç alanın 480px'lik
              // layout taşmasını kırp → mobilde yatay kaydırma olmasın.
              overflow: "hidden",
            }}
          >
            <div
              ref={fieldRef}
              onPointerMove={onPointerMove}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              className="relative overflow-hidden rounded-card border border-line bg-ink-2 shadow-[inset_0_2px_40px_rgba(0,0,0,0.65)]"
              style={{
                width: PLAY_W,
                height: PLAY_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                touchAction: "none",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/3 size-80 -translate-x-1/2 rounded-full bg-champagne/10 blur-[100px]"
              />

              {/* Nişan kılavuz çizgisi */}
              {status === "playing" && (
                <div
                  ref={guideRef}
                  aria-hidden
                  className="pointer-events-none absolute top-0 h-full w-px"
                  style={{
                    left: 0,
                    transform: `translateX(${PLAY_W / 2}px)`,
                    background:
                      "linear-gradient(to bottom, rgba(216,203,166,0.45), rgba(216,203,166,0.04) 60%, transparent)",
                  }}
                />
              )}

              {/* Tehlike çizgisi */}
              <div
                ref={dangerRef}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 border-t border-dashed"
                style={{ top: DANGER_Y, borderColor: "rgba(216,203,166,0.3)" }}
              />

              {/* Önizleme (düşecek disk) */}
              {status === "playing" && (
                <div
                  ref={previewRef}
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 grid place-items-center rounded-full opacity-90"
                  style={{
                    width: current.r * 2,
                    height: current.r * 2,
                    transform: `translate(${PLAY_W / 2 - current.r}px, ${
                      DROP_Y - current.r
                    }px)`,
                    background: `radial-gradient(circle at 35% 30%, #ffffffcc, ${current.accent} 60%, ${current.deep})`,
                    boxShadow: `0 0 22px ${current.accent}66`,
                  }}
                >
                  <current.Icon
                    size={Math.round(current.r * 0.95)}
                    className="text-ink"
                    strokeWidth={1.8}
                  />
                </div>
              )}

              {/* Diskler */}
              {discs.map((d) => (
                <Disc
                  key={d.id}
                  data={d}
                  register={(el) => {
                    if (el) {
                      nodesRef.current.set(d.id, el);
                      const body = bodiesRef.current.get(d.id);
                      if (body) applyTransform(el, body, TIERS[d.tier].r);
                    } else {
                      nodesRef.current.delete(d.id);
                    }
                  }}
                />
              ))}

              {/* Duraklat */}
              {status === "paused" && (
                <div className="absolute inset-0 grid place-items-center bg-ink/70 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink transition-transform active:scale-95"
                  >
                    <Play size={16} />
                    Devam et
                  </button>
                </div>
              )}

              {/* Başla / Yükleniyor / Oyun bitti */}
              {overlayVisible && (
                <div className="absolute inset-0 grid place-items-center bg-ink/80 px-6 backdrop-blur-sm">
                  {status === "loading" ? (
                    <p className="font-mono text-sm text-mute">Yükleniyor…</p>
                  ) : status === "ready" ? (
                    <div className="text-center">
                      <p className="eyebrow mb-3">CAWELT · Birleştir</p>
                      <h2 className="headline text-5xl text-bone">
                        Pikselden
                        <br />
                        <span className="headline-serif text-champagne">
                          ürüne
                        </span>
                      </h2>
                      <p className="mx-auto mt-4 max-w-xs text-sm text-bone-muted">
                        Aynı ikonları birleştir, büyüt. Üst üste birleşmeler
                        combo yapar. Tehlike çizgisini aşma!
                      </p>
                      <button
                        type="button"
                        onClick={begin}
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-bone px-7 py-3 text-sm font-medium text-ink transition-transform active:scale-95"
                      >
                        <Play size={16} />
                        Başla
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="eyebrow mb-3">
                        {newRecord ? "🎉 Yeni rekor!" : "Oyun bitti"}
                      </p>
                      <p className="font-display text-7xl leading-none text-bone tabular-nums">
                        {score}
                      </p>
                      <p className="mt-3 font-mono text-xs text-mute">
                        En yüksek skor: {best}
                      </p>
                      <div className="mt-8 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={begin}
                          className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink transition-transform active:scale-95"
                        >
                          <RotateCcw size={15} />
                          Tekrar oyna
                        </button>
                        <button
                          type="button"
                          onClick={share}
                          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-bone"
                        >
                          <Share2 size={15} />
                          {copied ? "Kopyalandı" : "Paylaş"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* İpucu */}
        <p
          className="mx-auto mt-4 text-center font-mono text-xs text-mute"
          style={{ maxWidth: PLAY_W * scale }}
        >
          Tıkla / dokun → bırak · yatay gezdir → nişan al
        </p>
      </div>

      {/* Masaüstü kontrol paneli */}
      <aside className="order-1 hidden lg:order-2 lg:block lg:w-[260px]">
        <div className="flex flex-col gap-3">
          {/* Skor */}
          <div className="rounded-card border border-line bg-surface/60 p-4">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Skor</p>
              {combo >= 2 && (
                <span
                  key={combo}
                  className="game-badge-pop rounded-full bg-champagne px-2 py-0.5 font-mono text-[0.7rem] font-bold text-ink"
                >
                  COMBO ×{combo}
                </span>
              )}
            </div>
            <p className="mt-1 font-display text-5xl leading-none text-bone tabular-nums">
              {score}
            </p>
            <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-mute">
              <Trophy size={13} className={newRecord ? "text-champagne" : ""} />
              <span className={newRecord ? "text-champagne" : ""}>{best}</span>
            </div>
          </div>

          {/* Sıradaki kuyruğu */}
          <div className="rounded-card border border-line bg-surface/60 p-4">
            <p className="eyebrow mb-3">Sıradaki</p>
            <div className="flex items-center gap-3">{queueChips(3, 40)}</div>
          </div>

          {/* Kontroller */}
          <div className="flex items-center justify-between gap-2 rounded-card border border-line bg-surface/60 p-3">
            {controlButtons}
          </div>

          {/* Seviye merdiveni */}
          <div className="rounded-card border border-line bg-surface/60 p-4">
            <p className="eyebrow mb-3">Merdiven</p>
            <ol className="flex flex-col gap-1.5">
              {TIERS.map((t, i) => {
                const reached = i <= maxReached;
                return (
                  <li
                    key={t.label}
                    className="flex items-center gap-2"
                    style={{ opacity: reached ? 1 : 0.32 }}
                  >
                    <span
                      className="grid size-6 shrink-0 place-items-center rounded-full"
                      style={{
                        background: reached
                          ? `radial-gradient(circle at 35% 30%, #ffffffcc, ${t.accent} 62%, ${t.deep})`
                          : "var(--color-line)",
                      }}
                    >
                      <t.Icon
                        size={12}
                        className={reached ? "text-ink" : "text-mute"}
                        strokeWidth={2}
                      />
                    </span>
                    <span className="font-mono text-xs text-bone-muted">
                      {t.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Tek disk — DOM düğümü kaydedilir, konumu motor döngüsünde imperatif güncellenir.
function Disc({
  data,
  register,
}: {
  data: DiscData;
  register: (el: HTMLDivElement | null) => void;
}) {
  const tier = TIERS[data.tier];
  return (
    <div
      ref={register}
      className="absolute left-0 top-0 will-change-transform"
      style={{ width: tier.r * 2, height: tier.r * 2 }}
    >
      <div
        className="game-pop-in grid size-full place-items-center rounded-full"
        style={{
          background: `radial-gradient(circle at 34% 28%, #ffffffd9, ${tier.accent} 58%, ${tier.deep} 100%)`,
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: `inset 0 2px 6px rgba(255,255,255,0.5), 0 3px 10px rgba(0,0,0,0.45), 0 0 ${
            tier.r * 0.4
          }px ${tier.accent}44`,
        }}
      >
        <tier.Icon
          size={Math.round(tier.r * 0.92)}
          className="text-ink"
          strokeWidth={1.7}
          absoluteStrokeWidth
        />
      </div>
    </div>
  );
}
