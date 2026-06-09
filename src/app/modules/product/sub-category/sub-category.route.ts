import { check_auth } from "@/app/middleware/auth-middleware";
import { validate_request } from "@/app/middleware/validate-request";
import { multer_upload } from "@/config/multer";
import { Router } from "express";
import { user_role } from "../../auth/auth.interface";
import { sub_category_controller } from "./sub-category.controller";
import { sub_category_validation } from "./sub-category.validation";

const router: Router = Router();

router
  .route("/")
  .get(check_auth(user_role.user), sub_category_controller.get)
  .post(
    check_auth(user_role.user),
    multer_upload.single("sub_category_image"),
    validate_request(sub_category_validation.create),
    sub_category_controller.create,
  )
  .patch(
    check_auth(user_role.user),
    multer_upload.single("sub_category_image"),
    validate_request(sub_category_validation.update),
    sub_category_controller.update,
  )
  .delete(
    check_auth(user_role.user),
    validate_request(sub_category_validation.delete),
    sub_category_controller.delete,
  );

router
  .route("/admin")
  .get(check_auth(user_role.user), sub_category_controller.admin_get);
export const sub_category_router = router;
