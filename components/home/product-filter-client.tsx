"use client";

import FilterBar from "components/home/product-filter";
import { useEffect, useState } from "react";

export function ProductFilterClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("Trending");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load from localStorage after mount
    const savedCategory = localStorage.getItem("productCategory");
    const savedSort = localStorage.getItem("productSort");
    if (savedCategory) setActiveCategory(savedCategory);
    if (savedSort) setActiveSort(savedSort);
  }, []);

  useEffect(() => {
    // Fetch all products to calculate which categories have items
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  // Persist sort and category to localStorage
  useEffect(() => {
    localStorage.setItem("productCategory", activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    localStorage.setItem("productSort", activeSort);
  }, [activeSort]);

  return (
    <>
      <FilterBar
        activeCategory={activeCategory}
        activeSort={activeSort}
        onCategoryChange={setActiveCategory}
        onSortChange={setActiveSort}
        products={products}
      />
      {/* TODO: Add HomeGrid component when available */}
      <div className="text-center py-8 text-gray-500">
        Product grid coming soon
      </div>
    </>
  );
}
