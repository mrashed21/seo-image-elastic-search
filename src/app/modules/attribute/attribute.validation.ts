import { z } from "zod";

export const AttributeValidation = {
  create: z.object({
    attribute_name: z.string({
      message: "Attribute Name is required",
    }),
    attribute_serial: z.coerce.number({
      message: "Attribute Serial is required",
    }),
    attribute_status: z.enum(["active", "in-active"], {
      message: "Attribute Status is required",
    }),
    attribute_value: z.array(z.string(), {
      message: "Attribute values are required",
    }),
  }),

  update: z.object({
    _id: z.string({
      message: "_id is required",
    }),
    attribute_name: z
      .string({
        message: "Attribute Name is required",
      })
      .optional(),
    attribute_serial: z.coerce
      .number({
        message: "Attribute Serial is required",
      })
      .optional(),
    attribute_status: z
      .enum(["active", "in-active"], {
        message: "Attribute Status is required",
      })
      .optional(),
    attribute_value: z
      .array(z.string(), {
        message: "Attribute values are required",
      })
      .optional(),
  }),

  delete: z.object({
    _id: z.string({
      message: "_id is required",
    }),
  }),
};
