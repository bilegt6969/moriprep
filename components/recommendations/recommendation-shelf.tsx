"use client";

import { useEffect, useState } from "react";

// Placeholder for missing HomeProductCard component
function HomeProductCard({
  product,
  priority,
}: {
  product: any;
  priority?: boolean;
}) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold">{product?.title || "Product"}</h3>
      <p className="text-sm text-gray-600">{product?.price || "$0.00"}</p>
    </div>
  );
}

interface RecommendationShelfProps {
  strategy: "similar" | "trending" | "cart" | "new-arrivals";
  productId?: string;
  cartProductIds?: string[];
  title?: string;
  limit?: number;
}

export default function RecommendationShelf({
  strategy,
  productId,
  cartProductIds,
  title,
  limit = 6,
}: RecommendationShelfProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          strategy,
          limit: limit.toString(),
        });

        if (productId) params.append("productId", productId);
        if (cartProductIds && cartProductIds.length > 0) {
          params.append("cartProductIds", cartProductIds.join(","));
        }

        const response = await fetch(
          `/api/recommendations?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [strategy, productId, cartProductIds, limit]);

  const shelfTitle = title || getDefaultTitle(strategy);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-6">{shelfTitle}</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 md:w-72 lg:w-80 aspect-square bg-neutral-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-6">{shelfTitle}</h2>
      <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 sm:gap-4 scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-72 md:w-80 lg:w-80 border border-neutral-100 bg-[#f9f9f9] rounded-2xl p-4"
          >
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

function getDefaultTitle(
  strategy: RecommendationShelfProps["strategy"],
): string {
  switch (strategy) {
    case "similar":
      return "You might also like";
    case "trending":
      return "Trending now";
    case "cart":
      return "Complete your look";
    case "new-arrivals":
      return "New arrivals";
    default:
      return "Recommendations";
  }
}
