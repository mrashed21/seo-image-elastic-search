import catch_async from "@/app/helper/catch-async";
import send_response from "@/app/helper/send-response";
import { Request, Response } from "express";
import status from "http-status";
import { product_service } from "./product.service";

export const product_controller = {
  create: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };

    const files = req.files as Express.Multer.File[];

    // Main image

    const mainImage = files.find((file) => file.fieldname === "product_image");

    if (mainImage) {
      payload.product_image = mainImage.path;
    }

    // Other images

    payload.other_images = files
      .filter((file) => file.fieldname === "other_images")
      .map((file) => ({
        image: file.path,
      }));

    // Variation parse

    if (payload.variations) {
      payload.variations = JSON.parse(payload.variations);
    }

    // Variation images

    if (payload.is_variation && Array.isArray(payload.variations)) {
      payload.variations = payload.variations.map(
        (variation: any, index: number) => {
          const image = files.find(
            (file) => file.fieldname === `variation_image_${index}`,
          );

          return {
            ...variation,
            variation_image: image?.path,
          };
        },
      );
    }

    const result = await product_service.create(payload);

    send_response(res, {
      status_code: status.CREATED,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  }),
};
