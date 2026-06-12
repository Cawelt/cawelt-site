import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/sections/CTA";
import { site } from "@/lib/site";
import {
  getAllPosts,
  formatDate,
  readingTimeMinutes,
  postUrl,
} from "@/lib/blog";

const title = "Blog";
const description =
  "Web, mobil ve ürün geliştirme üzerine notlar, rehberler ve denemeler. Tasarım, performans ve SEO odaklı pratik içerikler.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "yazılım blogu",
    "web tasarım rehberi",
    "Next.js",
    "SEO",
    "mobil uygulama",
  ],
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": `${site.url}/blog/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    title: `${title} · ${site.name}`,
    description,
    url: "/blog",
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  // Blog ve içindeki yazılar için yapısal veri (ItemList + Blog).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/blog#blog`,
    name: `${site.name} Blog`,
    description,
    url: `${site.url}/blog`,
    inLanguage: "tr-TR",
    publisher: { "@id": `${site.url}/#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: postUrl(p),
      datePublished: p.publishedAt,
      dateModified: p.updatedAt ?? p.publishedAt,
      author: { "@type": "Organization", name: p.author },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow="Blog — notlar"
        title="Düşündüklerimiz,"
        serif="yazıya döktüklerimiz."
        description="Web, mobil ve ürün geliştirme üzerine rehberler ve denemeler. Tasarım, performans ve SEO'ya dair, işimizden damıttığımız pratik notlar."
      />

      <section className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Öne çıkan yazı */}
        {featured ? (
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block border-t border-line/60 pt-12"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-mute">
                    <span className="text-champagne">{featured.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={featured.publishedAt}>
                      {formatDate(featured.publishedAt)}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{readingTimeMinutes(featured)} dk okuma</span>
                  </div>
                  <h2 className="headline mt-5 text-4xl text-bone transition-colors group-hover:text-champagne md:text-6xl">
                    {featured.title}
                  </h2>
                </div>
                <div className="flex flex-col justify-end lg:col-span-5">
                  <p className="text-lg text-bone-muted">
                    {featured.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-bone">
                    Yazıyı oku
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ) : null}

        {/* Diğer yazılar */}
        {rest.length > 0 ? (
          <div className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05} className="bg-surface">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col p-8 lg:p-10"
                >
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-mute">
                    <span className="text-champagne">{post.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-4 text-2xl text-bone transition-colors group-hover:text-champagne md:text-3xl">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-bone-muted">{post.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-mute transition-colors group-hover:text-bone">
                    Devamını oku
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : null}
      </section>

      <CTA />
    </>
  );
}
