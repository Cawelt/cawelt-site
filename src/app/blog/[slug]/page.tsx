import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/sections/CTA";
import Prose from "@/components/blog/Prose";
import { site } from "@/lib/site";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  tableOfContents,
  readingTimeMinutes,
  formatDate,
  postUrl,
} from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

// Tüm yazıları derleme zamanında statik üret.
export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author, url: site.url }],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: post.cover ? [post.cover] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const toc = tableOfContents(post);
  const related = getRelatedPosts(post, await getAllPosts());
  const readingTime = readingTimeMinutes(post);

  // Yapısal veri: BlogPosting + BreadcrumbList (+ varsa FAQPage).
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${postUrl(post)}#article`,
      headline: post.title,
      description: post.description,
      url: postUrl(post),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      inLanguage: "tr-TR",
      author: { "@type": "Organization", name: post.author, url: site.url },
      publisher: { "@id": `${site.url}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl(post) },
      keywords: post.tags.join(", "),
      articleSection: post.category,
      image: post.cover ?? `${site.url}/opengraph-image`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Anasayfa", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${site.url}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: postUrl(post),
        },
      ],
    },
  ];

  if (post.faq && post.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Başlık */}
        <header className="relative mx-auto max-w-3xl px-6 pb-12 pt-32 sm:pt-36 lg:pt-48">
          <div
            aria-hidden
            className="animate-drift pointer-events-none absolute -left-32 top-32 -z-10 size-[420px] rounded-full bg-champagne/15 blur-[140px]"
          />
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs text-mute transition-colors hover:text-bone"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Tüm yazılar
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs text-mute">
            <span className="text-champagne">{post.category}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime} dk okuma</span>
          </div>

          <h1 className="headline mt-5 text-[clamp(2.25rem,6vw,3.75rem)] text-bone">
            {post.title}
          </h1>
          <p className="mt-6 text-lg text-bone-muted">{post.description}</p>
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover}
              alt={post.title}
              className="mt-10 aspect-[16/9] w-full rounded-card border border-line object-cover"
            />
          ) : null}
        </header>

        {/* İçindekiler */}
        {toc.length > 2 ? (
          <nav
            aria-label="İçindekiler"
            className="mx-auto mb-12 max-w-3xl px-6"
          >
            <div className="rounded-card border border-line bg-surface/50 p-6">
              <p className="eyebrow mb-4">İçindekiler</p>
              <ol className="space-y-2">
                {toc.map((item, i) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${item.id}`}
                      className="text-bone-muted transition-colors hover:text-champagne"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        ) : null}

        {/* Gövde */}
        <div className="mx-auto max-w-3xl px-6">
          <Prose blocks={post.body} />
        </div>

        {/* SSS */}
        {post.faq && post.faq.length > 0 ? (
          <section className="mx-auto mt-20 max-w-3xl px-6">
            <h2 className="headline text-3xl text-bone md:text-4xl">
              Sıkça sorulan sorular
            </h2>
            <div className="mt-8 divide-y divide-line/70 border-y border-line/70">
              {post.faq.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-bone">
                    {f.q}
                    <span className="font-mono text-champagne transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-bone-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {/* Etiketler */}
        <div className="mx-auto mt-16 max-w-3xl px-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-mute"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* İlgili yazılar */}
      {related.length > 0 ? (
        <section className="mx-auto mt-28 max-w-[1440px] px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow mb-6">Devamı niteliğinde</p>
            <h2 className="headline text-4xl text-bone md:text-5xl">
              İlgili yazılar
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05} className="bg-surface">
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col p-8 lg:p-10"
                >
                  <div className="flex items-center gap-3 font-mono text-xs text-mute">
                    <span className="text-champagne">{p.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={p.publishedAt}>
                      {formatDate(p.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-4 text-2xl text-bone transition-colors group-hover:text-champagne">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-bone-muted">{p.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-mute transition-colors group-hover:text-bone">
                    Devamını oku
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <CTA />
    </>
  );
}
