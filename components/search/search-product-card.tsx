"use client";

import Price from "components/price";
import { searchEase, useSearchMotion } from "components/search/search-motion";
import { motion } from "framer-motion";
import { cn } from "lib/cn";
import type { Product } from "lib/commerce";
import {
    getProductBrand,
    getProductCategory,
    isStaffPick,
} from "lib/product-meta";
import Image from "next/image";
import Link from "next/link";

const PRODUCT_IMAGE_BG = "#f3f3f3";

function StaffPickBadge() {
  return (
    <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 text-sm font-medium text-[#b99651]">
      <img
        src="https://framerusercontent.com/images/R8O7wtxQUxaazZlYk3TRoGuBqo.svg?width=22&height=23"
        alt=""
        className="h-4 w-4"
        aria-hidden
      />
      Staff Pick
    </div>
  );
}

export function SearchProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { shouldAnimate } = useSearchMotion();
  const brand = getProductBrand(product);
  const category = getProductCategory(product);
  const staffPick = isStaffPick(product);
  const { amount, currencyCode } = product.priceRange.maxVariantPrice;
  const isOutOfStock = product.outOfStock;

  const imageBlock = (
    <div
      className={cn(
        "category-bento-product-image relative w-full overflow-hidden rounded-2xl bg-[#f3f3f3] aspect-square",
        isOutOfStock && "grayscale opacity-60",
      )}
    >
      {product.featuredImage?.url ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes="(max-width: 1023px) 45vw, 30vw"
          priority={priority}
          quality={90}
          style={{
            objectFit: 'contain',
            padding: product.featuredImage.scale && product.featuredImage.scale > 1 
              ? `${(1 - 1/product.featuredImage.scale) * 50}%` 
              : undefined,
          }}
          className={cn(
            "transition duration-500 ease-out",
            !isOutOfStock &&
              "group-hover:scale-[1.03]",
          )}
        />
      ) : null}
      {staffPick ? <StaffPickBadge /> : null}
    </div>
  );

  const meta = (
    <div
      className={cn("mt-3 space-y-1", isOutOfStock && "opacity-60 grayscale")}
    >
      <p className="text-sm text-neutral-400">
        {brand}
        <span className="mx-1 text-neutral-300">·</span>
        {category}
      </p>
      <h2 className="line-clamp-2 text-base font-normal text-neutral-900">
        <span className="font-semibold">{brand}</span> {product.title}
        {isOutOfStock ? (
          <span className="ml-1.5 text-sm font-medium text-red-600">
            Out of Stock
          </span>
        ) : null}
      </h2>
      <Price
        amount={amount}
        currencyCode={currencyCode}
        className="text-sm text-neutral-600"
        currencyCodeClassName="hidden"
      />
    </div>
  );

  const articleClass = "min-w-0";

  if (isOutOfStock) {
    if (!shouldAnimate) {
      return (
        <article className={articleClass}>
          <div className="block cursor-not-allowed">{imageBlock}</div>
          {meta}
        </article>
      );
    }
    return (
      <motion.article
        className={articleClass}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.45, ease: searchEase }}
      >
        <div className="block cursor-not-allowed">{imageBlock}</div>
        {meta}
      </motion.article>
    );
  }

  if (!shouldAnimate) {
    return (
      <article className={cn(articleClass, "group")}>
        <Link
          href={`/product/${product.handle}`}
          prefetch
          className="block min-w-0"
        >
          {imageBlock}
          {meta}
        </Link>
      </article>
    );
  }

  return (
    <motion.article
      className={cn(articleClass, "group")}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.45, ease: searchEase }}
    >
      <Link
        href={`/product/${product.handle}`}
        prefetch
        className="block min-w-0"
      >
        {imageBlock}
        {meta}
      </Link>
    </motion.article>
  );
}

export function SearchProductCardSkeleton() {
  return (
    <article className="min-w-0 animate-pulse">
      <div className="category-bento-product-image relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f3f3f3]">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: PRODUCT_IMAGE_BG }}
        />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-24 rounded-full bg-neutral-100" />
        <div className="h-4 w-full rounded-full bg-neutral-100" />
        <div className="h-3 w-16 rounded-full bg-neutral-100" />
      </div>
    </article>
  );
}
