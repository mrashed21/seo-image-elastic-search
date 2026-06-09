import { zod_boolean_from_formdata } from "@/app/utils/zod-helpers";
import z from "zod";

const object_id_regex = /^[0-9a-fA-F]{24}$/;

const required_text_field = (label: string, min = 1, max = 255) =>
  z
    .string({
      error: `${label} is required`,
    })
    .trim()
    .min(min, {
      message: `${label} must be at least ${min} characters`,
    })
    .max(max, {
      message: `${label} cannot exceed ${max} characters`,
    });

const optional_text_field = (max = 255) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(max).optional(),
  );

const object_id_field = (label: string) =>
  z
    .string({
      error: `${label} is required`,
    })
    .trim()
    .regex(object_id_regex, {
      message: `Invalid ${label}`,
    });

const optional_object_id_field = () =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z
      .string()
      .trim()
      .regex(object_id_regex, {
        message: "Invalid ObjectId",
      })
      .optional(),
  );

const number_from_formdata = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isNaN(parsed) ? value : parsed;
  }

  return value;
};

const optional_number_field = () =>
  z.preprocess(number_from_formdata, z.number().finite().optional());

const positive_optional_number_field = () =>
  z.preprocess(number_from_formdata, z.number().finite().min(0).optional());

const string_array_field = () =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return [];
      }

      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === "string") {
        const trimmed_value = value.trim();

        if (!trimmed_value) {
          return [];
        }

        try {
          const parsed_value = JSON.parse(trimmed_value);

          if (Array.isArray(parsed_value)) {
            return parsed_value;
          }
        } catch {
          return trimmed_value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }

        return [trimmed_value];
      }

      return value;
    },
    z.array(z.string().trim().min(1)).default([]),
  );

const embedding_schema = z.object({
  vector: z.array(z.number()).optional(),
  model: z.string().trim().optional(),
  generated_at: z.coerce.date().optional(),
  status: z.enum(["pending", "done", "failed"]).optional(),
});

const image_asset_schema = z.object({
  image: required_text_field("Image"),
  caption: optional_text_field(),
  alt_text: optional_text_field(),
  embedding: embedding_schema.optional(),
});

const product_variation_schema = z.object({
  variation_name: required_text_field("Variation name", 1, 255),
  variation_sku: optional_text_field(255),
  variation_price: optional_number_field(),
  variation_discount_price: optional_number_field(),
  variation_buying_price: optional_number_field(),
  variation_quantity: positive_optional_number_field(),
  variation_image: optional_text_field(),
  image_caption: optional_text_field(),
  embedding: embedding_schema.optional(),
});

const attributes_schema = z.object({
  attribute_name: optional_text_field(255),
  attribute_values: string_array_field().optional(),
});

const product_meta_schema = z.object({
  meta_title: optional_text_field(255),
  meta_description: optional_text_field(500),
  meta_keywords: string_array_field().optional(),
  og_title: optional_text_field(255),
  og_description: optional_text_field(500),
  og_image: optional_text_field(2048),
  canonical_url: optional_text_field(2048),
  schema_product: z.any().optional(),
  schema_breadcrumb: z.any().optional(),
});

export const create_product_schema = z
  .object({
    category_id: object_id_field("Category id"),
    sub_category_id: optional_object_id_field(),
    brand_id: optional_object_id_field(),

    product_name_en: required_text_field("Product name (English)", 2, 255),
    product_name_bn: optional_text_field(255),

    product_slug: required_text_field("Product slug", 2, 255).transform(
      (value) => value.toLowerCase(),
    ),

    product_sku: optional_text_field(255),
    product_barcode: optional_text_field(255),
    product_bar_code_image: optional_text_field(2048),
    product_unit_name: optional_text_field(100),

    search_keywords: string_array_field().optional(),
    product_tags: string_array_field().optional(),

    is_variation: zod_boolean_from_formdata,

    product_status: z.enum(["active", "inactive"]).optional(),
    is_featured: zod_boolean_from_formdata.optional().default(false),

    product_image: optional_text_field(2048),
    image_caption: optional_text_field(500),
    image_alt_text: optional_text_field(500),
    product_image_embedding: embedding_schema.optional(),

    other_images: z.array(image_asset_schema).optional().default([]),

    product_price: positive_optional_number_field(),
    product_discount_price: positive_optional_number_field(),
    product_buying_price: positive_optional_number_field(),

    product_quantity: positive_optional_number_field(),
    alert_quantity: positive_optional_number_field(),
    sold_quantity: positive_optional_number_field(),

    variations: z.array(product_variation_schema).optional().default([]),
    attributes_details: z.array(attributes_schema).optional().default([]),

    short_description_en: optional_text_field(5000),
    short_description_bn: optional_text_field(5000),
    product_description_en: optional_text_field(20000),
    product_description_bn: optional_text_field(20000),

    weight: optional_number_field(),
    length: optional_number_field(),
    width: optional_number_field(),
    height: optional_number_field(),

    average_rating: z.preprocess(
      number_from_formdata,
      z.number().finite().min(0).max(5).optional(),
    ),
    review_count: positive_optional_number_field(),

    total_views: positive_optional_number_field(),
    total_searches: positive_optional_number_field(),
    total_sales: positive_optional_number_field(),
    total_wishlist: positive_optional_number_field(),

    meta: product_meta_schema.optional(),
    
    admin_published_id: optional_object_id_field(),
    admin_updated_id: optional_object_id_field(),

    es_indexed: zod_boolean_from_formdata.optional().default(false),
    es_document_id: optional_text_field(255),
    es_indexed_at: z.coerce.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.is_variation &&
      (!data.variations || data.variations.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["variations"],
        message: "Variations are required when is_variation is true",
      });
    }
  });
