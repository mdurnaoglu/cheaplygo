import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogs";
import { DEAL_MARKETS, DEAL_MARKET_ORDER } from "@/lib/flight-deals";
import { getSiteUrl } from "@/lib/site";
import { visaGuidePages } from "@/lib/explore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const blogPosts = await getAllBlogPosts();

  const staticRoutes = [
    "",
    "/planner",
    "/blog",
    "/firsat-ucuslar",
    "/firsat-konaklamalar",
    "/vize-rehberi",
    "/kimlikle-gidilen-ulkeler",
    "/ucuz-konaklamali-ulkeler"
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));

  return [
    ...staticEntries,
    ...DEAL_MARKET_ORDER.flatMap((market) => {
      const slug = DEAL_MARKETS[market].slug;

      return [
        {
          url: `${siteUrl}/firsat-ucuslar/${slug}`,
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.8
        },
        {
          url: `${siteUrl}/firsat-konaklamalar/${slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.8
        }
      ];
    }),
    ...visaGuidePages.map((page) => ({
      url: `${siteUrl}/vize-rehberi/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.72
    }))
  ];
}
