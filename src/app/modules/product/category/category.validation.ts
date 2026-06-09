import { z } from "zod";

export const category_validation = {
  create: z.object({
    category_name: z.string({
      message: "Category Name is required",
    }),

    category_image: z.any().optional(),
    category_serial: z.coerce.number({
      message: "Category Serial is required",
    }),
    category_status: z.enum(["active", "in-active"], {
      message: "Category Status is required",
    }),
  }),

  update: z.object({
    body: z.object({
      _id: z.string({
        message: "_id is required",
      }),

      category_name: z.string({
        message: "Category Name is required",
      }),
      category_image: z.any(),
      category_serial: z.coerce
        .number({
          message: "Category Serial is required",
        })
        .optional(),
      category_status: z
        .enum(["active", "in-active"], {
          message: "Category Status is required",
        })
        .optional(),
    }),
  }),

  delete: z.object({
    body: z.object({
      _id: z.string({
        message: "_id is required",
      }),
      category_image_key: z.string({
        message: "category_image_key is required",
      }),
    }),
  }),
};
