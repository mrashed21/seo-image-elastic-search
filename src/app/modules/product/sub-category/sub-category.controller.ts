import catch_async from "@/app/helper/catch-async";
import send_response from "@/app/helper/send-response";
import { generate_slug } from "@/utils/genarate-slug";
import { Request, Response } from "express";
import status from "http-status";
import { sub_category_service } from "./sub-category.service";

export const sub_category_controller = {
  // create sub category
  create: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.created_by = req.user?._id;
    payload.category_slug = generate_slug(payload.category_name);

    if (req.file?.path) {
      payload.category_image = req.file.path;
    }

    const result = await sub_category_service.create(payload);
    send_response(res, {
      status_code: status.CREATED,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   update sub category
  update: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.updated_by = req.user?._id;
    if (req.body.category_name) {
      payload.category_slug = generate_slug(payload.category_name);
    }

    if (req.file?.path) {
      payload.category_image = req.file.path;
    }

    const result = await sub_category_service.update(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   delete sub category
  delete: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    const result = await sub_category_service.delete(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   get all sub category
  get: catch_async(async (req: Request, res: Response) => {
    const result = await sub_category_service.get(req.query);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  }),

  //   get admin sub category
  admin: catch_async(async (req: Request, res: Response) => {
    const result = await sub_category_service.admin(req.query);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  }),
};
