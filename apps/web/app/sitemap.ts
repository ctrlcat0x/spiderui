import { MetadataRoute } from "next";
import { components, getComponentDocsHref } from "@/registry";
import { getAllTemplates } from "@/registry/templates";

const baseUrl = "https://spiderui.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs/templates`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const componentSitemap: MetadataRoute.Sitemap = Object.keys(components).map(
    (slug) => ({
      url: `${baseUrl}${getComponentDocsHref(slug)}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  const templateSitemap: MetadataRoute.Sitemap = getAllTemplates().flatMap(
    (template) => [
      {
        url: `${baseUrl}/docs/templates/${template.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      },
    ],
  );

  return [...staticPages, ...componentSitemap, ...templateSitemap];
}
