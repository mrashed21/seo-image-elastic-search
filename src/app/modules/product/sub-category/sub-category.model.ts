import { Schema, model } from "mongoose";
import { ISubCategoryInterface } from "./sub-category.interface";

// sub-category Schema
const subCategorySchema = new Schema<ISubCategoryInterface>(
  {
    sub_category_name: {
      type: String,
      required: true,
      unique: true,
    },
    sub_category_slug: {
      type: String,
      required: true,
      unique: true,
    },

    sub_category_image: {
      type: String,
      required: true,
    },

    sub_category_status: {
      type: String,
      default: "in-active",
    },
    sub_category_serial: {
      type: Number,
      required: false,
    },

    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
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

const SubCategoryModel = model<ISubCategoryInterface>(
  "sub_categories",
  subCategorySchema,
);

export default SubCategoryModel;
