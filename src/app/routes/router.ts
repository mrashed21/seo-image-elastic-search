import { Router } from "express";
import { auth_router } from "../modules/auth/auth.route";
import { health_router } from "../modules/health/health.route";
import { attribute_router } from "../modules/product/attribute/attribute.route";
import { brand_router } from "../modules/product/brand/brand.route";
import { category_router } from "../modules/product/category/category.route";
import { product_router } from "../modules/product/product-image-search/product.route";
import { sub_category_router } from "../modules/product/sub-category/sub-category.route";

const router: Router = Router();
const modelRouters = [
  {
    path: "/auth",
    route: auth_router,
  },
  {
    path: "/health",
    route: health_router,
  },
  {
    path: "/brand",
    route: brand_router,
  },
  {
    path: "/category",
    route: category_router,
  },
  {
    path: "/sub-category",
    route: sub_category_router,
  },
  {
    path: "/attribute",
    route: attribute_router,
  },
  {
    path: "/product",
    route: product_router,
  },
];
modelRouters.forEach((route) => router.use(route.path, route.route));
export default router;
