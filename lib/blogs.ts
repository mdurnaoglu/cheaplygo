import { promises as fs } from "fs";
import path from "path";

export type BlogLocale = "en" | "tr" | "ru";

export type LocalizedBlogFields = {
  title: string;
  description: string;
  excerpt: string;
  imageAlt: string;
  readTime: string;
  html: string;
};

export type BlogPost = {
  slug: string;
  image: string;
  publishedAt: string;
  featured: boolean;
  locales: Record<BlogLocale, LocalizedBlogFields>;
};

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog");

function isValidLocalizedFields(value: unknown): value is LocalizedBlogFields {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.excerpt === "string" &&
    typeof candidate.imageAlt === "string" &&
    typeof candidate.readTime === "string" &&
    typeof candidate.html === "string"
  );
}

function isValidBlogPost(value: unknown): value is BlogPost {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const locales = candidate.locales as Record<string, unknown> | undefined;

  return (
    typeof candidate.slug === "string" &&
    typeof candidate.image === "string" &&
    typeof candidate.publishedAt === "string" &&
    typeof candidate.featured === "boolean" &&
    Boolean(locales) &&
    isValidLocalizedFields(locales?.tr) &&
    isValidLocalizedFields(locales?.en) &&
    isValidLocalizedFields(locales?.ru)
  );
}

async function readJsonBlogFiles() {
  const fileNames = await fs.readdir(BLOG_DIRECTORY);
  const jsonFiles = fileNames.filter((fileName) => fileName.endsWith(".json"));

  const posts = await Promise.all(
    jsonFiles.map(async (fileName) => {
      const raw = await fs.readFile(path.join(BLOG_DIRECTORY, fileName), "utf8");
      const parsed = JSON.parse(raw) as unknown;

      if (!isValidBlogPost(parsed)) {
        throw new Error(`Invalid blog JSON schema in ${fileName}`);
      }

      return parsed;
    })
  );

  return posts.sort((left, right) => {
    if (left.featured !== right.featured) {
      return left.featured ? -1 : 1;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
}

export async function getAllBlogPosts() {
  return readJsonBlogFiles();
}

export async function getFeaturedBlogPost() {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
