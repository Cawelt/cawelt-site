import type { MetadataRoute } from "next";
import { site, nav } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
    changeFrequency: "monthly" as const,
    // İletişim ve Çalışmalar dönüşüm/portföy için biraz daha öncelikli.
    priority: href === "/iletisim" || href === "/calismalar" ? 0.9 : 0.8,
  }));

  return [home, ...routes];
}
