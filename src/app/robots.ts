import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: [
        "/overview",
        "/discover",
        "/compliance",
        "/file",
        "/calendar",
        "/tasks",
        "/documents",
        "/professionals",
        "/exposure",
        "/settings",
        "/business",
      ],
    },
  };
}
