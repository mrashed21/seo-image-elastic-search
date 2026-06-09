import { IProductInterface } from "./product.interface";
import { Product } from "./product.model";

export const product_service = {
  create: async (payload: IProductInterface) => {
    const result = await Product.create(payload);

    return result;
  },
};
