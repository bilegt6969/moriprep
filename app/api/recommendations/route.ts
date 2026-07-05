import { createImageUrlBuilder } from "@sanity/image-url";
import type { BundleProduct } from "lib/recommendations/bundles";
import { buildBundleAffinityMap } from "lib/recommendations/bundles";
import { bundleAffinityCache } from "lib/recommendations/cache";
import { injectDiversity } from "lib/recommendations/diversity";
import { filterByVariantAvailability } from "lib/recommendations/filters";
import {
    precomputeSource,
    scoreNewArrivals,
    scoreProductPair,
    scoreTrending,
} from "lib/recommendations/scorer";
import type {
    RecommendationProduct,
    RecommendationStrategy,
    ScoredProduct,
    ScoringContext,
    UserContext,
} from "lib/recommendations/types";
import { DEFAULT_WEIGHTS, STRATEGY_WEIGHTS } from "lib/recommendations/types";
import { sanityClient } from "lib/sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { isSanityConfigured } from "sanity/env";

const builder = createImageUrlBuilder(sanityClient);

function urlFor(source: any): string {
  return builder.image(source).width(800).url();
}

// ─── Shared projection ────────────────────────────────────────────────────────

const PRODUCT_PROJECTION = `{
  _id,
  "slug": slug,
  title,
  brand,
  category,
  price,
  compareAtPrice,
  condition,
  tags,
  "listedAt":  _createdAt,
  "updatedAt": _updatedAt,
  availableForSale,
  outOfStock,
  images[]{
    asset,
    alt,
    scale,
  },
  variants,
  purchaseBundles,
  bestFor
}`;

// ─── Mappers ──────────────────────────────────────────────────────────────────

interface SanityProduct {
  _id: string;
  slug: any;
  title: string;
  brand: string;
  category: string[];
  price: number;
  compareAtPrice?: number;
  condition?: string;
  tags: string[];
  listedAt: string;
  updatedAt: string;
  availableForSale: boolean;
  outOfStock?: boolean;
  images: any[];
  variants: any[];
  purchaseBundles?: any;
  bestFor?: any;
}

function mapSanityProduct(doc: SanityProduct): RecommendationProduct {
  const priceAmount = (doc.price || 0).toString();
  const images = doc.images || [];

  const featuredImage =
    images.length > 0
      ? {
          url: urlFor(images[0]),
          altText: doc.title || "",
          width: 800,
          height: 800,
          scale: images[0]?.scale || 1.0,
        }
      : { url: "", altText: doc.title || "", width: 0, height: 0, scale: 1.0 };

  return {
    id: doc._id,
    handle: doc.slug?.current || "",
    title: doc.title,
    brand: doc.brand,
    categories: doc.category || [],
    priceRange: {
      minVariantPrice: { amount: priceAmount, currencyCode: "MNT" },
      maxVariantPrice: { amount: priceAmount, currencyCode: "MNT" },
    },
    compareAtPrice: doc.compareAtPrice,
    condition: doc.condition,
    tags: doc.tags || [],
    listedAt: doc.listedAt,
    updatedAt: doc.updatedAt,
    availableForSale: doc.availableForSale,
    outOfStock: doc.outOfStock,
    featuredImage,
    images,
    variants: doc.variants || [],
    purchaseBundles: doc.purchaseBundles,
    bestFor: doc.bestFor,
  };
}

// ─── Bundle affinity cache ────────────────────────────────────────────────────

/**
 * Get bundle affinity map from module-level TTL cache.
 * On cache miss: fetches a lightweight payload (id + category + purchaseBundles only),
 * builds the map, and stores it for 5 minutes.
 *
 * To force invalidation on product changes, call:
 *   bundleAffinityCache.invalidate("bundle-affinity")
 * from a Sanity webhook endpoint (POST /api/webhooks/sanity).
 */
async function getCachedBundleAffinityMap(): Promise<Map<string, Set<string>>> {
  const cached = bundleAffinityCache.get("bundle-affinity");
  if (cached) return cached;

  const query = `*[_type == "product" && availableForSale == true] {
    _id,
    category,
    purchaseBundles
  }`;
  const raw: Array<{ _id: string; category: string[]; purchaseBundles?: any }> =
    await sanityClient.fetch(query);

  const bundleProducts: BundleProduct[] = raw.map((p) => ({
    id: p._id,
    categories: p.category || [],
    purchaseBundles: p.purchaseBundles,
  }));

  const map = buildBundleAffinityMap(bundleProducts);
  bundleAffinityCache.set("bundle-affinity", map);
  return map;
}

// ─── Weight resolver ──────────────────────────────────────────────────────────

function resolveWeights(strategy: RecommendationStrategy) {
  return { ...DEFAULT_WEIGHTS, ...STRATEGY_WEIGHTS[strategy] };
}

// ─── Route ────────────────────────────────────────────────────────────────────

/**
 * GET /api/recommendations
 *
 * Query params:
 *  strategy         "similar" | "trending" | "new-arrivals" | "cart"  (default: "similar")
 *  productId        Required for strategy=similar
 *  limit            Max products to return (default: 6, max: 24)
 *
 * Optional UserContext params (enables Signal 10 personalisation):
 *  preferredBrands     Comma-separated brand names the user has bought/viewed
 *  viewedCategories    Comma-separated category names from browse history
 *  conditionPreference "thrift" | "new" | "mixed"
 *
 * Examples:
 *  /api/recommendations?strategy=similar&productId=abc123&limit=6
 *  /api/recommendations?strategy=trending&limit=8
 *  /api/recommendations?strategy=similar&productId=abc123&preferredBrands=Nike,Adidas&viewedCategories=Sneakers
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const strategy = (searchParams.get("strategy") ||
    "similar") as RecommendationStrategy;
  const productId = searchParams.get("productId");
  const limit = Math.min(24, parseInt(searchParams.get("limit") || "6", 10));

  // Parse optional UserContext
  const userContext: UserContext | undefined = (() => {
    const preferredBrands = searchParams
      .get("preferredBrands")
      ?.split(",")
      .filter(Boolean);
    const viewedCategories = searchParams
      .get("viewedCategories")
      ?.split(",")
      .filter(Boolean);
    const conditionPreference = searchParams.get("conditionPreference") as
      | UserContext["conditionPreference"]
      | null;
    if (
      preferredBrands?.length ||
      viewedCategories?.length ||
      conditionPreference
    ) {
      return {
        preferredBrands: preferredBrands ?? [],
        viewedCategories: viewedCategories ?? [],
        conditionPreference: conditionPreference ?? "mixed",
      };
    }
    return undefined;
  })();

  if (!isSanityConfigured()) {
    return NextResponse.json({
      products: [],
      metadata: { candidateCount: 0, scoringTimeMs: 0, cacheHit: false },
    });
  }

  const startTime = Date.now();

  try {
    // ── Fetch source product ────────────────────────────────────────────────
    let sourceProduct: SanityProduct | null = null;

    if (strategy === "similar" && productId) {
      sourceProduct = await sanityClient.fetch(
        `*[_type == "product" && _id == $productId][0] ${PRODUCT_PROJECTION}`,
        { productId },
      );
      if (!sourceProduct) {
        return NextResponse.json({
          products: [],
          metadata: { candidateCount: 0, scoringTimeMs: 0, cacheHit: false },
        });
      }
    }

    // ── Candidate query — scoped to maximise relevance ─────────────────────
    //
    // BEFORE: always fetched the 50 most recently *updated* products globally.
    //   Problem: a well-matching product last edited 3 months ago was invisible.
    //
    // AFTER:  "similar" scopes to products sharing at least one category or tag
    //         with the source product, then limits to 100 candidates by listing date.
    //         Other strategies use listing date (listedAt/_createdAt) not edit date.
    //
    let rawCandidates: SanityProduct[];

    if (strategy === "similar" && sourceProduct) {
      rawCandidates = await sanityClient.fetch(
        `*[
          _type == "product" &&
          availableForSale == true &&
          _id != $sourceId &&
          (
            count((category)[@ in $sourceCategories]) > 0 ||
            count((tags)[@ in $sourceTags]) > 0
          )
        ] | order(_createdAt desc) [0...100] ${PRODUCT_PROJECTION}`,
        {
          sourceId: sourceProduct._id,
          sourceCategories: sourceProduct.category || [],
          // Cap tags to avoid GROQ query size limits; first 20 is enough
          sourceTags: (sourceProduct.tags || []).slice(0, 20),
        },
      );
    } else {
      // trending / new-arrivals / cart: sorted by listing date, not edit date
      rawCandidates = await sanityClient.fetch(
        `*[_type == "product" && availableForSale == true]
         | order(_createdAt desc) [0...50] ${PRODUCT_PROJECTION}`,
      );
    }

    const mappedCandidates = rawCandidates.map(mapSanityProduct);

    // ── Bundle affinity map (cached) ────────────────────────────────────────
    const bundleAffinityMap = await getCachedBundleAffinityMap();

    // ── Resolve weights for this strategy ──────────────────────────────────
    const weights: ReturnType<typeof resolveWeights> = resolveWeights(strategy);
    const scoringContext: ScoringContext = { bundleAffinityMap, weights };

    // ── Variant availability filter (similar only) ──────────────────────────
    let filteredCandidates = mappedCandidates;
    if (strategy === "similar" && sourceProduct) {
      const mappedSource = mapSanityProduct(sourceProduct);
      filteredCandidates = filterByVariantAvailability(
        mappedCandidates,
        mappedSource,
      );
    }

    // ── Score ───────────────────────────────────────────────────────────────
    let scoredProducts: ScoredProduct[];

    if (strategy === "new-arrivals") {
      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: scoreNewArrivals(product),
      }));
    } else if (strategy === "trending") {
      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: scoreTrending(product),
      }));
    } else if (strategy === "similar" && sourceProduct) {
      const mappedSource = mapSanityProduct(sourceProduct);
      // Pre-compute source sets ONCE outside the scoring loop
      const precomputed = precomputeSource(mappedSource);

      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: scoreProductPair(
          precomputed,
          mappedSource,
          product,
          scoringContext,
          userContext,
        ),
      }));
    } else {
      // Cart / unknown strategy — random shuffle as fallback
      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: Math.random(),
      }));
    }

    // ── Sort, diversify, slice ──────────────────────────────────────────────
    scoredProducts.sort((a, b) => b.score - a.score);

    const diverseProducts = injectDiversity(scoredProducts, {
      maxPerBrand: 2,
      maxPerCategory: 3,
    });

    const finalProducts = diverseProducts
      .slice(0, limit)
      .map((sp) => sp.product);
    const scoringTimeMs = Date.now() - startTime;

    return NextResponse.json({
      products: finalProducts,
      strategy,
      metadata: {
        candidateCount: rawCandidates.length,
        scoringTimeMs,
        cacheHit: false,
      },
    });
  } catch (error) {
    console.error("[recommendations] error:", error);
    return NextResponse.json(
      {
        products: [],
        metadata: { candidateCount: 0, scoringTimeMs: 0, cacheHit: false },
      },
      { status: 500 },
    );
  }
}
