"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  brand: string;
  price: { amount: string; currencyCode: string };
  featuredImage?: any;
}

interface RecommendationsClientProps {
  strategy: "similar" | "trending" | "cart" | "new-arrivals";
  productId?: string;
  title?: string;
  limit?: number;
}

export function RecommendationsClient({
  strategy,
  productId,
  title,
  limit = 6,
}: RecommendationsClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          strategy,
          limit: limit.toString(),
        });

        if (productId) params.append("productId", productId);

        console.log("Fetching recommendations with params:", params.toString());
        const response = await fetch(
          `/api/recommendations?${params.toString()}`,
        );
        const data = await response.json();
        console.log("Recommendations response:", data);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [strategy, productId, limit]);

  const shelfTitle =
    title || (strategy === "trending" ? "Trending now" : "Recommendations");

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-6">{shelfTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-6">{shelfTitle}</h2>
        <div className="text-sm text-neutral-600">No products found</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-6">{shelfTitle}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-neutral-100 bg-[#f9f9f9] rounded-2xl p-4"
          >
            <div className="text-sm font-medium">{product.title}</div>
            <div className="text-xs text-neutral-600">{product.brand}</div>
            <div className="text-sm font-semibold mt-2">
              {product.price.amount} {product.price.currencyCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
