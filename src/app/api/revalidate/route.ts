import { revalidateTag, revalidatePath } from "next/cache";
import { BLOG_CACHE_TAG } from "@/lib/blog";

/**
 * Blog içeriği tazeleme webhook'u — CRM bir yazıyı kaydedince/silince çağırır.
 *
 * Doğrulama: `x-webhook-secret` başlığı REVALIDATE_SECRET ile eşleşmeli
 * (CRM tarafındaki SITE_REVALIDATE_SECRET ile aynı değer).
 *
 * Gövde (opsiyonel): { "slug": "yazi-slug" } → o yazının sayfası da hedefli
 * tazelenir. Slug verilmezse liste, sitemap ve RSS yenilenir.
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false, error: "Yetkisiz" }, { status: 401 });
  }

  let slug: string | null = null;
  try {
    const body = await request.json();
    if (body && typeof body.slug === "string") slug = body.slug;
  } catch {
    // gövdesiz çağrı da geçerli — sadece genel tazeleme yapılır
  }

  // Liste fetch'ini ve tüm yazıları kapsayan etiketi geçersiz kıl.
  // "max" profili: bir sonraki ziyarette stale-while-revalidate ile tazelenir
  // (Next 16'da blog içeriği için önerilen yaklaşım).
  revalidateTag(BLOG_CACHE_TAG, "max");
  // Statik üretilen yolları da yeniden derlet.
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/rss.xml");
  if (slug) {
    revalidateTag(`${BLOG_CACHE_TAG}:${slug}`, "max");
    revalidatePath(`/blog/${slug}`);
  }

  return Response.json({ ok: true, revalidated: true, slug });
}
