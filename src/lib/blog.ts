import { site } from "@/lib/site";

/**
 * Blog altyapısı — içerik veri katmanı.
 *
 * Yazılar burada tipli veri olarak tutulur. Her yazı, gövdesini anlamsal
 * (semantic) HTML'e dönüşen blok dizisi olarak tanımlar; bu sayede başlık
 * hiyerarşisi, iç linkler ve yapısal veri (JSON-LD) SEO için tam kontrol
 * altındadır. Yeni yazı eklemek için `posts` dizisine yeni bir `BlogPost`
 * eklemek yeterlidir — route, sitemap, RSS ve metadata otomatik güncellenir.
 */

export type BlogBlock =
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; text: string }
  | { type: "code"; lang?: string; code: string }
  // CRM zengin metin (HTML) gönderdiğinde kullanılır. İçerik güvenilir
  // (panel kullanıcıları) varsayılır; dışarıdan gelirse sanitize edin.
  | { type: "html"; html: string };

export type BlogFaq = { q: string; a: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description + liste/özet metni. ~150-160 karakter ideal. */
  description: string;
  category: string;
  tags: string[];
  author: string;
  /** ISO 8601 — örn. "2026-02-18". */
  publishedAt: string;
  /** Güncellenen yazılar için ISO 8601. Yoksa publishedAt kullanılır. */
  updatedAt?: string;
  /** /public altındaki kapak görseli yolu. Opsiyonel. */
  cover?: string;
  /** Sıkça sorulan sorular — FAQPage yapısal verisi olarak yayınlanır. */
  faq?: BlogFaq[];
  body: BlogBlock[];
};

/** Türkçe karakterleri de doğru ele alan slug üretici (başlık id'leri için). */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return input
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => map[m] ?? m)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const WORDS_PER_MINUTE = 200;

/** Gövdedeki metin bloklarından tahmini okuma süresini (dakika) hesaplar. */
export function readingTimeMinutes(post: BlogPost): number {
  const words = post.body.reduce((total, block) => {
    switch (block.type) {
      case "lead":
      case "p":
      case "h2":
      case "h3":
      case "quote":
      case "callout":
        return total + block.text.trim().split(/\s+/).length;
      case "ul":
      case "ol":
        return total + block.items.join(" ").trim().split(/\s+/).length;
      case "code":
        return total + block.code.trim().split(/\s+/).length;
      case "html":
        return total + block.html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
      default:
        return total;
    }
  }, 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** İçindekiler için h2 başlıklarını {text, id} olarak döndürür. */
export function tableOfContents(post: BlogPost): { text: string; id: string }[] {
  return post.body
    .filter((b): b is Extract<BlogBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ text: b.text, id: slugify(b.text) }));
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

/** Yazının kanonik (mutlak) URL'i. */
export function postUrl(post: BlogPost): string {
  return `${site.url}/blog/${post.slug}`;
}

// ---------------------------------------------------------------------------
// İçerik
// ---------------------------------------------------------------------------

// CRM erişilemediğinde / yapılandırılmadığında devreye giren yerel içerik.
const localPosts: BlogPost[] = [
  {
    slug: "donusturen-landing-page-tasarimi",
    title: "Dönüşüm getiren açılış sayfası (landing page) nasıl tasarlanır?",
    description:
      "Yüksek dönüşümlü bir açılış sayfasının anatomisi: tek hedef, güçlü başlık, sosyal kanıt, net CTA ve hız. Pratik bir kontrol listesiyle.",
    category: "Rehber",
    tags: ["landing page", "açılış sayfası", "dönüşüm", "UX", "web tasarım"],
    author: site.legal,
    publishedAt: "2026-06-12",
    cover: "/blog-covers/donusturen-landing-page.svg",
    faq: [
      {
        q: "Açılış sayfası ile normal web sitesi arasındaki fark nedir?",
        a: "Web sitesi çok amaçlıdır ve gezinmeye açıktır; açılış sayfası ise tek bir hedefe (form doldurma, satın alma, randevu) odaklanır. Dikkat dağıtan menü ve linkler kasıtlı olarak azaltılır.",
      },
      {
        q: "Bir açılış sayfasında kaç tane CTA olmalı?",
        a: "Tek bir birincil eylem olmalı; bu eylem sayfa boyunca birkaç kez tekrar edebilir ama hep aynı hedefi göstermelidir. Farklı yönlere çeken çoklu CTA dönüşümü düşürür.",
      },
      {
        q: "Açılış sayfası hızı dönüşümü etkiler mi?",
        a: "Evet, doğrudan. Yüklenme süresi arttıkça hemen çıkma oranı yükselir. İlk ekranın 2,5 saniyenin altında yüklenmesi (LCP) dönüşüm için kritik bir eşiktir.",
      },
    ],
    body: [
      {
        type: "lead",
        text: "İyi bir açılış sayfası bir broşür değil, bir karar makinesidir. Ziyaretçiyi tek bir eyleme taşımak için tasarlanır — ne eksik, ne fazla. İşte yüksek dönüşümlü bir açılış sayfasının anatomisi ve uygulayabileceğin bir kontrol listesi.",
      },
      { type: "h2", text: "1. Tek sayfa, tek hedef" },
      {
        type: "p",
        text: "Açılış sayfasının en büyük gücü odaktır. Menüyü, ilgisiz linkleri ve “keşfet” davetlerini kaldır. Ziyaretçinin yapabileceği tek anlamlı şey, senin istediğin eylem olmalı: form doldurmak, randevu almak ya da satın almak.",
      },
      { type: "h2", text: "2. İlk ekran (hero) 5 saniyede ikna etmeli" },
      {
        type: "p",
        text: "Ziyaretçi kaydırmadan önce üç soruyu yanıtlamalısın: **Bu ne?**, **bana ne faydası var?**, **şimdi ne yapmalıyım?**. Net bir başlık, destekleyici tek cümle ve görünür bir [çağrı butonu](/iletisim) yeterlidir.",
      },
      {
        type: "ul",
        items: [
          "Başlık: sonucu/faydayı söyle, özelliği değil",
          "Alt başlık: kime, neden uygun olduğunu netleştir",
          "CTA: tek, belirgin ve eylem odaklı (“Brifini gönder” gibi)",
        ],
      },
      { type: "h2", text: "3. Sosyal kanıt güveni inşa eder" },
      {
        type: "p",
        text: "İnsanlar başkalarının kararına güvenir. Gerçek müşteri yorumları, logolar, vaka çalışmaları ve sayısal sonuçlar (“%40 dönüşüm artışı”) şüpheyi azaltır. [Çalışmalarımız](/calismalar) sayfası bunun bir örneğidir.",
      },
      {
        type: "callout",
        text: "İpucu: Sosyal kanıtı CTA’nın hemen yakınına koy. Karar anında görülen bir referans, tereddüdü en çok azaltan unsurdur.",
      },
      { type: "h2", text: "4. İtirazları önceden karşıla" },
      {
        type: "p",
        text: "Her ziyaretçinin aklında bir “ama” vardır: fiyat, süre, risk. Bunları sayfada açıkça yanıtla — SSS bölümü, garanti, şeffaf süreç. Cevaplanmamış itiraz, kaybedilmiş dönüşümdür.",
      },
      { type: "h2", text: "5. Tek ve tekrar eden çağrı (CTA)" },
      {
        type: "p",
        text: "Birincil eylemi sayfa boyunca birkaç kez tekrarla ama hep aynı hedefe götür. Farklı yönlere çeken çoklu butonlar kararsızlık yaratır.",
      },
      { type: "h2", text: "6. Hız bir tasarım kararıdır" },
      {
        type: "p",
        text: "En güzel açılış sayfası bile yavaşsa dönüşmez. Görselleri optimize et, gereksiz script’leri at, ilk ekranı hızlı yükle. Teknik tarafı derinleştiren [Next.js ile teknik SEO](/blog/nextjs-ile-teknik-seo) yazımıza göz at.",
      },
      {
        type: "quote",
        text: "Dönüşüm, ikna edici bir cümle değil; sürtünmenin ortadan kalktığı andır. Her gereksiz alan, her saniye gecikme bir miktar dönüşüm sızdırır.",
      },
      { type: "h2", text: "Hızlı kontrol listesi" },
      {
        type: "ol",
        items: [
          "Sayfanın tek bir net hedefi var mı?",
          "İlk ekran 5 saniyede “ne/neden/şimdi ne”yi yanıtlıyor mu?",
          "Sosyal kanıt CTA’ya yakın mı?",
          "Başlıca itirazlar yanıtlanmış mı?",
          "Tek bir birincil CTA tekrar ediyor mu?",
          "İlk ekran 2,5 sn altında yükleniyor mu?",
        ],
      },
      {
        type: "p",
        text: "Dönüşüm odaklı bir açılış sayfasına mı ihtiyacın var? Birlikte kurgulayalım — [bize bir brif gönder](/iletisim).",
      },
    ],
  },
  {
    slug: "kurumsal-web-sitesi-maliyeti-2026",
    title: "Kurumsal web sitesi maliyeti 2026: fiyatı belirleyen 7 faktör",
    description:
      "2026'da kurumsal bir web sitesi ne kadara mal olur? Fiyatı belirleyen kapsam, tasarım, içerik ve bakım faktörlerini şeffaf biçimde açıklıyoruz.",
    category: "Rehber",
    tags: ["web tasarım", "kurumsal web sitesi", "fiyatlandırma", "bütçe"],
    author: site.legal,
    publishedAt: "2026-02-04",
    faq: [
      {
        q: "Kurumsal web sitesi ortalama ne kadar?",
        a: "Türkiye'de profesyonel, özel tasarım kurumsal bir web sitesi tipik olarak orta beş haneli ile düşük altı haneli TL aralığındadır. Kesin rakam; sayfa sayısı, özel tasarım derinliği, içerik üretimi ve entegrasyonlara göre değişir.",
      },
      {
        q: "Şablon site neden daha ucuz?",
        a: "Şablon sitelerde tasarım ve kod hazırdır; emek yalnızca içeriği yerleştirmeye gider. Bu ucuzdur ama markanıza özgü değildir, performans ve SEO esnekliği sınırlıdır. Özel tasarım, her kararı markanız için sıfırdan verir.",
      },
      {
        q: "Aylık bakım ücreti şart mı?",
        a: "Şart değil ama önerilir. Güvenlik güncellemeleri, yedekleme, küçük içerik değişiklikleri ve performans takibi için aylık bakım, sitenin uzun vadede sağlıklı kalmasını sağlar.",
      },
    ],
    body: [
      {
        type: "lead",
        text: "“Web sitesi ne kadar?” sorusunun tek bir doğru cevabı yok — tıpkı “ev ne kadar?” sorusu gibi. Ama fiyatı belirleyen faktörleri bilirseniz, hem bütçenizi doğru kurar hem de aldığınız teklifleri sağlıklı kıyaslarsınız.",
      },
      {
        type: "p",
        text: "Bu yazıda bir [kurumsal web sitesi](/hizmetler) projesinin maliyetini belirleyen 7 ana faktörü, gizli kalemleri ve 2026 için gerçekçi bütçe aralıklarını şeffaf biçimde anlatıyoruz.",
      },
      { type: "h2", text: "1. Kapsam: kaç sayfa, kaç şablon?" },
      {
        type: "p",
        text: "Maliyetin ilk belirleyicisi sayfa sayısı değil, **benzersiz tasarım gerektiren şablon** sayısıdır. 40 sayfalık bir site, aynı blog şablonunu kullanıyorsa 5 sayfalık özel tasarımlı bir siteden daha ucuza gelebilir.",
      },
      {
        type: "ul",
        items: [
          "Tek sayfa (landing): hızlı, odaklı, düşük maliyet",
          "Kurumsal (5-12 sayfa): en yaygın aralık",
          "İçerik/katalog (20+ şablon): CMS ve mimari ağırlıklı",
        ],
      },
      { type: "h2", text: "2. Özel tasarım mı, şablon mu?" },
      {
        type: "p",
        text: "Şablon temelli siteler ucuzdur çünkü tasarım kararları zaten verilmiştir. Özel tasarım ise art direction, tipografi, hareket (motion) ve etkileşim dilini markanız için sıfırdan kurar. Fark, fiyatın sıklıkla en büyük kalemidir.",
      },
      {
        type: "quote",
        text: "Şablon bir kıyafeti satın alırsınız; özel tasarım, ölçülerinize göre dikilir. İkisi de “kıyafet”tir ama aynı şey değildir.",
      },
      { type: "h2", text: "3. İçerik: metin, fotoğraf, video" },
      {
        type: "p",
        text: "Çoğu gecikmenin ve sürpriz maliyetin kaynağı içeriktir. Metin yazarlığı (copywriting), profesyonel fotoğraf, ikon ve illüstrasyon üretimi ayrı kalemlerdir. İçeriği siz sağlıyorsanız bütçe düşer; ajanstan bekliyorsanız planlamaya dahil edin.",
      },
      { type: "h2", text: "4. Teknik entegrasyonlar" },
      {
        type: "ul",
        items: [
          "İçerik yönetim sistemi (CMS) entegrasyonu",
          "Form, randevu, e-bülten ve CRM bağlantıları",
          "Çoklu dil (i18n) desteği",
          "E-ticaret veya ödeme altyapısı",
        ],
      },
      { type: "h2", text: "5. Performans ve SEO altyapısı" },
      {
        type: "p",
        text: "Core Web Vitals, erişilebilirlik ve teknik SEO ilk günden mimariye gömülmeli. Sonradan eklemek her zaman daha pahalıdır. Konuyu derinleştiren [Next.js ile teknik SEO rehberimize](/blog/nextjs-ile-teknik-seo) göz atabilirsiniz.",
      },
      { type: "h2", text: "6. Bakım ve barındırma" },
      {
        type: "p",
        text: "Yayın bir bitiş değil başlangıçtır. Barındırma (hosting), alan adı, SSL, yedekleme ve güncellemeler aylık/yıllık tekrar eden kalemlerdir. Bunları toplam sahip olma maliyetine (TCO) dahil edin.",
      },
      { type: "h2", text: "7. Ekip ve süreç" },
      {
        type: "p",
        text: "Tek bir freelancer mı, butik bir stüdyo mu, büyük bir ajans mı? Fiyat farkı çoğunlukla süreç olgunluğundan gelir: brief, strateji, revizyon turları ve yayın sonrası destek. Daha ucuz teklif, daha az süreç anlamına gelebilir.",
      },
      {
        type: "callout",
        text: "İpucu: Teklifleri kıyaslarken yalnızca toplam rakama değil; revizyon sayısı, teslim süresi, içerik sorumluluğu ve yayın sonrası desteğe bakın. Ucuz görünen teklif, eksik kapsam yüzünden pahalıya patlayabilir.",
      },
      {
        type: "p",
        text: "Projenize özel şeffaf bir tahmin için [bizimle iletişime geçin](/iletisim) — kapsamı birlikte netleştirip net bir aralık paylaşalım.",
      },
    ],
  },
  {
    slug: "nextjs-ile-teknik-seo",
    title: "Next.js ile teknik SEO: arama motoru için 10 kritik adım",
    description:
      "Next.js App Router ile hızlı ve aranabilir bir site kurmanın 10 teknik SEO adımı: metadata, sitemap, yapısal veri, Core Web Vitals ve daha fazlası.",
    category: "Teknik",
    tags: ["Next.js", "SEO", "teknik SEO", "Core Web Vitals", "performans"],
    author: site.legal,
    publishedAt: "2026-02-18",
    faq: [
      {
        q: "Next.js SEO için iyi midir?",
        a: "Evet. Next.js, sunucu tarafı render (SSR) ve statik üretim (SSG) ile arama motorlarının içeriği kolayca taramasını sağlar; yerleşik Metadata API, görsel optimizasyonu ve hız avantajlarıyla teknik SEO için güçlü bir temeldir.",
      },
      {
        q: "App Router SEO'yu nasıl etkiler?",
        a: "App Router; generateMetadata, dosya tabanlı sitemap/robots ve sunucu bileşenleri sayesinde metadata ve yapısal veriyi sayfa bazında, performanstan ödün vermeden yönetmeyi kolaylaştırır.",
      },
    ],
    body: [
      {
        type: "lead",
        text: "Hızlı bir site kurmak SEO'nun yarısıdır; diğer yarısı, arama motorlarının içeriğinizi doğru anlamasını sağlamaktır. Next.js App Router ikisini de kolaylaştırır. İşte sıralamada fark yaratan 10 teknik adım.",
      },
      { type: "h2", text: "1. Her sayfa için doğru metadata" },
      {
        type: "p",
        text: "`generateMetadata` ile her route'a özgün başlık ve açıklama verin. Başlıklar benzersiz, açıklamalar 150-160 karakter ve tıklamaya teşvik edici olmalı.",
      },
      {
        type: "code",
        lang: "tsx",
        code: "export async function generateMetadata({ params }): Promise<Metadata> {\n  const { slug } = await params;\n  const post = getPost(slug);\n  return {\n    title: post.title,\n    description: post.description,\n    alternates: { canonical: `/blog/${slug}` },\n  };\n}",
      },
      { type: "h2", text: "2. Kanonik URL'ler" },
      {
        type: "p",
        text: "Yinelenen içerik sinyallerini önlemek için her sayfaya `alternates.canonical` ekleyin. `metadataBase` kök layout'ta tanımlıysa göreli yol yeterlidir.",
      },
      { type: "h2", text: "3. Dosya tabanlı sitemap ve robots" },
      {
        type: "p",
        text: "`app/sitemap.ts` ve `app/robots.ts` ile bunları kodla üretin; yeni içerik eklendiğinde otomatik güncellensin. Statik XML dosyalarını elle güncellemek hataya açıktır.",
      },
      { type: "h2", text: "4. Yapısal veri (JSON-LD)" },
      {
        type: "p",
        text: "Article, BreadcrumbList, FAQPage ve Organization şemaları, zengin sonuçlar (rich results) için Google'a bağlam verir. Sunucu bileşeninde bir `<script type=\"application/ld+json\">` ile gömün.",
      },
      {
        type: "callout",
        text: "Bu blogun her yazısı; BlogPosting, BreadcrumbList ve (varsa) FAQPage yapısal verisiyle yayınlanır. Kaynağı görüntüleyip head içindeki JSON-LD'yi inceleyebilirsiniz.",
      },
      { type: "h2", text: "5. Açık Grafik ve sosyal kartlar" },
      {
        type: "p",
        text: "OpenGraph ve Twitter kart metadatası, paylaşımların düzgün önizlenmesini sağlar. Dinamik OG görselleri tıklanma oranını ciddi biçimde artırır.",
      },
      { type: "h2", text: "6. Görsel optimizasyonu" },
      {
        type: "p",
        text: "`next/image` ile modern formatlar, doğru boyutlandırma ve tembel yükleme (lazy loading) gelir. Görseller LCP'nin en büyük düşmanıdır; boyutları her zaman tanımlayın.",
      },
      { type: "h2", text: "7. Core Web Vitals" },
      {
        type: "ul",
        items: [
          "LCP: en büyük içerik 2,5 sn altında yüklensin",
          "INP: etkileşim gecikmesi düşük tutulsun",
          "CLS: yerleşim kaymasını sıfıra yaklaştırın",
        ],
      },
      { type: "h2", text: "8. Statik üretim ve önbellekleme" },
      {
        type: "p",
        text: "`generateStaticParams` ile blog sayfalarını derleme zamanında üretin. Statik sayfalar daha hızlı sunulur ve tarama bütçesini verimli kullanır.",
      },
      { type: "h2", text: "9. Anlamsal HTML ve başlık hiyerarşisi" },
      {
        type: "p",
        text: "Sayfada tek bir `h1`, ardından mantıklı `h2`/`h3` hiyerarşisi kullanın. `article`, `nav`, `time` gibi anlamsal etiketler hem erişilebilirliği hem aranabilirliği güçlendirir.",
      },
      { type: "h2", text: "10. İç linkleme" },
      {
        type: "p",
        text: "İlgili sayfaları birbirine bağlamak, otoriteyi yayar ve taramayı kolaylaştırır. Örneğin bu yazı, [web sitesi maliyeti rehberimize](/blog/kurumsal-web-sitesi-maliyeti-2026) bağlanıyor.",
      },
      {
        type: "p",
        text: "Bu adımların hepsini ilk günden mimariye gömen bir site mi istiyorsunuz? [Web geliştirme hizmetimize](/hizmetler) bakın ya da [bir proje konuşalım](/iletisim).",
      },
    ],
  },
  {
    slug: "mobil-uygulama-mi-web-sitesi-mi",
    title: "Mobil uygulama mı, web sitesi mi? Doğru kararı vermenin yolu",
    description:
      "Bütçenizi mobil uygulamaya mı web sitesine mi ayırmalısınız? Kullanıcı alışkanlığı, maliyet ve hedeflere göre doğru kararı vermenizi sağlayan çerçeve.",
    category: "Strateji",
    tags: ["mobil uygulama", "web sitesi", "strateji", "ürün"],
    author: site.legal,
    publishedAt: "2026-03-06",
    faq: [
      {
        q: "Önce web mi, önce uygulama mı yapmalıyım?",
        a: "Çoğu işletme için önce iyi bir web sitesi mantıklıdır: daha düşük maliyet, daha geniş erişim ve daha hızlı yayın sağlar. Mobil uygulama; tekrar eden kullanım, çevrimdışı ihtiyaç veya cihaz özelliklerine erişim gerektiğinde devreye girer.",
      },
      {
        q: "PWA bir uygulamanın yerini tutar mı?",
        a: "Birçok senaryoda evet. Progresif web uygulaması (PWA), tek kod tabanıyla uygulama benzeri deneyim sunar; ana ekrana eklenebilir ve çevrimdışı çalışabilir. Ağır cihaz entegrasyonları gerektiğinde native uygulama hâlâ üstündür.",
      },
    ],
    body: [
      {
        type: "lead",
        text: "“Bize bir uygulama lazım” cümlesi çoğu zaman gerçek ihtiyacı gizler. Doğru soru şu: kullanıcılarınız sizinle nasıl, ne sıklıkta ve nerede etkileşime girecek? Cevap, bütçenizi nereye koyacağınızı belirler.",
      },
      { type: "h2", text: "Önce hedefi netleştirin" },
      {
        type: "p",
        text: "Görünürlük ve erişim mi istiyorsunuz, yoksa sadık kullanıcılarla derin etkileşim mi? Web; keşfedilebilirlik ve erişim için, uygulama; tekrar eden kullanım ve bağlılık için güçlüdür.",
      },
      { type: "h2", text: "Web sitesinin güçlü olduğu yerler" },
      {
        type: "ul",
        items: [
          "Arama motorlarından keşfedilme (SEO)",
          "Kurulum gerektirmeyen anında erişim",
          "Daha düşük maliyet ve daha hızlı yayın",
          "Tek bağlantıyla her cihazda çalışma",
        ],
      },
      { type: "h2", text: "Mobil uygulamanın güçlü olduğu yerler" },
      {
        type: "ul",
        items: [
          "Tekrar eden, günlük kullanım alışkanlığı",
          "Push bildirim ile geri kazanım",
          "Kamera, konum, çevrimdışı gibi cihaz özellikleri",
          "Yüksek performanslı, akıcı etkileşim",
        ],
      },
      {
        type: "quote",
        text: "Uygulama bir kanal değil, bir taahhüttür. İndirilmesini, güncellenmesini ve geri dönülmesini hak edecek bir değer sunmuyorsa, web daha doğru başlangıçtır.",
      },
      { type: "h2", text: "Üçüncü yol: PWA" },
      {
        type: "p",
        text: "Progresif web uygulaması, ikisinin arasını köprüler: web'in erişimi ile uygulamanın deneyimini tek kod tabanında birleştirir. Doğru senaryoda hem bütçeyi hem zamanı ciddi biçimde korur.",
      },
      {
        type: "callout",
        text: "Pratik kural: Belirsizseniz web (veya PWA) ile başlayın, gerçek kullanım verisiyle native uygulama kararını destekleyin. Veri olmadan yapılan uygulama yatırımı en pahalı tahmindir.",
      },
      { type: "h2", text: "Karar çerçevesi" },
      {
        type: "ol",
        items: [
          "Kullanıcı ne sıklıkta geri dönecek?",
          "Cihaz özelliklerine (kamera, konum, çevrimdışı) ihtiyaç var mı?",
          "Keşfedilebilirlik mi, bağlılık mı önceliğiniz?",
          "Bütçe ve zaman çizelgeniz neyi kaldırır?",
        ],
      },
      {
        type: "p",
        text: "Biz [web, mobil ve panel + API sistemlerini](/hizmetler) tek ekip olarak kurguladığımız için kararı ihtiyaca göre veririz, ürettiğimiz şeye göre değil. Doğru yolu birlikte bulmak için [iletişime geçin](/iletisim).",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Veri kaynağı: CRM public API + yerel fallback
// ---------------------------------------------------------------------------
//
// CRM_API_URL tanımlıysa içerik CRM'in public blog API'sinden çekilir
// (örn. http://127.0.0.1:4000/api/public/blog — aynı sunucuda localhost).
// fetch'ler "blog" etiketiyle önbelleğe alınır; CRM bir yazıyı kaydedince
// /api/revalidate webhook'u revalidateTag("blog") ile anında tazeler.
// CRM erişilemezse site yerel içerikle çalışmaya devam eder.

const CRM_API_URL = process.env.CRM_API_URL?.replace(/\/$/, "");
export const BLOG_CACHE_TAG = "blog";

function sortByDate(list: BlogPost[]): BlogPost[] {
  return [...list].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

/** CRM JSON'unu güvenli biçimde BlogPost'a çevirir. */
function normalize(raw: Record<string, unknown>): BlogPost {
  const r = raw as Record<string, any>;
  return {
    slug: String(r.slug ?? ""),
    title: String(r.title ?? ""),
    description: String(r.description ?? ""),
    category: String(r.category ?? "Genel"),
    tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
    author: String(r.author ?? "").trim() || site.legal,
    publishedAt: String(r.publishedAt ?? "").slice(0, 10),
    updatedAt: r.updatedAt ? String(r.updatedAt).slice(0, 10) : undefined,
    cover: r.cover || undefined,
    faq: Array.isArray(r.faq)
      ? r.faq.map((f: any) => ({ q: String(f?.q ?? ""), a: String(f?.a ?? "") }))
      : undefined,
    body: Array.isArray(r.body) ? (r.body as BlogBlock[]) : [],
  };
}

/** Yayın tarihine göre (yeni → eski) sıralı tüm yazılar. */
export async function getAllPosts(): Promise<BlogPost[]> {
  if (!CRM_API_URL) return sortByDate(localPosts);
  try {
    const res = await fetch(`${CRM_API_URL}/posts`, {
      cache: "force-cache",
      next: { tags: [BLOG_CACHE_TAG] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Record<string, unknown>[];
    return sortByDate(data.map(normalize));
  } catch (err) {
    console.error(
      "[blog] CRM listesi alınamadı, yerel içeriğe düşülüyor:",
      (err as Error).message,
    );
    return sortByDate(localPosts);
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  if (!CRM_API_URL) return localPosts.find((p) => p.slug === slug);
  try {
    const res = await fetch(`${CRM_API_URL}/posts/${encodeURIComponent(slug)}`, {
      cache: "force-cache",
      next: { tags: [BLOG_CACHE_TAG, `${BLOG_CACHE_TAG}:${slug}`] },
    });
    if (res.status === 404) return undefined; // gerçekten yok → 404
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return normalize(await res.json());
  } catch (err) {
    console.error(
      "[blog] CRM yazısı alınamadı, yerele düşülüyor:",
      (err as Error).message,
    );
    return localPosts.find((p) => p.slug === slug);
  }
}

/** Aynı kategori/etiketten, geçerli yazı hariç en fazla `limit` ilgili yazı. */
export function getRelatedPosts(
  post: BlogPost,
  all: BlogPost[],
  limit = 2,
): BlogPost[] {
  return all
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
      const sameCategory = p.category === post.category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sameCategory };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}
