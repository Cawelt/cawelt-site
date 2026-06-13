export const site = {
  name: "CAWELT",
  suffix: "studio",
  legal: "Cawelt Studio",
  // Canonical production URL — used by metadata, robots, sitemap and JSON-LD.
  url: "https://cawelt.com",
  locale: "tr_TR",
  tagline:
    "Web, mobil ve özel sistemler için tasarım odaklı yazılım stüdyosu.",
  description:
    "Markaların dijital varlığını sıfırdan kuruyoruz: özel tasarım web siteleri, native hisli mobil uygulamalar ve birbiriyle konuşan panel + API sistemleri.",
  email: "info@cawelt.com",
  phone: "+90 505 985 17 56",
  city: "Kocaeli & İstanbul, Türkiye",
  keywords: [
    "yazılım stüdyosu",
    "web tasarım",
    "web sitesi geliştirme",
    "özel tasarım web sitesi",
    "mobil uygulama geliştirme",
    "React Native",
    "Next.js",
    "Laravel",
    "panel ve API geliştirme",
    "kurumsal web sitesi",
    "UI/UX tasarım",
    "Kocaeli yazılım ajansı",
    "İstanbul yazılım ajansı",
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/cawelt.co" },
  ],
} as const;

export const nav = [
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Çalışmalar", href: "/calismalar" },
  { label: "Süreç", href: "/surec" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "Oyun", href: "/oyun" },
  { label: "İletişim", href: "/iletisim" },
] as const;

export const services = [
  {
    id: "web",
    index: "01",
    title: "Web Siteleri",
    short: "Markanı temsil eden, özel tasarım web deneyimleri.",
    long:
      "Şablon yok. Her proje sıfırdan tasarlanır, kendi animasyon ve etkileşim diline sahiptir. Performans, erişilebilirlik ve SEO ilk günden itibaren mimarinin bir parçasıdır.",
    bullets: [
      "Özel tasarım & art direction",
      "Next.js, React, TypeScript",
      "CMS entegrasyonu (Sanity, Strapi, Payload)",
      "Animasyon & 3D (Framer Motion, Three.js)",
      "Core Web Vitals odaklı performans",
    ],
  },
  {
    id: "mobil",
    index: "02",
    title: "Mobil Uygulamalar",
    short: "iOS ve Android'de native hisli, akıcı uygulamalar.",
    long:
      "Tek kod tabanından iki platforma; ama hiçbir zaman 'cross-platform' kompromisi gibi hissetmeyen ürünler kuruyoruz. Animasyon, dokunma akışı ve performans detayları el işçiliğiyle çözülür.",
    bullets: [
      "React Native & Expo",
      "SwiftUI / Kotlin (gerektiğinde)",
      "Tasarım sistemi & motion guideline",
      "App Store & Play Store yayını",
      "Analitik, push, in-app messaging",
    ],
  },
  {
    id: "panel-api",
    index: "03",
    title: "Web Panel + API Sistemleri",
    short: "Panel, mobil ve API'nın tek bir ürün gibi konuştuğu sistemler.",
    long:
      "Yönetim paneli ile mobil uygulamayı tek bir ekosistem olarak tasarlıyoruz. API'lar arka planda değil, ürünün omurgası olarak ele alınır; veri modeli, yetkilendirme ve gerçek zamanlı senkron baştan kurgulanır.",
    bullets: [
      "Admin panel (Next.js + shadcn/ui)",
      "REST & GraphQL API tasarımı",
      "Auth, rol, çok kiracılı (multi-tenant) yapı",
      "Postgres, Redis, S3 altyapısı",
      "Realtime senkron (Websocket / SSE)",
    ],
  },
] as const;

export const projects = [
  {
    slug: "turkwaelz",
    client: "Turkwaelz",
    title: "Çinko geri dönüşümü firması için kurumsal web sitesi",
    discipline: ["Web"],
    year: "2026",
    accent: "#2FA84F",
    href: "https://turkwaelz.com",
    image: "/work/turkwaelz.png",
    status: "live",
  },
  {
    slug: "dusun",
    client: "Düşün",
    title: "Okul öncesi eğitim kurumu için web sitesi",
    discipline: ["Web"],
    year: "2026",
    accent: "#4FB6A8",
    href: "https://dusun.com.tr",
    image: "/work/dusun.png",
    status: "live",
  },
  {
    slug: "kocaelispor",
    client: "Kocaelispor",
    title: "Kocaelispor için resmi kulüp web sitesi",
    discipline: ["Web"],
    year: "2026",
    accent: "#1FA34A",
    status: "in-progress",
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Keşif",
    body:
      "İş hedeflerini, kullanıcıyı ve teknik kısıtları bir hafta boyunca derinlemesine kazıyoruz. Çıktı: ortak bir kelime dağarcığı ve net bir kapsam.",
  },
  {
    step: "02",
    title: "Strateji",
    body:
      "Bilgi mimarisi, kullanıcı akışları ve marka diline dair erken kararlar burada alınır. Yanlış sayfada uzun saatler harcamamak için.",
  },
  {
    step: "03",
    title: "Tasarım",
    body:
      "Düşük kaliteli wireframe yok. Tasarım sistemi ve motion guideline ile beraber yüksek aslına uygun ekranlar üretilir.",
  },
  {
    step: "04",
    title: "Geliştirme",
    body:
      "Tasarım kararları kodda korunur. Web, mobil ve API tek ekip tarafından, paralel sprint'lerle inşa edilir.",
  },
  {
    step: "05",
    title: "Yayın & Bakım",
    body:
      "Yayın bir bitiş değil, ürünün ilk haftası. Analitik, A/B testleri ve haftalık iterasyonla canlı tutarız.",
  },
] as const;

export const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "React Native",
  "Expo",
  "Tailwind CSS",
  "Framer Motion",
  "Three.js",
  "Node.js",
  "PHP",
  "Laravel",
  "Livewire",
  "Filament",
  "MySQL",
  "PostgreSQL",
  "Prisma",
  "tRPC",
  "GraphQL",
  "Redis",
  "AWS",
  "Vercel",
  "Cloudflare",
  "Stripe",
  "Sanity",
  "Figma",
] as const;

export const values = [
  {
    title: "Tasarım, sonradan eklenen bir katman değil.",
    body:
      "Tasarımcı ve geliştirici aynı odadadır. Etkileşim, performans ve görsel dilden ayrı düşünülmez.",
  },
  {
    title: "Az ama derin.",
    body:
      "Aynı anda yalnızca birkaç projeye odaklanırız. Bu sayede her iş, kendi ekibinin kıymetli zamanını alır.",
  },
  {
    title: "Ürün gibi düşün, stüdyo gibi yap.",
    body:
      "Hizmet veriyor olsak da her projeye sahibiymiş gibi yaklaşırız. Yayın sonrası iyileştirme dahildir.",
  },
  {
    title: "Şeffaflık varsayılandır.",
    body:
      "Süreç, tahminler, riskler ve kararlar yazılı paylaşılır. Sürpriz fatura ya da gizli karar yoktur.",
  },
] as const;
