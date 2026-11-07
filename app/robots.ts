import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/settings", "/dashboard", "/admin", "/verify"],
      },
    ],
    sitemap: "https://moriprep.xyz/sitemap.xml",
  };
}
