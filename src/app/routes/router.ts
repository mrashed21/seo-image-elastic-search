import { Router } from "express";
import { auth_router } from "../modules/auth/auth.route";
import { health_router } from "../modules/health/health.route";
import { category_router } from "../modules/product/category/category.route";
import { product_router } from "../modules/product/product-image-search/product.route";

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
    path: "/product",
    route: product_router,
  },
  {
    path: "/category",
    route: category_router,
  },
];
modelRouters.forEach((route) => router.use(route.path, route.route));
export default router;
