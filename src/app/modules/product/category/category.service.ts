import api_error from "@/app/helper/api-error";
import httpStatus from "http-status";
import CategoryModel from "./category.model";
export const category_service = {
  create: async (payload: any) => {
    // Create category logic here

    const {
      category_name,
      category_slug,
      category_image,
      category_serial,
      publisher_id,
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
      categorySerial = maxSerialCategory
        ? maxSerialCategory.category_serial + 1
        : 1;
    }

    // Create the category
    const category = new CategoryModel({
      category_name,
      category_slug,
      category_image,
      category_serial: categorySerial,
      publisher_id,
    });
    await category.save();
    return {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: {},
    };
  },
};
