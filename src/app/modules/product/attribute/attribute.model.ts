import { Schema, model } from "mongoose";
import { IAttributeInterface } from "./attribute.interface";

// attribute Schema
const attributeSchema = new Schema<IAttributeInterface>(
  {
    attribute_name: {
      type: String,
      required: true,
      unique: true,
    },
    attribute_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    attribute_serial: {
      type: Number,
      required: true,
    },
    attribute_value: {
      type: [String],
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const AttributeModel = model<IAttributeInterface>(
  "attributes",
  attributeSchema,
);

export default AttributeModel;
