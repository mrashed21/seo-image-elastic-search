import { QueryBuilder } from "@/app/builder/query-builder";
import api_error from "@/app/helper/api-error";
import { delete_file } from "@/config/file-uploder";
import httpStatus from "http-status";
import CategoryModel from "../category/category.model";
import SubCategoryModel from "./sub-category.model";

export const sub_category_service = {
  // create sub category
  create: async (payload: any) => {
    // Create sub category logic here

    const {
      sub_category_name,
      sub_category_slug,
      sub_category_image,
      sub_category_serial,
      category_id,
      created_by,
    } = payload;

    // checke duplicate sub category name
    const isExist = await SubCategoryModel.findOne({ sub_category_name });
    if (isExist) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Sub Category name already exists",
      );
    }

    // checke duplicate sub category slug
    const isSlugExist = await SubCategoryModel.findOne({ sub_category_slug });
    if (isSlugExist) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Sub Category slug already exists",
      );
    }

    // checke duplicate sub category serial
    const isSerialExist = await SubCategoryModel.findOne({
      sub_category_serial,
    });
    if (isSerialExist) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Sub Category serial already exists",
      );
    }

    // checke category id exist or not

    if (!category_id) {
      throw new api_error(httpStatus.BAD_REQUEST, "Category Id is required");
    }
    const isCategoryExist = await CategoryModel.findOne({ _id: category_id });
    if (!isCategoryExist) {
      throw new api_error(httpStatus.BAD_REQUEST, "Category not found");
    }

    //  image required check
    if (!sub_category_image) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Sub Category image is required",
      );
    }

    // if not given sub category serial then set it to max serial + 1
    let sub_categorySerial = sub_category_serial;
    if (!sub_categorySerial) {
      const maxSerialSubCategory = await SubCategoryModel.findOne().sort({
        sub_category_serial: -1,
      });
      const maxSerial = maxSerialSubCategory?.sub_category_serial ?? 0;
      sub_categorySerial = maxSerial + 1;
    }

    // Create the sub category
    const sub_category = new SubCategoryModel({
      sub_category_name,
      sub_category_slug,
      sub_category_image,
      sub_category_serial: sub_categorySerial,
      category_id,
      created_by,
    });
    await sub_category.save();
    return {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Sub Category created successfully",
      data: {},
    };
  },

  //   update sub category
  update: async (payload: any) => {
    const { _id, updated_by, sub_category_image, category_id } = payload;

    const sub_category = await SubCategoryModel.findById(_id);

    if (!sub_category) {
      throw new api_error(httpStatus.NOT_FOUND, "Sub Category not found");
    }

    // duplicate check only when field exists
    if (payload.sub_category_name) {
      const isExist = await SubCategoryModel.findOne({
        sub_category_name: payload.sub_category_name,
        _id: { $ne: _id },
      });

      if (isExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Sub Category name already exists",
        );
      }
    }

    if (payload.sub_category_slug) {
      const isSlugExist = await SubCategoryModel.findOne({
        sub_category_slug: payload.sub_category_slug,
        _id: { $ne: _id },
      });

      if (isSlugExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Sub Category slug already exists",
        );
      }
    }

    if (payload.sub_category_serial !== undefined) {
      const isSerialExist = await SubCategoryModel.findOne({
        sub_category_serial: payload.sub_category_serial,
        _id: { $ne: _id },
      });

      if (isSerialExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Sub Category serial already exists",
        );
      }
    }

    // image changed
    if (sub_category_image && sub_category.sub_category_image) {
      await delete_file(sub_category.sub_category_image);
    }

    // if category id is given then check category exist or not
    if (category_id) {
      const isCategoryExist = await CategoryModel.findOne({ _id: category_id });
      if (!isCategoryExist) {
        throw new api_error(httpStatus.BAD_REQUEST, "Category not found");
      }
    }

    const updateData: Record<string, any> = {};

    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) {
        updateData[key] = payload[key];
      }
    });

    updateData.updated_by = updated_by;

    Object.assign(sub_category, updateData);

    await sub_category.save();

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Sub Category updated successfully",
      data: {},
    };
  },
  //   delete sub category
  delete: async (payload: any) => {
    const { _id } = payload;
    const sub_category = await SubCategoryModel.findById(_id);

    if (!sub_category) {
      throw new api_error(httpStatus.NOT_FOUND, "Sub Category not found");
    }
    // delete sub category image from storage
    if (sub_category.sub_category_image) {
      await delete_file(sub_category.sub_category_image);
    }

    await sub_category.deleteOne();
    // Delete sub category logic here
    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Sub Category deleted successfully",
      data: {},
    };
  },

  //   get all sub category with pagination and search and filter (only status active)
  get: async (query: any) => {
    const qb = new QueryBuilder(query);

    qb.search(query.search, ["sub_category_name"]);

    qb.filter.sub_category_status = "active";

    const sub_categories = await SubCategoryModel.find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { sub_category_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();

    const total = await SubCategoryModel.countDocuments(qb.filter);

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Sub Categories retrieved successfully",
      data: sub_categories,
      meta: qb.getMeta(total),
    };
  },

  //   get all sub category with pagination and search and filter for admin (status active and in-active)
  admin_get: async (query: any) => {
    const qb = new QueryBuilder(query);

    qb.search(query.search, ["sub_category_name"]);

    if (query.status) {
      qb.filter.sub_category_status = query.status;
    }

    const sub_categories = await SubCategoryModel.find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { sub_category_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();

    const total = await SubCategoryModel.countDocuments(qb.filter);

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Sub Categories retrieved successfully",
      data: sub_categories,
      meta: qb.getMeta(total),
    };
  },
};
