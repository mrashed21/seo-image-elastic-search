import { check_auth } from "@/app/middleware/auth-middleware";
import { validate_request } from "@/app/middleware/validate-request";
import { Router } from "express";
import { user_role } from "../../auth/auth.interface";
import { attribute_controller } from "./attribute.controller";
import { attribute_validation } from "./attribute.validation";

const router: Router = Router();

router
  .route("/")
  .get(check_auth(user_role.user), attribute_controller.get)
  .post(
    check_auth(user_role.user),
    validate_request(attribute_validation.create),
    attribute_controller.create,
  )
  .patch(
    check_auth(user_role.user),
    validate_request(attribute_validation.update),
    attribute_controller.update,
  )
  .delete(
    check_auth(user_role.user),
    validate_request(attribute_validation.delete),
    attribute_controller.delete,
  );

router
  .route("/admin")
  .get(check_auth(user_role.user), attribute_controller.admin);
export const attribute_router = router;
