"use client";

import { useEffect, useState } from "react";

const RECENTLY_VIEWED_KEY = "recentlyViewed";
const MAX_PRODUCTS = 5;

export function RecentlyViewedSection() {
  const [recentProducts, setRecentProducts] = useState<string[]>([]);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentProducts(
          Array.isArray(parsed) ? parsed.slice(0, MAX_PRODUCTS) : [],
        );
      } catch (e) {
        console.error("Failed to parse recently viewed:", e);
      }
    }
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentProducts.map((handle) => (
          <RecentlyViewedProductCard key={handle} handle={handle} />
        ))}
      </div>
    </div>
  );
}

function RecentlyViewedProductCard({ handle }: { handle: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${handle}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [handle]);

  if (loading || !product) {
    return (
      <div className="border rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold">{product?.title || "Product"}</h3>
      <p className="text-sm text-gray-600">{product?.price || "$0.00"}</p>
    </div>
  );
}
