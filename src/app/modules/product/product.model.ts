import { Schema, model } from "mongoose";
import {
  IAttributesArray,
  IEmbedding,
  IImageAsset,
  IProductInterface,
  IProductMeta,
  IProductVariation,
} from "./product.interface";

// Embedding Schema

const EmbeddingSchema = new Schema<IEmbedding>(
  {
    vector: {
      type: [Number],
      default: undefined,
    },

    model: {
      type: String,
      trim: true,
    },

    generated_at: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["pending", "done", "failed"],
      default: "pending",
    },
  },
  { _id: false },
);

// Image Asset Schema

const ImageAssetSchema = new Schema<IImageAsset>(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      trim: true,
    },

    alt_text: {
      type: String,
      trim: true,
    },

    embedding: {
      type: EmbeddingSchema,
      default: undefined,
    },
  },
  { timestamps: true },
);

// Variation Schema

const VariationSchema = new Schema<IProductVariation>(
  {
    variation_name: {
      type: String,
      required: true,
      trim: true,
    },

    variation_sku: {
      type: String,
      trim: true,
      index: true,
    },

    variation_price: Number,
    variation_discount_price: Number,
    variation_buying_price: Number,

    variation_quantity: {
      type: Number,
      default: 0,
    },

    variation_image: String,
    image_caption: String,

    embedding: {
      type: EmbeddingSchema,
      default: undefined,
    },
  },
  { timestamps: true },
);

// Attribute Schema

const AttributeSchema = new Schema<IAttributesArray>(
  {
    attribute_name: {
      type: String,
      trim: true,
    },

    attribute_values: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

// SEO Schema

const ProductMetaSchema = new Schema<IProductMeta>(
  {
    meta_title: String,
    meta_description: String,
    meta_keywords: {
      type: [String],
      default: [],
    },

    og_title: String,
    og_description: String,
    og_image: String,
    canonical_url: String,
    schema_product: {
      type: Schema.Types.Mixed,
    },

    schema_breadcrumb: {
      type: Schema.Types.Mixed,
    },
  },
  { _id: false },
);

// Product Schema

const ProductSchema = new Schema<IProductInterface>(
  {
    // Category / Brand / Owner

    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    sub_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    brand_id: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      index: true,
    },

    // Product Identity

    product_name_en: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    product_name_bn: {
      type: String,
      trim: true,
    },

    product_slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    product_sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    product_barcode: String,
    product_bar_code_image: String,
    product_unit_name: String,

    // Search Optimization

    search_keywords: {
      type: [String],
      default: [],
      index: true,
    },

    product_tags: {
      type: [String],
      default: [],
      index: true,
    },

    // Product Type

    is_variation: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Status

    product_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    is_featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Main Image

    product_image: {
      type: String,
      required: true,
    },

    image_caption: String,

    image_alt_text: String,

    product_image_embedding: {
      type: EmbeddingSchema,
      default: undefined,
    },

    // Gallery Images

    other_images: {
      type: [ImageAssetSchema],
      default: [],
    },

    // Pricing

    product_price: {
      type: Number,
      min: 0,
    },

    product_discount_price: {
      type: Number,
      min: 0,
    },

    product_buying_price: {
      type: Number,
      min: 0,
    },

    // Inventory

    product_quantity: {
      type: Number,
      default: 0,
    },

    alert_quantity: {
      type: Number,
      default: 5,
    },

    sold_quantity: {
      type: Number,
      default: 0,
    },

    // Variations

    variations: {
      type: [VariationSchema],
      default: [],
    },

    attributes_details: {
      type: [AttributeSchema],
      default: [],
    },

    // Description

    short_description_en: String,
    short_description_bn: String,
    product_description_en: String,
    product_description_bn: String,

    // Physical

    weight: Number,
    length: Number,
    width: Number,
    height: Number,

    // Reviews

    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    review_count: {
      type: Number,
      default: 0,
    },

    // Analytics

    total_views: {
      type: Number,
      default: 0,
    },

    total_searches: {
      type: Number,
      default: 0,
    },

    total_sales: {
      type: Number,
      default: 0,
    },

    total_wishlist: {
      type: Number,
      default: 0,
    },

    // SEO

    meta: {
      type: ProductMetaSchema,
      default: {},
    },

    // Admin Tracking

    admin_published_id: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },

    admin_updated_id: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },

    // Elasticsearch

    es_indexed: {
      type: Boolean,
      default: false,
      index: true,
    },

    es_document_id: {
      type: String,
      index: true,
    },

    es_indexed_at: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Compound Indexes

ProductSchema.index({
  product_name_en: "text",
  product_name_bn: "text",
  short_description_en: "text",
  short_description_bn: "text",
  product_description_en: "text",
  product_description_bn: "text",
});

ProductSchema.index({
  category_id: 1,
  product_status: 1,
});

ProductSchema.index({
  brand_id: 1,
  product_status: 1,
});

ProductSchema.index({
  product_tags: 1,
});

ProductSchema.index({
  search_keywords: 1,
});

ProductSchema.index({
  total_sales: -1,
});

ProductSchema.index({
  average_rating: -1,
});

ProductSchema.index({
  createdAt: -1,
});

// Model

export const Product = model("Product", ProductSchema);
