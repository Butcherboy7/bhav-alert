import { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { APP_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityRoutes = CITIES.map((city) => ({
    url: `${APP_URL}/${city.key}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...cityRoutes,
  ];
}
