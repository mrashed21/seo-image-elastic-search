import { Schema, model } from "mongoose";
import { IBrandInterface } from "./brand.interface";

// brand Schema
const brandSchema = new Schema<IBrandInterface>(
  {
    brand_name: {
      type: String,
      required: true,
      unique: true,
    },
    brand_slug: {
      type: String,
      required: true,
      unique: true,
    },

    brand_image: {
      type: String,
      required: true,
    },

    brand_status: {
      type: String,
      default: "in-active",
    },
    brand_serial: {
      type: Number,
      required: false,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const BrandModel = model<IBrandInterface>("brands", brandSchema);

export default BrandModel;
