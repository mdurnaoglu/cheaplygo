"use client";

import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { Header } from "@/components/header";
import { useLanguage } from "@/components/language-provider";
import type { BlogPost } from "@/lib/blogs";

export function BlogIndexContent({ posts }: { posts: BlogPost[] }) {
  const { language } = useLanguage();

  const copy =
    language === "ru"
      ? {
          eyebrow: "cheaplygo Blog",
          title: "Все статьи о выборе маршрута, бюджета и логики поездки",
          description:
            "Здесь собраны материалы о том, как сравнивать направления, считать полную стоимость поездки и принимать более точные travel-решения.",
          openPost: "Открыть статью"
        }
      : language === "tr"
        ? {
            eyebrow: "cheaplygo Blog",
            title: "Rota seçimi, bütçe dengesi ve seyahat mantığı üzerine tüm yazılar",
            description:
              "Burada destinasyon karşılaştırma, toplam seyahat maliyeti ve daha iyi travel kararı verme üzerine yazıları bulabilirsin.",
            openPost: "Yazıyı aç"
          }
        : {
            eyebrow: "cheaplygo Blog",
            title: "All posts on route selection, budget fit, and smarter travel planning",
            description:
              "This is the reading hub for comparing destinations, understanding total trip cost, and making better travel decisions.",
            openPost: "Read article"
          };

  return (
    <main className="min-h-screen bg-page">
      <section className="relative border-b border-slate-200 bg-white pb-12 pt-32">
        <Header theme="light" activeNav="discover" />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              {copy.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const localized = post.locales[language];

            return (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url('${post.image}')` }}
                  aria-label={localized.imageAlt}
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {post.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {localized.readTime}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-ink">
                    {localized.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {localized.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slateBlue">
                    {copy.openPost}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
