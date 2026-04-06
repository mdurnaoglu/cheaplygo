import { promises as fs } from "fs";
import path from "path";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  html: string;
};

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog");

const defaultPost: BlogPost = {
  slug: "blog-planner-ilhami-istanbul-cikisli-hafta-sonu-rotalari",
  title: "Blog Planner Ilhami: Istanbul cikisli hafta sonu rotalari ile ucuz, hizli ve duzgun plan yapma rehberi",
  description:
    "Istanbul cikisli kisa seyahatler icin butce, vize, ucus suresi ve konaklama dengesini daha hizli kurmak isteyenler icin pratik blog rehberi.",
  excerpt:
    "Ucuz rota ararken sadece bilete bakmak yerine toplam seyahat mantigini kurmak daha iyi sonuc verir. Bu yazi, hafta sonu kacamaklari icin planner mantigini ve dikkat edilmesi gereken temel filtreleri anlatiyor.",
  image:
    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
  imageAlt: "Weekend traveler planning a short city break with a phone and map",
  publishedAt: "2026-04-07",
  readTime: "4 min read",
  featured: true,
  html: `<h2>Neden blog planner mantigi lazim?</h2>
<p>Ucuz bilet tek basina iyi seyahat demek degildir. Ucus saati, toplam geceleme maliyeti, vize kolayligi ve sehir ici tempo birlikte dusunuldugunde daha mantikli karar verilir. Bu sayfa da tam olarak bunu destekleyen bir icerik yapisi icin hazirlandi.</p>
<h2>Hafta sonu kacamaginda ilk bakilacaklar</h2>
<p>Kisa sureli seyahatlerde havaalani uzakligi, gece ulasimi, merkezde konaklama maliyeti ve donus saati toplam deneyimi dogrudan etkiler. Bu nedenle blog iceriginde yalnizca destinasyon ismi degil, karar vermeyi hizlandiran baglamsal bilgi de bulunmali.</p>
<h2>SEO ve yapay zeka gorunurlugu icin icerik yapisi</h2>
<p>Baslikta net niyet belirtmek, acik bir acilis paragrafi yazmak, alt basliklari soru ya da karar odakli kurmak ve gercek fayda sunan kisa paragraflar kullanmak daha iyi sonuc verir. Gorsel, aciklama ve icerik birbiriyle tutarli oldugunda sayfa daha guclu sinyal uretir.</p>`
};

function parseMetadataBlock(raw: string) {
  const match = raw.match(/^<!--([\s\S]*?)-->\s*/);

  if (!match) {
    return {
      metadata: {},
      html: raw.trim()
    };
  }

  const metadata = Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) {
          return [line, ""];
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        return [key, value];
      })
  );

  return {
    metadata,
    html: raw.slice(match[0].length).trim()
  };
}

function mapFileToPost(fileName: string, raw: string): BlogPost {
  const { metadata, html } = parseMetadataBlock(raw);
  const slug = metadata.slug || fileName.replace(/\.html$/i, "");

  return {
    slug,
    title: metadata.title || defaultPost.title,
    description: metadata.description || defaultPost.description,
    excerpt: metadata.excerpt || defaultPost.excerpt,
    image: metadata.image || defaultPost.image,
    imageAlt: metadata.imageAlt || defaultPost.imageAlt,
    publishedAt: metadata.publishedAt || defaultPost.publishedAt,
    readTime: metadata.readTime || defaultPost.readTime,
    featured: metadata.featured === "true",
    html: html || defaultPost.html
  };
}

async function readBlogFiles() {
  try {
    const fileNames = await fs.readdir(BLOG_DIRECTORY);
    const htmlFiles = fileNames.filter(
      (fileName) => fileName.endsWith(".html") && !fileName.startsWith("_")
    );

    const posts = await Promise.all(
      htmlFiles.map(async (fileName) => {
        const raw = await fs.readFile(path.join(BLOG_DIRECTORY, fileName), "utf8");
        return mapFileToPost(fileName, raw);
      })
    );

    return posts.sort((left, right) => {
      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    });
  } catch {
    return [defaultPost];
  }
}

export async function getAllBlogPosts() {
  const posts = await readBlogFiles();
  return posts.length ? posts : [defaultPost];
}

export async function getFeaturedBlogPost() {
  const posts = await getAllBlogPosts();
  return posts[0];
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
