import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      default: [],
      // sparse index — embedding আছে এমন documents দ্রুত query করতে
      index: true,
    },

    embeddingStatus: {
      type: String,
      enum: ["pending", "done", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// শুধু embedding done এমন products query করতে compound index
productSchema.index({ embeddingStatus: 1, createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);
