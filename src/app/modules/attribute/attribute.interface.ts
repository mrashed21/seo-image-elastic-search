import { Types } from "mongoose";
import { IUserModel } from "../auth/auth.interface";

export interface IAttributeInterface {
  _id?: any;
  attribute_name: string;
  attribute_status?: "active" | "in-active";
  attribute_serial: number;
  attribute_value: string[];
  publisher_id: Types.ObjectId | IUserModel;
  updated_id?: Types.ObjectId | IUserModel;
}

export const attributeSearchableField = ["attribute_name", "attribute_status"];
