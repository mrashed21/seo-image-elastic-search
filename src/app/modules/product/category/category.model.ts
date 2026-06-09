import { Schema, model } from "mongoose";
import { ICategoryInterface } from "./category.interface";

// category Schema
const categorySchema = new Schema<ICategoryInterface>(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
    category_slug: {
      type: String,
      required: true,
      unique: true,
    },

    category_image: {
      type: String,
      required: true,
    },

    category_status: {
      type: String,
      default: "in-active",
    },
    category_serial: {
      type: Number,
      required: true,
    },

    publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    updated_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const CategoryModel = model<ICategoryInterface>("categories", categorySchema);

export default CategoryModel;
