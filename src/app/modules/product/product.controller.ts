import catch_async from "@/app/helper/catch-async.js";
import send_response from "@/app/helper/send-response.js";
import { Request, Response } from "express";
import status from "http-status";
import { product_service } from "./product.service";

export const product_controller = {
  createProduct: catch_async(async (req: Request, res: Response) => {
    if (!req.file) {
      send_response(res, {
        status_code: status.BAD_REQUEST,
        success: false,
        message: "Image file is required",
      });
      return;
    }

    const payload = {
      ...req.body,
      image: req.file.path, // disk storage — path পাবে
    };

    const result = await product_service.createProduct(payload);

    send_response(res, {
      status_code: status.CREATED,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  }),

  searchByImage: catch_async(async (req: Request, res: Response) => {
    if (!req.file) {
      send_response(res, {
        status_code: status.BAD_REQUEST,
        success: false,
        message: "Image file is required",
      });
      return;
    }

    // memory storage — req.file.buffer পাবে, disk এ কিছু যায়নি
    const result = await product_service.searchByImage(req.file.buffer);

    send_response(res, {
      status_code: status.OK,
      success: true,
      message: "Search results",
      data: result,
    });
  }),

  retryEmbeddings: catch_async(async (_req: Request, res: Response) => {
    await product_service.retryFailedEmbeddings();
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: "Retry completed",
    });
  }),

  getAllProducts: catch_async(async (_req: Request, res: Response) => {
    const products = await product_service.getAllProducts();
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: "All products",
      data: products,
    });
  }),
};
