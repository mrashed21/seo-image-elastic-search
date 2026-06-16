import httpStatus from "http-status";
export const attribute_service = {
  // create attribute
  create: async (payload: any) => {
    
    return {
      success: true,
      status_code: httpStatus.CREATED,
      message: "Brand created successfully",
      data: {},
    };
  },

  // update attribute
  update: async (payload: any) => {
    return {
      message: "Attribute updated successfully",
      data: payload,
    };
  },

  // delete attribute
  delete: async (payload: any) => {
    return {
      message: "Attribute deleted successfully",
      data: payload,
    };
  },

  // get all attribute for admin
  admin: async () => {
    return {
      message: "Attributes retrieved successfully",
      data: [],
    };
  },

  // get all attribute for user
  get: async () => {
    return {
      message: "Attributes retrieved successfully",
      data: [],
    };
  },
};
