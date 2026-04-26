import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/admin"] },
      { userAgent: "Twitterbot", allow: "/", disallow: ["/admin"] },
      { userAgent: "facebookexternalhit", allow: "/", disallow: ["/admin"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin"] },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/mensajes", "/perfil", "/admin"],
      },
    ],
    sitemap: "https://lachanga.uy/sitemap.xml",
  };
}
