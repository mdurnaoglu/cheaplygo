import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/blog-post-content";
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
      title: "Blog"
    };
  }

  return {
    title: post.locales.en.title,
    description: post.locales.en.description,
    openGraph: {
      title: post.locales.en.title,
      description: post.locales.en.description,
      images: [post.image]
    }
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
