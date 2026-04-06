import { HomePage } from "@/components/home-page";
import { getFeaturedBlogPost } from "@/lib/blogs";

export default async function Home() {
  const featuredBlog = await getFeaturedBlogPost();

  return <HomePage featuredBlog={featuredBlog} />;
}
