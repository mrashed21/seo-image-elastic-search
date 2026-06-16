import { Types } from "mongoose";
import { IUserModel } from "../../auth/auth.interface";
import { ICategoryInterface } from "../category/category.interface";

export interface ISubCategoryInterface {
  _id?: any;
  sub_category_name: string;
  sub_category_slug: string;
  sub_category_image: string;
  sub_category_status?: "active" | "in-active";
  sub_category_serial?: number;
  category_id: Types.ObjectId | ICategoryInterface;
  created_by: Types.ObjectId | IUserModel;
  updated_by?: Types.ObjectId;
}

export const subCategorySearchableField = [
  "sub_category_name",
  "sub_category_status",
];
