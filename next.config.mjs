import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lottie-react"],
  },

  async headers() {
    return [
      {
        source: "/schools_enriched_v4.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
          { key: "Content-Type", value: "application/json; charset=utf-8" },
        ],
      },
      {
        source: "/data/questions.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
          { key: "Content-Type", value: "application/json; charset=utf-8" },
        ],
      },
      {
        source: "/data/math_questions.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
          { key: "Content-Type", value: "application/json; charset=utf-8" },
        ],
      },
      {
        source: "/data/october_sat_rw_questions.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
          { key: "Content-Type", value: "application/json; charset=utf-8" },
        ],
      },
      {
        source: "/data/october_sat_math_questions.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
          { key: "Content-Type", value: "application/json; charset=utf-8" },
        ],
      },
      {
        source: "/framer-index.html",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
