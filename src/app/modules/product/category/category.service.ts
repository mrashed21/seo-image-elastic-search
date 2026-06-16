import { QueryBuilder } from "@/app/builder/query-builder";
import api_error from "@/app/helper/api-error";
import { delete_file } from "@/config/file-uploder";
import httpStatus from "http-status";
import CategoryModel from "./category.model";
export const category_service = {
  // create category
  create: async (payload: any) => {
    // Create category logic here

    const {
      category_name,
      category_slug,
      category_image,
      category_serial,
      created_by,
    } = payload;

    // checke duplicate category name
    const isExist = await CategoryModel.findOne({ category_name });
    if (isExist) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Category name already exists",
      );
    }

    // checke duplicate category slug
    const isSlugExist = await CategoryModel.findOne({ category_slug });
    if (isSlugExist) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Category slug already exists",
      );
    }

    // checke duplicate category serial
    const isSerialExist = await CategoryModel.findOne({ category_serial });
    if (isSerialExist) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Category serial already exists",
      );
    }

    //  image required check
    if (!category_image) {
      throw new api_error(httpStatus.BAD_REQUEST, "Category image is required");
    }

    // if not given categiory serial then set it to max serial + 1
    let categorySerial = category_serial;
    if (!categorySerial) {
      const maxSerialCategory = await CategoryModel.findOne().sort({
        category_serial: -1,
      });
      const maxSerial = maxSerialCategory?.category_serial ?? 0;
      categorySerial = maxSerial + 1;
    }

    // Create the category
    const category = new CategoryModel({
      category_name,
      category_slug,
      category_image,
      category_serial: categorySerial,
      created_by,
    });
    await category.save();
    return {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: {},
    };
  },

  //   update category
  update: async (payload: any) => {
    const { _id, updated_by, category_image } = payload;

    const category = await CategoryModel.findById(_id);

    if (!category) {
      throw new api_error(httpStatus.NOT_FOUND, "Category not found");
    }

    // duplicate check only when field exists
    if (payload.category_name) {
      const isExist = await CategoryModel.findOne({
        category_name: payload.category_name,
        _id: { $ne: _id },
      });

      if (isExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Category name already exists",
        );
      }
    }

    if (payload.category_slug) {
      const isSlugExist = await CategoryModel.findOne({
        category_slug: payload.category_slug,
        _id: { $ne: _id },
      });

      if (isSlugExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Category slug already exists",
        );
      }
    }

    if (payload.category_serial !== undefined) {
      const isSerialExist = await CategoryModel.findOne({
        category_serial: payload.category_serial,
        _id: { $ne: _id },
      });

      if (isSerialExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Category serial already exists",
        );
      }
    }

    // image changed
    if (category_image && category.category_image) {
      await delete_file(category.category_image);
    }

    const updateData: Record<string, any> = {};

    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) {
        updateData[key] = payload[key];
      }
    });

    updateData.updated_by = updated_by;

    Object.assign(category, updateData);

    await category.save();

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: {},
    };
  },
  //   delete category
  delete: async (payload: any) => {
    const { _id } = payload;
    const category = await CategoryModel.findById(_id);

    if (!category) {
      throw new api_error(httpStatus.NOT_FOUND, "Category not found");
    }
    // delete category image from storage
    if (category.category_image) {
      await delete_file(category.category_image);
    }

    await category.deleteOne();
    // Delete category logic here
    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully",
      data: {},
    };
  },

  //   get all category with pagination and search and filter (only status active)
  get: async (query: any) => {
    const qb = new QueryBuilder(query);

    qb.search(query.search, ["category_name"]);

    qb.filter.sub_category_status = "active";

    const categories = await CategoryModel.find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { category_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();

    const total = await CategoryModel.countDocuments(qb.filter);

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: categories,
      meta: qb.getMeta(total),
    };
  },

  //   get all category with pagination and search and filter for admin (status active and in-active)
  admin_get: async (query: any) => {
    const qb = new QueryBuilder(query);

    qb.search(query.search, ["category_name"]);

    if (query.status) {
      qb.filter.category_status = query.status;
    }
    const categories = await CategoryModel.find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { category_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();

    const total = await CategoryModel.countDocuments(qb.filter);

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: categories,
      meta: qb.getMeta(total),
    };
  },
};
