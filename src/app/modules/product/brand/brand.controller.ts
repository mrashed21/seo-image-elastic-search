import catch_async from "@/app/helper/catch-async";
import send_response from "@/app/helper/send-response";
import { generate_slug } from "@/utils/genarate-slug";
import { Request, Response } from "express";
import status from "http-status";
import { brand_service } from "./brand.service";

export const brand_controller = {
  // create brand
  create: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.created_by = req.user?._id;
    payload.brand_slug = generate_slug(payload.brand_name);

    if (req.file?.path) {
      payload.brand_image = req.file.path;
    }

    const result = await brand_service.create(payload);
    send_response(res, {
      status_code: status.CREATED,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   update brand
  update: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.updated_by = req.user?._id;
    if (req.body.brand_name) {
      payload.brand_slug = generate_slug(payload.brand_name);
    }

    if (req.file?.path) {
      payload.brand_image = req.file.path;
    }

    const result = await brand_service.update(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   delete brand
  delete: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    const result = await brand_service.delete(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   get all brand
  get: catch_async(async (req: Request, res: Response) => {
    const result = await brand_service.get(req.query);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  }),

  //   get admin brand
  admin: catch_async(async (req: Request, res: Response) => {
    const result = await brand_service.admin(req.query);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
      meta: result.meta,
    });
  }),
};
