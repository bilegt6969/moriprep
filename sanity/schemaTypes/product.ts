import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Handle",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Sneakers", value: "sneakers" },
          { title: "Clothes", value: "clothes" },
          { title: "Accessories", value: "accessories" },
          { title: "Carry", value: "carry" },
          { title: "Watches", value: "watches" },
          { title: "Lifestyle", value: "lifestyle" },
          { title: "Fragrance", value: "fragrance" },
          { title: "Home", value: "home" },
          { title: "Tech", value: "tech" },
          { title: "Heritage", value: "heritage" },
          { title: "Art", value: "art" },
          { title: "Beauty", value: "beauty" },
        ],
      },
      description:
        "Select one or more categories for this product. It will appear in those category filters on the homepage.",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Price (MNT)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price (MNT)",
      type: "number",
      description:
        "Original price before discount. Leave empty if no discount.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      description:
        'Key-value pairs. e.g. Label: "Density" → Value: "0.42 g/cm³"',
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Like New", value: "like-new" },
          { title: "Good", value: "good" },
          { title: "Fair", value: "fair" },
        ],
      },
      description:
        "Leave empty for brand new products. Use for thrift / second-hand items.",
    }),
    defineField({
      name: "availableForSale",
      title: "Available for sale",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "outOfStock",
      title: "Out of stock",
      type: "boolean",
      initialValue: false,
      description: "If true, this product will be hidden from the home page.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
            defineField({
              name: "scale",
              title: "Image Scale",
              type: "number",
              description: "1.0 = original size (no padding), higher values = image scaled down with white padding (e.g., 1.25, 1.5, 2.0)",
              initialValue: 1.0,
              validation: (rule) => rule.min(1.0),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      description:
        'e.g. Name: "Size", Values: ["S", "M", "L"] or Name: "Color", Values: ["Black", "White"]',
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "values",
              title: "Values",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      description: "Add different versions of this product (e.g., different colors, sizes, or names with their own prices)",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Variant Name",
              type: "string",
              validation: (rule) => rule.required(),
              description: "e.g., 'Bass Pro Hat - Black', 'Bass Pro Hat - Red'",
            }),
            defineField({
              name: "color",
              title: "Color",
              type: "string",
              description: "e.g., 'Black', 'Red', 'Blue', 'Green'",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              description: "e.g., 'S', 'M', 'L', 'XL', 'One Size'",
            }),
            defineField({
              name: "availableForSale",
              title: "Available for sale",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "price",
              title: "Price (MNT)",
              type: "number",
              validation: (rule) => rule.required().min(0),
              description: "Price specific to this variant",
            }),
            defineField({
              name: "compareAtPrice",
              title: "Compare at Price (MNT)",
              type: "number",
              description: "Original price before discount. Leave empty if no discount on this variant.",
            }),
            defineField({
              name: "selectedOptions",
              title: "Additional Options",
              type: "array",
              description: "Any other options not covered by color/size fields",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Name",
                      type: "string",
                    }),
                    defineField({
                      name: "value",
                      title: "Value",
                      type: "string",
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              color: "color",
              size: "size",
              price: "price",
            },
            prepare({ title, color, size, price }) {
              return {
                title: title,
                subtitle: `${color || ''} ${size ? `• ${size}` : ''} • ${price} MNT`,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `Category: ${subtitle}` : undefined,
        media,
      };
    },
  },
});
