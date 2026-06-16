import { Types } from "mongoose";
import { IUserModel } from "../../auth/auth.interface";

export interface IBrandInterface {
  _id?: any;
  brand_name: string;
  brand_slug: string;
  brand_image: string;
  brand_status?: "active" | "in-active";
  brand_serial?: number;
  created_by: Types.ObjectId | IUserModel;
  updated_by?: Types.ObjectId;
}

export const brandSearchableField = ["brand_name", "brand_status"];
