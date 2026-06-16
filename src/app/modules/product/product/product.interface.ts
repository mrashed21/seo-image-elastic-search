import { Types } from "mongoose";

// Common Types
export interface IEmbedding {
  vector?: number[];
  model?: string;
  generated_at?: Date;
  status?: "pending" | "done" | "failed";
}

export interface IImageAsset {
  _id?: Types.ObjectId;
  image: string;
  caption?: string;
  alt_text?: string;
  embedding?: IEmbedding;
}

// Product Variation

export interface IProductVariation {
  _id?: Types.ObjectId;
  variation_name: string;
  variation_sku?: string;
  variation_price?: number;
  variation_discount_price?: number;
  variation_buying_price?: number;
  variation_quantity?: number;
  variation_image?: string;
  image_caption?: string;
  embedding?: IEmbedding;
}

// Product Attributes

export interface IAttributesArray {
  attribute_name?: string;
  attribute_values?: string[];
}

// SEO

export interface IProductMeta {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  schema_product?: object;
  schema_breadcrumb?: object;
}

// Main Product Interface

export interface IProductInterface {
  _id?: Types.ObjectId;
  category_id: Types.ObjectId;
  sub_category_id?: Types.ObjectId;
  brand_id?: Types.ObjectId;

  product_name_en: string;
  product_name_bn?: string;
  product_slug: string;
  product_sku?: string;
  product_barcode?: string;
  product_bar_code_image?: string;
  product_unit_name?: string;

  search_keywords?: string[];
  product_tags?: string[];

  // Product Type

  is_variation: boolean;

  // Status

  product_status?: "active" | "inactive";
  is_featured?: boolean;

  // Main Image

  product_image: string;
  image_caption?: string;
  image_alt_text?: string;
  product_image_embedding?: IEmbedding;

  // Gallery Images

  other_images?: IImageAsset[];

  // Pricing

  product_price?: number;
  product_discount_price?: number;
  product_buying_price?: number;

  // Inventory

  product_quantity?: number;
  alert_quantity?: number;
  sold_quantity?: number;

  // Variations

  variations?: IProductVariation[];
  attributes_details?: IAttributesArray[];

  // Description

  short_description_en?: string;
  short_description_bn?: string;
  product_description_en?: string;
  product_description_bn?: string;

  // Physical Details

  weight?: number;
  length?: number;
  width?: number;
  height?: number;

  // Rating & Reviews

  average_rating?: number;
  review_count?: number;

  // Analytics

  total_views?: number;
  total_searches?: number;
  total_sales?: number;
  total_wishlist?: number;

  // SEO

  meta?: IProductMeta;

  // Admin Tracking

  admin_published_id?: Types.ObjectId;
  admin_updated_by?: Types.ObjectId;

  // Elasticsearch

  es_indexed?: boolean;
  es_document_id?: string;
  es_indexed_at?: Date;

  // Timestamp

  createdAt?: Date;
  updatedAt?: Date;
}

export const productSearchableField = [
  "product_name_en",
  "product_name_bn",
  "product_slug",
  "short_description_en",
  "short_description_bn",
  "product_description_en",
  "product_description_bn",
  "search_keywords",
  "product_tags",
  "image_caption",
  "meta.meta_title",
  "meta.meta_description",
  "meta.meta_keywords",
];
