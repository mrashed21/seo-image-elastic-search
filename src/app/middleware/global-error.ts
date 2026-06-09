import { file_delete } from "@/utils/file-deleted";
import { NextFunction, Request, Response } from "express";
import { handleMongooseError } from "./error-handler";

export const global_error = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await file_delete(req);
  const formattedError = handleMongooseError(error);

  res.status(formattedError.status_code).json({
    success: formattedError.success,
    message: formattedError.message,
    errorSource: formattedError.errorSource,
  });
};
