import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3 } from "lucide-react";
import { BlogBackLink } from "@/components/blog-back-link";
import { Header } from "@/components/header";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";

type BlogPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog | cheaplygo"
    };
  }

  return {
    title: `${post.title} | cheaplygo`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image]
    }
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-page">
      <section className="relative border-b border-slate-200 bg-white pb-12 pt-32">
        <Header theme="light" activeNav="discover" />

        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 sm:px-8 lg:px-10">
          <BlogBackLink />

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                cheaplygo Blog
              </p>
              <h1 className="mt-4 max-w-[14ch] text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {post.publishedAt}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
              <img
                src={post.image}
                alt={post.imageAlt}
                className="h-full min-h-[280px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card sm:p-10">
          <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </section>
    </main>
  );
}
