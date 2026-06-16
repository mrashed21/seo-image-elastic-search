import { QueryBuilder } from "@/app/builder/query-builder";
import api_error from "@/app/helper/api-error";
import { delete_file } from "@/config/file-uploder";
import httpStatus from "http-status";
import mongoose from "mongoose";
import category_model from "./category.model";

export const category_service = {
  create: async (payload: any) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const {
        category_name,
        category_slug,
        category_image,
        category_serial,
        created_by,
      } = payload;

      if (!category_image) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Category image is required",
        );
      }

      const isExist = await category_model
        .findOne({
          category_name,
        })
        .session(session);

      if (isExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Category name already exists",
        );
      }

      const isSlugExist = await category_model
        .findOne({
          category_slug,
        })
        .session(session);

      if (isSlugExist) {
        throw new api_error(
          httpStatus.BAD_REQUEST,
          "Category slug already exists",
        );
      }

      let serial = Number(category_serial);

      if (!serial) {
        const maxSerialCategory = await category_model
          .findOne()
          .sort({ category_serial: -1 })
          .session(session);

        serial = (maxSerialCategory?.category_serial ?? 0) + 1;
      } else {
        await category_model.updateMany(
          {
            category_serial: { $gte: serial },
          },
          {
            $inc: { category_serial: 1 },
          },
          { session },
        );
      }

      const category = await category_model.create(
        [
          {
            category_name,
            category_slug,
            category_image,
            category_serial: serial,
            created_by,
          },
        ],
        { session },
      );

      await session.commitTransaction();

      return {
        success: true,
        status_code: httpStatus.CREATED,
        message: "Category created successfully",
        data: category[0],
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  update: async (payload: any) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const { _id, updated_by, category_image } = payload;

      const category = await category_model.findById(_id).session(session);

      if (!category) {
        throw new api_error(httpStatus.NOT_FOUND, "Category not found");
      }

      if (payload.category_name) {
        const isExist = await category_model
          .findOne({
            category_name: payload.category_name,
            _id: { $ne: _id },
          })
          .session(session);

        if (isExist) {
          throw new api_error(
            httpStatus.BAD_REQUEST,
            "Category name already exists",
          );
        }
      }

      if (payload.category_slug) {
        const isSlugExist = await category_model
          .findOne({
            category_slug: payload.category_slug,
            _id: { $ne: _id },
          })
          .session(session);

        if (isSlugExist) {
          throw new api_error(
            httpStatus.BAD_REQUEST,
            "Category slug already exists",
          );
        }
      }

      if (
        payload.category_serial !== undefined &&
        payload.category_serial !== category.category_serial
      ) {
        const oldSerial = category.category_serial!;
        const newSerial = Number(payload.category_serial);

        if (newSerial > oldSerial) {
          await category_model.updateMany(
            {
              category_serial: {
                $gt: oldSerial,
                $lte: newSerial,
              },
            },
            {
              $inc: { category_serial: -1 },
            },
            { session },
          );
        } else {
          await category_model.updateMany(
            {
              category_serial: {
                $gte: newSerial,
                $lt: oldSerial,
              },
            },
            {
              $inc: { category_serial: 1 },
            },
            { session },
          );
        }
      }

      if (
        category_image &&
        category.category_image &&
        category_image !== category.category_image
      ) {
        await delete_file(category.category_image);
      }

      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined) {
          (category as any)[key] = payload[key];
        }
      });

      category.updated_by = updated_by;

      await category.save({ session });

      await session.commitTransaction();

      return {
        success: true,
        status_code: httpStatus.OK,
        message: "Category updated successfully",
        data: category,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  delete: async (payload: any) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const { _id } = payload;

      const category = await category_model.findById(_id).session(session);

      if (!category) {
        throw new api_error(httpStatus.NOT_FOUND, "Category not found");
      }

      const deletedSerial = category.category_serial;

      if (category.category_image) {
        await delete_file(category.category_image);
      }

      await category.deleteOne({ session });

      await category_model.updateMany(
        {
          category_serial: { $gt: deletedSerial },
        },
        {
          $inc: { category_serial: -1 },
        },
        { session },
      );

      await session.commitTransaction();

      return {
        success: true,
        status_code: httpStatus.OK,
        message: "Category deleted successfully",
        data: {},
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  // get all category with pagination and search and filter (only status active)
  get: async (query: any) => {
    const qb = new QueryBuilder(query);
    qb.search(query.search, ["category_name"]);
    qb.filter.sub_category_status = "active";
    const categories = await category_model
      .find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { category_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();
    const total = await category_model.countDocuments(qb.filter);
    return {
      success: true,
      status_code: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: categories,
      meta: qb.getMeta(total),
    };
  },

  // get all category with pagination and search and filter for admin (status active and in-active)
  admin: async (query: any) => {
    const qb = new QueryBuilder(query);
    qb.search(query.search, ["category_name"]);
    if (query.status) {
      qb.filter.category_status = query.status;
    }
    const categories = await category_model
      .find(qb.filter)
      .sort(Object.keys(qb.sort).length ? qb.sort : { category_serial: 1 })
      .skip(qb.skip)
      .limit(qb.limit)
      .lean();
    const total = await category_model.countDocuments(qb.filter);
    return {
      success: true,
      status_code: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: categories,
      meta: qb.getMeta(total),
    };
  },
};
