/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: false,

  allowedDevOrigins: ["172.20.10.6"],

  // experimental: {
  //   inlineCss: true, // Disabled - might cause issues with Turbopack
  // },

  turbopack: {
    root: import.meta.dirname,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90],
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

  async rewrites() {
    // Firebase Auth rewrites for Google OAuth
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    if (authDomain) {
      return [
        {
          source: "/__/auth/:path*",
          destination: `https://${authDomain}/__/auth/:path*`,
        },
      ];
    }
    return [];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
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
