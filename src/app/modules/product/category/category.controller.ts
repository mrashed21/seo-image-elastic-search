import catch_async from "@/app/helper/catch-async";
import send_response from "@/app/helper/send-response";
import { generate_slug } from "@/utils/genarate-slug";
import { Request, Response } from "express";
import status from "http-status";
import { category_service } from "./category.service";

export const category_controller = {
  // create category
  create: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.publisher_id = req.user?._id;
    payload.category_slug = generate_slug(payload.category_name);

    if (req.file?.path) {
      payload.category_image = req.file.path;
    }

    const result = await category_service.create(payload);
    send_response(res, {
      status_code: status.CREATED,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   update category
  update: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.updated_id = req.user?._id;
    if (req.body.category_name) {
      payload.category_slug = generate_slug(payload.category_name);
    }

    if (req.file?.path) {
      payload.category_image = req.file.path;
    }

    const result = await category_service.update(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   delete category
  delete: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    const result = await category_service.delete(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),
};
