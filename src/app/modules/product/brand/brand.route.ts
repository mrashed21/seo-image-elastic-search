import { check_auth } from "@/app/middleware/auth-middleware";
import { validate_request } from "@/app/middleware/validate-request";
import { multer_upload } from "@/config/multer";
import { Router } from "express";
import { user_role } from "../../auth/auth.interface";
import { brand_controller } from "./brand.controller";
import { brand_validation } from "./brand.validation";

const router: Router = Router();

router
  .route("/")
  .get(check_auth(user_role.user), brand_controller.get)
  .post(
    check_auth(user_role.user),
    multer_upload.single("brand_image"),
    validate_request(brand_validation.create),
    brand_controller.create,
  )
  .patch(
    check_auth(user_role.user),
    multer_upload.single("brand_image"),
    validate_request(brand_validation.update),
    brand_controller.update,
  )
  .delete(
    check_auth(user_role.user),
    validate_request(brand_validation.delete),
    brand_controller.delete,
  );

router.route("/admin").get(check_auth(user_role.user), brand_controller.admin);
export const brand_router = router;
