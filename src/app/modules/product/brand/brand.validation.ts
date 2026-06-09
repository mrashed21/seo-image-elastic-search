import { z } from "zod";

export const brand_validation = {
  create: z.object({
    brand_name: z.string({
      message: "Brand Name is required",
    }),

    brand_image: z.any().optional(),
    brand_serial: z.coerce
      .number({
        message: "Only number is allowed for brand serial",
      })
      .optional(),
    brand_status: z.enum(["active", "in-active"], {
      message: "Brand Status is required",
    }),
  }),

  update: z.object({
    _id: z.string({
      message: "_id is required",
    }),

    brand_name: z
      .string({
        message: "Brand Name is required",
      })
      .optional(),
    brand_image: z.any().optional(),
    brand_serial: z.coerce
      .number({
        message: "Brand Serial is required",
      })
      .optional(),
    brand_status: z
      .enum(["active", "in-active"], {
        message: "Brand Status is required",
      })
      .optional(),
  }),

  delete: z.object({
    _id: z.string({
      message: "_id is required",
    }),
  }),
};
