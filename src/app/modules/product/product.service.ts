import { generateEmbedding } from "./helper/embedding.helper.js";
import { cosineSimilarity } from "./helper/similarity.helper.js";
import { Product } from "./product.model.js";

const SIMILARITY_THRESHOLD = 0.7;
const MAX_RESULTS = 10;
const PRODUCT_BATCH_LIMIT = 500;

export const product_service = {
  createProduct: async (payload: any) => {
    let embedding: number[] = [];
    let embeddingStatus: "done" | "failed" = "done";

    try {
      // disk path থেকে embedding generate করো
      embedding = await generateEmbedding(payload.image);
    } catch (err) {
      console.error("Embedding generation failed:", err);
      embeddingStatus = "failed";
    }

    return Product.create({
      ...payload,
      embedding,
      embeddingStatus,
    });
  },

  // Buffer accept করে — memory storage থেকে আসে, disk এ কিছু নেই
  searchByImage: async (imageInput: Buffer | string) => {
    const queryEmbedding = await generateEmbedding(imageInput);

    const products = await Product.find(
      { embeddingStatus: "done", embedding: { $not: { $size: 0 } } },
      { name: 1, price: 1, image: 1, embedding: 1 },
    )
      .limit(PRODUCT_BATCH_LIMIT)
      .lean();

    if (!products.length) {
      return { total: 0, products: [] };
    }

    const results = products
      .map((product) => {
        try {
          const score = cosineSimilarity(queryEmbedding, product.embedding);
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            score: Number(score.toFixed(4)),
          };
        } catch {
          return null;
        }
      })
      .filter(
        (item): item is NonNullable<typeof item> =>
          item !== null &&
          !Number.isNaN(item.score) &&
          item.score >= SIMILARITY_THRESHOLD,
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);

    return {
      total: results.length,
      products: results,
    };
  },

  retryFailedEmbeddings: async () => {
    const failed = await Product.find({ embeddingStatus: "failed" }).lean();

    for (const product of failed) {
      try {
        const embedding = await generateEmbedding(product.image);
        await Product.updateOne(
          { _id: product._id },
          { embedding, embeddingStatus: "done" },
        );
        console.log(`Embedding retried for: ${product.name}`);
      } catch (err) {
        console.error(`Retry failed for ${product.name}:`, err);
      }
    }
  },

  getAllProducts: async () => {
    return Product.find({}, { name: 1, price: 1, image: 1 }).lean();
  },
};
