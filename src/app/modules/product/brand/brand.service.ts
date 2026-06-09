import { QueryBuilder } from "@/app/builder/query-builder";
import api_error from "@/app/helper/api-error";
import { delete_file } from "@/config/file-uploder";
import httpStatus from "http-status";
import BrandModel from "./brand.model";
export const brand_service = {
  // create brand
  create: async (payload: any) => {
    // Create brand logic here

    const { brand_name, brand_slug, brand_image, brand_serial, publisher_id } =
      payload;

    // checke duplicate brand name
    const isExist = await BrandModel.findOne({ brand_name });
    if (isExist) {
      throw new api_error(httpStatus.BAD_REQUEST, "Brand name already exists");
    }

    // checke duplicate brand slug
    const isSlugExist = await BrandModel.findOne({ brand_slug });
    if (isSlugExist) {
      throw new api_error(httpStatus.BAD_REQUEST, "Brand slug already exists");
    }

    // checke duplicate brand serial
    const isSerialExist = await BrandModel.findOne({ brand_serial });
    if (isSerialExist) {
      throw new api_error(
        httpStatus.BAD_REQUEST,
        "Brand serial already exists",
      );
    }

    //  image required check
    if (!brand_image) {
      throw new api_error(httpStatus.BAD_REQUEST, "Brand image is required");
    }

    // if not given brand serial then set it to max serial + 1
    let brandSerial = brand_serial;
    if (!brandSerial) {
      const maxSerialBrand = await BrandModel.findOne().sort({
        brand_serial: -1,
      });
      const maxSerial = maxSerialBrand?.brand_serial ?? 0;
      brandSerial = maxSerial + 1;
    }

    // Create the brand
    const brand = new BrandModel({
      brand_name,
      brand_slug,
      brand_image,
      brand_serial: brandSerial,
      publisher_id,
    });
    await brand.save();
    return {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Brand created successfully",
      data: {},
    };
  },

  //   update brand
  update: async (payload: any) => {
    const { _id, updated_id, brand_image } = payload;

    const brand = await BrandModel.findById(_id);

    if (!brand) {
      throw new api_error(httpStatus.NOT_FOUND, "Brand not found");
    }

    // duplicate check only when field exists
    if (payload.brand_name) {
      const isExist = await BrandModel.findOne({
        brand_name: payload.brand_name,
        _id: { $ne: _id },
      });

      if (isExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Brand name already exists",
        );
      }
    }

    if (payload.brand_slug) {
      const isSlugExist = await BrandModel.findOne({
        brand_slug: payload.brand_slug,
        _id: { $ne: _id },
      });

      if (isSlugExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Brand slug already exists",
        );
      }
    }

    if (payload.brand_serial !== undefined) {
      const isSerialExist = await BrandModel.findOne({
        brand_serial: payload.brand_serial,
        _id: { $ne: _id },
      });

      if (isSerialExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Brand serial already exists",
        );
      }
    }

    // image changed
    if (brand_image && brand.brand_image) {
      await delete_file(brand.brand_image);
    }

    const updateData: Record<string, any> = {};

    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) {
        updateData[key] = payload[key];
      }
    });

    updateData.updated_id = updated_id;

    Object.assign(brand, updateData);

    await brand.save();

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Brand updated successfully",
      data: {},
    };
  },
  //   delete brand
  delete: async (payload: any) => {
    const { _id } = payload;
    const brand = await BrandModel.findById(_id);

    if (!brand) {
      throw new api_error(httpStatus.NOT_FOUND, "Brand not found");
    }
    // delete brand image from storage
    if (brand.brand_image) {
      await delete_file(brand.brand_image);
    }

    await brand.deleteOne();
    // Delete brand logic here
    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Brand deleted successfully",
      data: {},
    };
  },

  //   get all brand with pagination and search and filter (only status active)
  get: async (query: any) => {
    const qb = new QueryBuilder(query);

    qb.search(query.search, ["brand_name"]);

    qb.filter.brand_status = "active";

    const brands = await BrandModel.find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { brand_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();

    const total = await BrandModel.countDocuments(qb.filter);

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Brands retrieved successfully",
      data: brands,
      meta: qb.getMeta(total),
    };
  },

  //   get all brand with pagination and search and filter for admin (status active and in-active)
  admin_get: async (query: any) => {
    const qb = new QueryBuilder(query);

    qb.search(query.search, ["brand_name"]);

    if (query.status) {
      qb.filter.brand_status = query.status;
    }
    const brands = await BrandModel.find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { brand_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();

    const total = await BrandModel.countDocuments(qb.filter);

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: "Brands retrieved successfully",
      data: brands,
      meta: qb.getMeta(total),
    };
  },
};
