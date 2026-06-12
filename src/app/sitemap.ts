import type { MetadataRoute } from "next";
import { site, nav } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const home = {
    url: site.url,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 1,
  };

  const routes = nav.map(({ href }) => ({
    url: `${site.url}${href}`,
    lastModified,
    // Blog daha sık güncellendiği için weekly.
    changeFrequency: href === "/blog" ? ("weekly" as const) : ("monthly" as const),
    // İletişim, Çalışmalar ve Blog dönüşüm/içerik için biraz daha öncelikli.
    priority:
      href === "/iletisim" || href === "/calismalar" || href === "/blog"
        ? 0.9
        : 0.8,
  }));

  // Her blog yazısı ayrı bir URL — gerçek son güncelleme tarihiyle.
  const posts = (await getAllPosts()).map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [home, ...routes, ...posts];
}
