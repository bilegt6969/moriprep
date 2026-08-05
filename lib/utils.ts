import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

export function createUrl(pathname: string, params: URLSearchParams): string {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
}

export function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_VERCEL_URL",
    "NEXT_PUBLIC_SITE_NAME",
    "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
    "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
