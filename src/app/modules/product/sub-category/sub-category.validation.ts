import { z } from "zod";

export const sub_category_validation = {
  create: z.object({
    sub_category_name: z.string({
      message: "Sub Category Name is required",
    }),

    sub_category_image: z.any().optional(),
    category_id: z.string({
      message: "Category Id is required",
    }),
    sub_category_serial: z.coerce
      .number({
        message: "Only number is allowed for sub category serial",
      })
      .optional(),
    sub_category_status: z.enum(["active", "in-active"], {
      message: "Sub Category Status is required",
    }),
  }),

  update: z.object({
    _id: z.string({
      message: "_id is required",
    }),

    sub_category_name: z
      .string({
        message: "Sub Category Name is required",
      })
      .optional(),
    category_id: z
      .string({
        message: "Category Id is required",
      })
      .optional(),
    sub_category_image: z.any().optional(),
    sub_category_serial: z.coerce
      .number({
        message: "Sub Category Serial is required",
      })
      .optional(),
    sub_category_status: z
      .enum(["active", "in-active"], {
        message: "Sub Category Status is required",
      })
      .optional(),
  }),

  delete: z.object({
    _id: z.string({
      message: "_id is required",
    }),
  }),
};
