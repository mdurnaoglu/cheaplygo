import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog-index-content";
import { getAllBlogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read CheaplyGo articles on route selection, budget planning, and smarter trip decisions."
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  return <BlogIndexContent posts={posts} />;
}
