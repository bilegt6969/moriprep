import type {
    BestFor,
    CategoryPage,
    Collection,
    Hero,
    Image,
    KeyIngredientsSection,
    Menu,
    Page,
    Product,
    ProductHighlight,
    ProductOption,
    ProductVariant,
    PurchaseBundleOption,
    PurchaseBundles,
} from "lib/commerce/types";
import {
    DEFAULT_CURRENCY_CODE,
    DEFAULT_OPTION,
    HIDDEN_PRODUCT_TAG,
} from "lib/constants";
import { urlForImage } from "./image";

type SanityImage = {
  asset?: { _ref: string };
  alt?: string;
  scale?: number;
};

type SanityVariant = {
  _key: string;
  title: string;
  availableForSale?: boolean;
  price: number;
  currencyCode?: string;
  selectedOptions?: { name: string; value: string }[];
};

type SanityHighlight = {
  _key?: string;
  text: string;
  icon?: SanityImage;
};

type SanityPurchaseBundleOption = {
  title: string;
  price: number;
  compareAtPrice?: number;
  highlightLabel?: string;
  promoBadges?: string[];
  whatsIncludedUrl?: string;
  image?: SanityImage;
  variantId?: string;
};

type SanityPurchaseBundles = {
  single?: SanityPurchaseBundleOption;
  twoPack?: SanityPurchaseBundleOption;
  stylingKit?: SanityPurchaseBundleOption;
};

type SanityBestForItem = {
  label: string;
  icon?: SanityImage;
};

type SanityBestFor = {
  hairType?: SanityBestForItem;
  hairLength?: SanityBestForItem;
};

type SanityKeyIngredient = {
  _key?: string;
  name: string;
  description: string;
  image: SanityImage;
};

type SanityKeyIngredientsSection = {
  title?: string;
  subtitle?: string;
  ingredients?: SanityKeyIngredient[];
  featureBadges?: SanityHighlight[];
  fullIngredientListUrl?: string;
};

type SanityProduct = {
  _id: string;
  _updatedAt: string;
  brand?: string;
  category?: string[];
  categoryHandle?: string;
  categoryTitle?: string;
  condition?: string;
  title: string;
  slug: { current: string };
  price?: number;
  description?: string;
  descriptionHtml?: string;
  availableForSale?: boolean;
  outOfStock?: boolean;
  tags?: string[];
  images?: SanityImage[];
  options?: { name: string; values: string[] }[];
  variants?: SanityVariant[];
  seo?: { title?: string; description?: string };
  highlights?: SanityHighlight[];
  purchaseBundles?: SanityPurchaseBundles;
  bestFor?: SanityBestFor;
  keyIngredients?: SanityKeyIngredientsSection;
  specs?: { label: string; value: string }[];
};

type SanityCollection = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  description?: string;
  seo?: { title?: string; description?: string };
  products?: SanityProduct[];
};

type SanityCategoryPage = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  category?: string;
  description?: string;
  categoryLogo?: SanityImage;
  showOnHome?: boolean;
  homeSortOrder?: number;
  seo?: { title?: string; description?: string };
  featuredProduct?: SanityProduct | null;
};

type SanityPage = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  body?: string;
  bodySummary?: string;
  seo?: { title?: string; description?: string };
};

type SanityMenu = {
  items?: { title: string; path: string }[];
};

type SanityHero = {
  _id: string;
  title: string;
  desktopImage?: SanityImage;
  mobileImage?: SanityImage;
  enabled?: boolean;
  sortOrder?: number;
};

type SanityHomeConfig = {
  _id: string;
  featuredProducts?: SanityProduct[];
  categorySections?: {
    category?: string;
    enabled?: boolean;
    sortOrder?: number;
  }[];
};

function mapImage(
  image: SanityImage,
  fallbackAlt: string,
  width: number = 1200,
  height: number = 1200,
): Image {
  const url = urlForImage(image).width(width).height(height).url();
  return {
    url,
    altText: image.alt || fallbackAlt,
    width,
    height,
    scale: image.scale || 1.0,
  };
}

function mapOptionalImage(
  image: SanityImage | undefined,
  fallbackAlt: string,
  width: number = 1200,
  height: number = 1200,
): Image | undefined {
  if (!image?.asset?._ref) {
    return undefined;
  }
  return mapImage(image, fallbackAlt, width, height);
}

function mapHighlight(highlight: SanityHighlight): ProductHighlight {
  return {
    text: highlight.text,
    icon: mapOptionalImage(highlight.icon, highlight.text),
  };
}

function mapPurchaseBundleOption(
  option: SanityPurchaseBundleOption,
  fallbackVariantId: string | undefined,
): PurchaseBundleOption {
  return {
    title: option.title,
    price: option.price,
    compareAtPrice: option.compareAtPrice,
    highlightLabel: option.highlightLabel,
    promoBadges: option.promoBadges,
    whatsIncludedUrl: option.whatsIncludedUrl,
    image: mapOptionalImage(option.image, option.title),
    // Use explicitly set variantId first, fall back to first variant _key
    variantId: option.variantId || fallbackVariantId,
  };
}

function mapPurchaseBundles(
  bundles: SanityPurchaseBundles,
  variants: SanityVariant[],
  productId: string, // ← add this
): PurchaseBundles | undefined {
  // Auto-fill: use the first variant's _key as the fallback for all bundle options
  const fallbackVariantId = variants[0]?._key ?? productId;

  const mapped: PurchaseBundles = {
    single: bundles.single
      ? mapPurchaseBundleOption(bundles.single, fallbackVariantId)
      : undefined,
    twoPack: bundles.twoPack
      ? mapPurchaseBundleOption(bundles.twoPack, fallbackVariantId)
      : undefined,
    stylingKit: bundles.stylingKit
      ? mapPurchaseBundleOption(bundles.stylingKit, fallbackVariantId)
      : undefined,
  };

  if (!mapped.single && !mapped.twoPack && !mapped.stylingKit) {
    return undefined;
  }

  return mapped;
}

function mapBestForItem(item: SanityBestForItem): BestFor["hairType"] {
  return {
    label: item.label,
    icon: mapOptionalImage(item.icon, item.label),
  };
}

function mapBestFor(bestFor: SanityBestFor): BestFor {
  return {
    hairType: bestFor.hairType ? mapBestForItem(bestFor.hairType) : undefined,
    hairLength: bestFor.hairLength
      ? mapBestForItem(bestFor.hairLength)
      : undefined,
  };
}

function mapKeyIngredientsSection(
  section: SanityKeyIngredientsSection,
): KeyIngredientsSection {
  return {
    title: section.title,
    subtitle: section.subtitle,
    ingredients:
      section.ingredients?.map((ingredient) => ({
        name: ingredient.name,
        description: ingredient.description,
        image: mapImage(ingredient.image, ingredient.name),
      })) ?? [],
    featureBadges: section.featureBadges?.map(mapHighlight),
    fullIngredientListUrl: section.fullIngredientListUrl,
  };
}

function mapVariant(
  variant: SanityVariant,
  productTitle: string,
  index: number,
): ProductVariant {
  const selectedOptions =
    variant.selectedOptions?.filter((o) => o.name && o.value) ?? [];

  if (selectedOptions.length === 0) {
    selectedOptions.push({ name: "Title", value: DEFAULT_OPTION });
  }

  return {
    id: `${variant._key || index}`,
    title: variant.title || DEFAULT_OPTION,
    availableForSale: variant.availableForSale ?? true,
    selectedOptions,
    price: {
      amount: String(variant.price ?? 0),
      currencyCode: DEFAULT_CURRENCY_CODE,
    },
  };
}

function priceRangeFromVariants(variants: ProductVariant[]) {
  const amounts = variants.map((v) => Number(v.price.amount));
  const currencyCode = DEFAULT_CURRENCY_CODE;
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);

  return {
    minVariantPrice: { amount: String(min), currencyCode },
    maxVariantPrice: { amount: String(max), currencyCode },
  };
}

export function mapSanityProduct(
  doc: SanityProduct,
  filterHidden = true,
): Product | undefined {
  const tags = doc.tags ?? [];
  if (filterHidden && tags.includes(HIDDEN_PRODUCT_TAG)) {
    return undefined;
  }

  const currencyCode = DEFAULT_CURRENCY_CODE;
  const basePrice =
    doc.price != null ? { amount: String(doc.price), currencyCode } : undefined;

  const rawVariants = doc.variants ?? [];

  const variants = rawVariants.map((variant, index) =>
    mapVariant(variant, doc.title, index),
  );

  if (variants.length === 0) {
    variants.push({
      id: doc._id, // ← was "default", now uses the actual product _id
      title: DEFAULT_OPTION,
      availableForSale: doc.availableForSale ?? true,
      selectedOptions: [{ name: "Title", value: DEFAULT_OPTION }],
      price: basePrice ?? { amount: "0", currencyCode },
    });
  }

  const images =
    doc.images?.map((image) => mapImage(image, doc.title, 1000, 1000)) ??
    ([] as Image[]);

  const featuredImage = images[0] ?? {
    url: "",
    altText: doc.title,
    width: 0,
    height: 0,
    scale: 1.0,
  };

  const options: ProductOption[] =
    doc.options?.map((option, index) => ({
      id: String(index),
      name: option.name,
      values: option.values ?? [],
    })) ?? [];

  // Handle category - ensure it's always a string (use first category from array)
  let categoryHandle = doc.categoryHandle;
  let categoryTitle = doc.categoryTitle;

  // If category is an array, use the first element
  if (doc.category && Array.isArray(doc.category) && doc.category.length > 0) {
    categoryHandle = doc.category[0];
    categoryTitle = doc.category[0];
  }

  // If categoryHandle is an object (reference), extract the string value
  if (categoryHandle && typeof categoryHandle === "object") {
    categoryHandle = (categoryHandle as any)._ref || String(categoryHandle);
  }
  if (categoryTitle && typeof categoryTitle === "object") {
    categoryTitle = (categoryTitle as any)._ref || String(categoryTitle);
  }

  // Ensure they are strings
  categoryHandle = typeof categoryHandle === "string" ? categoryHandle : "";
  categoryTitle =
    typeof categoryTitle === "string" ? categoryTitle : categoryHandle;

  return {
    id: doc._id,
    handle: doc.slug.current,
    availableForSale: doc.availableForSale ?? true,
    outOfStock: doc.outOfStock,
    brand: doc.brand || "",
    categories: doc.category,
    categoryHandle,
    categoryTitle,
    condition: doc.condition,
    title: doc.title,
    description: doc.description || "",
    descriptionHtml: doc.descriptionHtml || doc.description || "",
    options,
    priceRange: priceRangeFromVariants(variants),
    variants,
    featuredImage,
    images,
    seo: {
      title: doc.seo?.title || doc.title,
      description: doc.seo?.description || doc.description || "",
    },
    tags,
    updatedAt: doc._updatedAt,
    price: basePrice,
    highlights: doc.highlights?.map(mapHighlight),
    // Pass rawVariants so bundle options can auto-resolve variantId from _key
    purchaseBundles: doc.purchaseBundles
      ? mapPurchaseBundles(doc.purchaseBundles, rawVariants, doc._id)
      : undefined,
    bestFor: doc.bestFor ? mapBestFor(doc.bestFor) : undefined,
    keyIngredients: doc.keyIngredients
      ? mapKeyIngredientsSection(doc.keyIngredients)
      : undefined,
    specs: doc.specs,
  };
}

export function mapSanityCollection(doc: SanityCollection): Collection {
  return {
    handle: doc.slug.current,
    title: doc.title,
    description: doc.description || "",
    seo: {
      title: doc.seo?.title || doc.title,
      description: doc.seo?.description || doc.description || "",
    },
    updatedAt: doc._updatedAt,
    path: `/search/${doc.slug.current}`,
  };
}

export function mapSanityCategoryPage(
  doc: SanityCategoryPage,
  products: Product[],
): CategoryPage {
  const featuredProduct = doc.featuredProduct
    ? mapSanityProduct(doc.featuredProduct)
    : undefined;

  return {
    id: doc._id,
    handle: doc.slug.current,
    title: doc.title,
    category: doc.category,
    description: doc.description || "",
    seo: {
      title: doc.seo?.title || doc.title,
      description: doc.seo?.description || doc.description || "",
    },
    updatedAt: doc._updatedAt,
    path: `/category/${doc.slug.current}`,
    logo: mapOptionalImage(doc.categoryLogo, doc.title),
    featuredProduct: featuredProduct ?? undefined,
    products,
    showOnHome: doc.showOnHome ?? true,
    homeSortOrder: doc.homeSortOrder ?? 0,
  };
}

export function mapSanityPage(doc: SanityPage): Page {
  return {
    id: doc._id,
    title: doc.title,
    handle: doc.slug.current,
    body: doc.body || "",
    bodySummary: doc.bodySummary || "",
    seo: doc.seo
      ? {
          title: doc.seo.title || doc.title,
          description: doc.seo.description || "",
        }
      : undefined,
    createdAt: doc._createdAt,
    updatedAt: doc._updatedAt,
  };
}

function mapHeroImage(
  image: SanityImage | undefined,
  fallbackAlt: string,
  width: number,
  height: number,
): Image {
  if (!image?.asset?._ref) {
    return { url: "", altText: fallbackAlt, width, height };
  }

  const url = urlForImage(image).width(width).height(height).fit("crop").url();
  return {
    url,
    altText: image.alt || fallbackAlt,
    width,
    height,
  };
}

export function mapSanityHero(doc: SanityHero): Hero {
  return {
    id: doc._id,
    title: doc.title,
    desktopImage: mapHeroImage(doc.desktopImage, doc.title, 1920, 1080),
    mobileImage: mapHeroImage(doc.mobileImage, doc.title, 1080, 1920),
    enabled: doc.enabled ?? true,
    sortOrder: doc.sortOrder ?? 0,
  };
}

export function mapSanityMenu(doc: SanityMenu): Menu[] {
  return (
    doc.items?.map((item) => ({
      title: item.title,
      path: item.path,
    })) ?? []
  );
}

export type {
    SanityCategoryPage,
    SanityCollection,
    SanityHero,
    SanityMenu,
    SanityPage,
    SanityProduct
};

