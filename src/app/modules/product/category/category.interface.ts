import { Types } from "mongoose";
import { IUserModel } from "../../auth/auth.interface";

export interface ICategoryInterface {
  _id?: any;
  category_name: string;
  category_slug: string;
  category_image: string;
  category_status?: "active" | "in-active";
  category_serial: number;
  publisher_id: Types.ObjectId | IUserModel;
  updated_id?: Types.ObjectId ;
}

export const categorySearchableField = ["category_name", "category_status"];
