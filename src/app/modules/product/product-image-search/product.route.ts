import { multer_upload } from "@/config/multer";
import express, { Router } from "express";
import { multer_memory_upload } from "./multer-product";
import { product_controller } from "./product.controller";

const router: Router = express.Router();

router.route("/get-all").get(product_controller.getAllProducts);

// product create — disk storage (image path save করতে হবে)
router
  .route("/create")
  .post(multer_upload.single("image"), product_controller.createProduct);

// image search — memory storage (temp file disk এ যাবেই না)
router
  .route("/search-image")
  .post(multer_memory_upload.single("image"), product_controller.searchByImage);

// admin: failed embedding retry
router.post("/retry-embeddings", product_controller.retryEmbeddings);

export const product_router = router;
