"use client";

import Price from "components/price";
import { cn } from "lib/cn";
import type { Product } from "lib/commerce";
import {
  getProductBrand,
  getProductCategory,
  isStaffPick,
} from "lib/product-meta";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function StaffPickBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "absolute left-4 top-4 z-20 flex items-center gap-1.5 text-sm font-[10px]",
        "text-[#b99651]",
        compact && "max-lg:left-2 max-lg:top-2 max-lg:gap-1 max-lg:text-[10px]",
      )}
    >
      <img
        src="https://framerusercontent.com/images/R8O7wtxQUxaazZlYk3TRoGuBqo.svg?width=22&height=23"
        alt=""
        className={cn("h-4 w-4", compact && "max-lg:h-3 max-lg:w-3")}
        aria-hidden
      />
      Staff Pick
    </div>
  );
}

export function HomeProductCard({
  product,
  priority,
  href,
  density = "default",
}: {
  product: Product;
  priority?: boolean;
  href?: string;
  density?: "default" | "compact" | "bento";
}) {
  const brand = getProductBrand(product);
  const category = getProductCategory(product);
  const categoryHandle =
    (product as any).categoryHandle ||
    category?.toLowerCase().replace(/\s+/g, "-");
  const staffPick = isStaffPick(product);
  const { amount, currencyCode } = product.priceRange.maxVariantPrice;
  const isOutOfStock = product.outOfStock;
  const productHref = href ?? `/product/${product.handle}`;
  const isCompact = density === "compact";
  const isBento = density === "bento";
  const router = useRouter();

  const imageSizes = isCompact
    ? "(max-width: 1023px) 45vw, (min-width: 1024px) 30vw"
    : isBento
      ? "(max-width: 1023px) 45vw, 30vw"
      : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw";

  const imageBlock = (
    <div
      className={cn(
        "category-bento-product-image mb-4 sm:mb-0 lg:mb-0 t-resize relative w-full overflow-hidden rounded-2xl rounded-b-md bg-white",
        !isCompact && "aspect-square",
        isCompact && "aspect-square max-lg:rounded-xl",
        isBento && "aspect-square rounded-xl",
        isOutOfStock && "grayscale opacity-60",
      )}
    >
      {product.featuredImage?.url ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes={imageSizes}
          priority={priority}
          unoptimized
          style={{
            objectFit: 'contain',
            padding: product.featuredImage.scale && product.featuredImage.scale > 1 
              ? `${(1 - 1/product.featuredImage.scale) * 50}%` 
              : undefined,
          }}
          className={cn(
            "transition duration-500 ease-out",
            isCompact && "max-lg:object-cover",
            isBento && "object-cover",
            !isCompact &&
              "max-sm:object-cover",
            !isOutOfStock &&
              "group-hover:-translate-y-2",
          )}
        />
      ) : null}
      {staffPick ? <StaffPickBadge compact={isCompact || isBento} /> : null}

      {/* Product info overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-30 p-4",
          isCompact && "max-lg:p-2.5",
          isBento && "p-3",
          !isCompact && !isBento && "max-sm:p-2",
        )}
      >
        <p
          className={cn(
            "text-sm text-neutral-400",
            isCompact && "max-lg:text-[10px]",
            !isCompact && !isBento && "max-sm:text-[11px]",
          )}
        >
          <span
            className="hover:text-neutral-600 transition-colors cursor-pointer underline decoration-transparent hover:decoration-neutral-600 underline-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/category/${categoryHandle}`);
            }}
          >
            {brand}
          </span>
          <span className="mx-1 text-neutral-300 max-lg:mx-0.5">·</span>
          <span
            className="hover:text-neutral-600 transition-colors cursor-pointer underline decoration-transparent hover:decoration-neutral-600 underline-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/category/${categoryHandle}`);
            }}
          >
            {category}
          </span>
        </p>
        <div
          className={cn(
            "flex items-start justify-between gap-2 mt-1",
            isCompact && "max-lg:gap-1 max-lg:mt-0.5",
            !isCompact && !isBento && "max-sm:gap-2 max-sm:mt-1",
          )}
        >
          <h2
            className={cn(
              "line-clamp-2 text-sm font-normal text-neutral-900",
              isCompact && "max-lg:text-[11px] max-lg:leading-snug",
              !isCompact &&
                !isBento &&
                "max-sm:text-[12px] max-sm:leading-tight",
            )}
          >
            {product.title}
            {isOutOfStock ? (
              <span className="ml-1.5 text-sm font-medium text-red-600 max-lg:text-[10px]">
                Out of Stock
              </span>
            ) : null}
          </h2>
          <Price
            amount={amount}
            currencyCode={currencyCode}
            className={cn(
              "text-sm text-neutral-500 whitespace-nowrap font-mono tracking-tighter",
              isCompact && "max-lg:text-[10px]",
              !isCompact && !isBento && "max-sm:text-[11px]",
            )}
            currencyCodeClassName="hidden"
          />
        </div>
      </div>
    </div>
  );

  return (
    <article className="group min-w-0">
      {isOutOfStock ? (
        <div
          className="block cursor-not-allowed"
          onClick={(e) => e.preventDefault()}
        >
          {imageBlock}
        </div>
      ) : (
        <Link href={productHref} prefetch className="block min-w-0">
          {imageBlock}
        </Link>
      )}
    </article>
  );
}
