import type {
    Cart,
    CategoryPage,
    Collection,
    Hero,
    HomeConfig,
    Menu,
    Page,
    Product,
} from "lib/commerce/types";
import { HIDDEN_PRODUCT_TAG, TAGS } from "lib/constants";
import {
    cacheLife, // 🌟 Stabilized in Next.js 16
    cacheTag, // 🌟 Stabilized in Next.js 16
    revalidateTag,
} from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isSanityConfigured } from "sanity/env";
import {
    addToSanityCart,
    createSanityCart,
    getSanityCart,
    removeFromSanityCart,
    updateSanityCart,
} from "./cart";
import { sanityClient } from "./client";
import {
    mapSanityCategoryPage,
    mapSanityCollection,
    mapSanityHero,
    mapSanityMenu,
    mapSanityPage,
    mapSanityProduct,
    type SanityCategoryPage,
    type SanityCollection,
    type SanityHero,
    type SanityMenu,
    type SanityPage,
    type SanityProduct,
} from "./mappers";

const productFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug,
  brand,
  category,
  "categoryHandle": category[0],
  "categoryTitle": category[0],
  condition,
  price,
  description,
  descriptionHtml,
  availableForSale,
  outOfStock,
  tags,
  images[]{
    asset,
    alt,
    scale,
  },
  options,
  variants,
  seo,
  highlights,
  purchaseBundles,
  bestFor,
  keyIngredients,
  specs
`;

const productsQuery = `*[_type == "product"] | order(_updatedAt desc) {${productFields}}`;

const productByHandleQuery = `*[_type == "product" && slug.current == $handle][0]{${productFields}}`;

const collectionsQuery = `*[_type == "collection"] | order(title asc) {
  _id,
  _updatedAt,
  title,
  "slug": slug,
  description,
  seo
}`;

const collectionByHandleQuery = `*[_type == "collection" && slug.current == $handle][0]{
  _id,
  _updatedAt,
  title,
  "slug": slug,
  description,
  seo,
  "products": products[]->{${productFields}}
}`;

const menuByHandleQuery = `*[_type == "menu" && slug.current == $handle][0]{
  items
}`;

const heroFields = `
  _id,
  title,
  desktopImage,
  mobileImage,
  enabled,
  sortOrder
`;

const heroesQuery = `*[_type == "hero" && enabled == true] | order(sortOrder asc, _createdAt desc) {${heroFields}}`;

const pageByHandleQuery = `*[_type == "page" && slug.current == $handle][0]{
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug,
  body,
  bodySummary,
  seo
}`;

const pagesQuery = `*[_type == "page"] | order(title asc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug,
  body,
  bodySummary,
  seo
}`;

const categoryPageFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug,
  category,
  description,
  categoryLogo,
  showOnHome,
  homeSortOrder,
  seo,
  "featuredProduct": featuredProduct->{${productFields}}
`;

const categoryPagesQuery = `*[_type == "categoryPage"] | order(homeSortOrder asc, title asc) {${categoryPageFields}}`;

const categoryPageByHandleQuery = `*[_type == "categoryPage" && slug.current == $handle][0]{${categoryPageFields}}`;

const productsByCategoryHandleQuery = `*[_type == "product" && $handle in category] | order(_updatedAt desc) {${productFields}}`;

const homeConfigFields = `
  _id,
  "featuredProducts": featuredProducts[]->{${productFields}},
  "categorySections": categorySections[]{
    "category": category,
    enabled,
    sortOrder
  },
  blackCardDescription
`;

const homeConfigQuery = `*[_type == "homeConfig"][0]{${homeConfigFields}}`;

function sortProducts(
  products: Product[],
  sortKey?: string,
  reverse?: boolean,
): Product[] {
  const sorted = [...products];

  switch (sortKey) {
    case "PRICE":
      sorted.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount),
      );
      break;
    case "CREATED_AT":
    case "CREATED":
      sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
    default:
      break;
  }

  if (reverse) {
    sorted.reverse();
  }

  return sorted;
}

function filterProducts(
  products: Product[],
  query?: string,
  categoryHandle?: string,
): Product[] {
  let filtered = products;

  // Filter by category
  if (categoryHandle && categoryHandle !== "all") {
    filtered = filtered.filter((product) => {
      // Check if category is in the categories array
      if (product.categories && Array.isArray(product.categories)) {
        return product.categories.includes(categoryHandle);
      }
      // Fallback to categoryHandle for backward compatibility
      return product.categoryHandle === categoryHandle;
    });
  }

  // Filter by query
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }

  return filtered;
}

export async function createCart(): Promise<Cart> {
  return createSanityCart();
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  return addToSanityCart(lines);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  return removeFromSanityCart(lineIds);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  return updateSanityCart(lines);
}

export async function getCart(): Promise<Cart | undefined> {
  "use cache: private";
  cacheTag(TAGS.cart);
  cacheLife("seconds");
  return getSanityCart();
}

export async function getCategoryPages(): Promise<CategoryPage[]> {
  "use cache";
  cacheTag(TAGS.categoryPages, TAGS.products);
  cacheLife("minutes"); // Changed from days to minutes for faster updates

  if (!isSanityConfigured()) {
    return [];
  }

  const docs =
    await sanityClient.fetch<SanityCategoryPage[]>(categoryPagesQuery);

  // Fetch products for each category to get item counts
  const categoryPagesWithProducts = await Promise.all(
    docs.map(async (doc) => {
      const productDocs = await sanityClient.fetch<SanityProduct[]>(
        productsByCategoryHandleQuery,
        { handle: doc.category || doc.slug.current },
      );

      const products = productDocs
        .map((product) => mapSanityProduct(product))
        .filter((product): product is Product => Boolean(product));

      return mapSanityCategoryPage(doc, products);
    }),
  );

  return categoryPagesWithProducts;
}

export async function getCategoryPage(
  handle: string,
): Promise<CategoryPage | undefined> {
  "use cache";
  cacheTag(TAGS.categoryPages, TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return undefined;
  }

  const doc = await sanityClient.fetch<SanityCategoryPage | null>(
    categoryPageByHandleQuery,
    { handle },
  );

  if (!doc) {
    return undefined;
  }

  // Use the category field from the category page to fetch products
  const productDocs = await sanityClient.fetch<SanityProduct[]>(
    productsByCategoryHandleQuery,
    { handle: doc.category || handle },
  );

  const products = productDocs
    .map((product) => mapSanityProduct(product))
    .filter((product): product is Product => Boolean(product));

  return mapSanityCategoryPage(doc, products);
}

export async function getCategoryPagesForHome(): Promise<CategoryPage[]> {
  const pages = await getCategoryPages();
  return pages.filter((page) => page.showOnHome);
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return undefined;
  }

  const doc = await sanityClient.fetch<SanityCollection | null>(
    collectionByHandleQuery,
    { handle },
  );

  return doc ? mapSanityCollection(doc) : undefined;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    console.log(
      `Skipping getCollectionProducts for '${collection}' - Sanity not configured`,
    );
    return [];
  }

  if (collection.startsWith("hidden-")) {
    const docs = await sanityClient.fetch<SanityProduct[]>(productsQuery);
    return sortProducts(
      docs
        .map((doc) => mapSanityProduct(doc))
        .filter((product): product is Product => Boolean(product)),
      sortKey,
      reverse,
    );
  }

  const doc = await sanityClient.fetch<SanityCollection | null>(
    collectionByHandleQuery,
    { handle: collection },
  );

  if (!doc?.products?.length) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return sortProducts(
    doc.products
      .map((product) => mapSanityProduct(product))
      .filter((product): product is Product => Boolean(product)),
    sortKey,
    reverse,
  );
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const allCollection: Collection = {
    handle: "",
    title: "All",
    description: "All products",
    seo: { title: "All", description: "All products" },
    path: "/search",
    updatedAt: new Date().toISOString(),
  };

  if (!isSanityConfigured()) {
    console.log("Skipping getCollections - Sanity not configured");
    return [allCollection];
  }

  const docs = await sanityClient.fetch<SanityCollection[]>(collectionsQuery);

  return [
    allCollection,
    ...docs
      .map((doc) => mapSanityCollection(doc))
      .filter((collection) => !collection.handle.startsWith("hidden")),
  ];
}

export async function getHeroes(): Promise<Hero[]> {
  "use cache";
  cacheTag(TAGS.hero);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityHero[]>(heroesQuery);
  return docs.map(mapSanityHero);
}

export async function getHero(): Promise<Hero | undefined> {
  const heroes = await getHeroes();
  return heroes[0];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!isSanityConfigured()) {
    console.log(`Skipping getMenu for '${handle}' - Sanity not configured`);
    return [];
  }

  const doc = await sanityClient.fetch<SanityMenu | null>(menuByHandleQuery, {
    handle,
  });

  return doc ? mapSanityMenu(doc) : [];
}

export async function getPage(handle: string): Promise<Page> {
  "use cache";
  cacheTag(TAGS.categoryPages);
  cacheLife("days");

  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured");
  }

  const doc = await sanityClient.fetch<SanityPage | null>(pageByHandleQuery, {
    handle,
  });

  if (!doc) {
    throw new Error(`Page not found: ${handle}`);
  }

  return mapSanityPage(doc);
}

export async function getPages(): Promise<Page[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityPage[]>(pagesQuery);
  return docs.map(mapSanityPage);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    console.log(`Skipping getProduct for '${handle}' - Sanity not configured`);
    return undefined;
  }

  const doc = await sanityClient.fetch<SanityProduct | null>(
    productByHandleQuery,
    { handle },
  );

  return doc ? mapSanityProduct(doc, false) : undefined;
}

export async function getProductRecommendations(
  productId: string,
  productTags?: string[],
  productCategory?: string,
  productTitle?: string,
  productDescription?: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityProduct[]>(productsQuery);
  const products = docs
    .filter((doc) => doc._id !== productId)
    .map((doc) => mapSanityProduct(doc))
    .filter((product): product is Product => Boolean(product));

  // If no criteria provided, return empty array
  if (
    !productTags ||
    productTags.length === 0 ||
    !productCategory ||
    !productTitle
  ) {
    return [];
  }

  // Extract words from title and description for matching
  const currentWords = new Set(
    [
      ...productTitle.toLowerCase().split(/\s+/),
      ...(productDescription?.toLowerCase().split(/\s+/) || []),
    ].filter((word) => word.length > 3),
  );

  // Score products based on multiple factors
  const scoredProducts = products.map((product) => {
    let score = 0;

    // Tag matching (highest priority)
    const productTagSet = new Set(product.tags.map((tag) => tag.toLowerCase()));
    const currentTagSet = new Set(productTags.map((tag) => tag.toLowerCase()));
    const matchingTags = [...currentTagSet].filter((tag) =>
      productTagSet.has(tag),
    );
    score += matchingTags.length * 10;

    // Category matching (medium priority)
    if (product.categoryHandle === productCategory) {
      score += 5;
    }

    // Repeated words in title/description (lower priority)
    const productWords = new Set(
      [
        ...product.title.toLowerCase().split(/\s+/),
        ...(product.description?.toLowerCase().split(/\s+/) || []),
      ].filter((word) => word.length > 3),
    );
    const matchingWords = [...currentWords].filter((word) =>
      productWords.has(word),
    );
    score += matchingWords.length * 2;

    return { product, score };
  });

  // Sort by score and return top 4
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.product);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  categoryHandle,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  categoryHandle?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityProduct[]>(productsQuery);
  const products = docs
    .map((doc) => mapSanityProduct(doc))
    .filter((product): product is Product => Boolean(product));

  return sortProducts(
    filterProducts(products, query, categoryHandle),
    sortKey,
    reverse,
  );
}

export async function getHomeConfig(): Promise<HomeConfig | undefined> {
  "use cache";
  cacheTag(TAGS.homeConfig, TAGS.products, TAGS.categoryPages);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return undefined;
  }

  const doc = await sanityClient.fetch<any | null>(homeConfigQuery);

  if (!doc) {
    return undefined;
  }

  // Fetch products for each category section
  const categorySectionsWithProducts = await Promise.all(
    (doc.categorySections || [])
      .filter((section: any) => section.enabled && section.category)
      .map(async (section: any) => {
        if (!section.category) return section;

        const categoryHandle = section.category;
        const productDocs = await sanityClient.fetch<SanityProduct[]>(
          productsByCategoryHandleQuery,
          { handle: categoryHandle },
        );

        const products = productDocs
          .map((product) => mapSanityProduct(product))
          .filter((product): product is Product => Boolean(product))
          .slice(0, 5);

        // Create a simple category object from the string
        const categoryObj = {
          id: `category-${categoryHandle}`,
          handle: categoryHandle,
          title:
            categoryHandle.charAt(0).toUpperCase() + categoryHandle.slice(1),
          description: `${categoryHandle} products`,
          products,
          showOnHome: true,
          homeSortOrder: section.sortOrder || 0,
          updatedAt: new Date().toISOString(),
          path: `/category/${categoryHandle}`,
          logo: undefined,
          featuredProduct: products[0],
          seo: {
            title: categoryHandle,
            description: `${categoryHandle} products`,
          },
        };

        return {
          ...section,
          category: categoryObj,
        };
      }),
  );

  const featuredProducts =
    doc.featuredProducts
      ?.map((product: SanityProduct) => mapSanityProduct(product))
      .filter((product: Product | undefined): product is Product =>
        Boolean(product),
      )
      .slice(0, 5) ?? [];

  return {
    id: doc._id,
    featuredProducts,
    categorySections: categorySectionsWithProducts
      .filter((section: any) => section.enabled)
      .map((section: any) => ({
        category: section.category,
        enabled: section.enabled,
        sortOrder: section.sortOrder,
      }))
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder),
    blackCardDescription: doc.blackCardDescription,
  };
}

export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  const headerSecret = req.headers.get("x-revalidation-secret");
  const secret =
    (authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null) ??
    headerSecret ??
    req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.SANITY_REVALIDATION_SECRET) {
    console.error("Invalid Sanity revalidation secret.");
    return NextResponse.json({ status: 401 });
  }

  revalidateTag(TAGS.collections, "days");
  revalidateTag(TAGS.categoryPages, "days");
  revalidateTag(TAGS.products, "days");
  revalidateTag(TAGS.hero, "days");
  revalidateTag(TAGS.homeConfig, "days");

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export { HIDDEN_PRODUCT_TAG };
