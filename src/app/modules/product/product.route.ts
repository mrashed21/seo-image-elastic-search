import { multer_upload } from "@/app/config/multer";
import { Router } from "express";

const router: Router = Router();

router.route("/").post(
  multer_upload.fields([
    { name: "product_image", maxCount: 1 },
    { name: "other_images", maxCount: 10 },
    { name: "variation_images", maxCount: 100 },
  ]),
);

export const products_router = router;
