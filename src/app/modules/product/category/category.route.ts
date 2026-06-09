import { check_auth } from "@/app/middleware/auth-middleware";
import { validate_request } from "@/app/middleware/validate-request";
import { multer_upload } from "@/config/multer";
import { Router } from "express";
import { user_role } from "../../auth/auth.interface";
import { category_controller } from "./category.controller";
import { category_validation } from "./category.validation";

const router: Router = Router();

router
  .route("/")
  .get(check_auth(user_role.user), category_controller.get)
  .post(
    check_auth(user_role.user),
    multer_upload.single("category_image"),
    validate_request(category_validation.create),
    category_controller.create,
  )
  .patch(
    check_auth(user_role.user),
    multer_upload.single("category_image"),
    validate_request(category_validation.update),
    category_controller.update,
  )
  .delete(
    check_auth(user_role.user),
    validate_request(category_validation.delete),
    category_controller.delete,
  );

export const category_router = router;
