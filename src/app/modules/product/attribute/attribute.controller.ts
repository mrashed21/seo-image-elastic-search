import catch_async from "@/app/helper/catch-async";
import send_response from "@/app/helper/send-response";
import { Request, Response } from "express";
import status from "http-status";
import { attribute_service } from "./attribute.service";

export const attribute_controller = {
  // create attribute
  create: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.created_by = req.user?._id;

    const result = await attribute_service.create(payload);
    send_response(res, {
      status_code: status.CREATED,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),
  //   update attribute
  update: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    payload.updated_by = req.user?._id;

    const result = await attribute_service.update(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   delete attribute
  delete: catch_async(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    const result = await attribute_service.delete(payload);
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   get all attribute for admin
  admin: catch_async(async (req: Request, res: Response) => {
    const result = await attribute_service.admin();
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),

  //   get all attribute for user
  get: catch_async(async (req: Request, res: Response) => {
    const result = await attribute_service.get();
    send_response(res, {
      status_code: status.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  }),
};
