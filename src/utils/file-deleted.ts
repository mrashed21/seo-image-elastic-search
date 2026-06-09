import { Request } from "express";
import { delete_file } from "../config/file-uploder";

export const file_delete = async (req: Request) => {
  try {
    const filesToDelete: string[] = [];

    // single file upload
    if (req.file?.path) {
      filesToDelete.push(req.file.path);
    }

    // upload.fields(...)
    if (
      req.files &&
      typeof req.files === "object" &&
      !Array.isArray(req.files)
    ) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file?.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    }

    // upload.array(...) / upload.any(...)
    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file?.path) {
          filesToDelete.push(file.path);
        }
      });
    }

    // remove duplicate urls
    const uniqueFiles = [...new Set(filesToDelete)];

    if (uniqueFiles.length === 0) {
      return;
    }

    await Promise.allSettled(uniqueFiles.map((url) => delete_file(url)));

    console.log(
      `\n🗑️ Deleted ${uniqueFiles.length} uploaded file(s) from Cloudinary due to request failure.\n`,
    );
  } catch (error) {
    console.error(
      "\n❌ Error deleting uploaded files from Cloudinary\n",
      error,
    );
  }
};
