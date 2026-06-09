import multer from "multer";

// Image Search
export const multer_memory_upload = multer({
  storage: multer.memoryStorage(),
});
