import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { getFeaturedBlogPost } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover budget-smart trips, flight deals, stay ideas, and travel planning guides from one searchable hub.",
  alternates: {
    canonical: "/"
  }
};

export default async function Home() {
  const featuredBlog = await getFeaturedBlogPost();

  return <HomePage featuredBlog={featuredBlog} />;
}
