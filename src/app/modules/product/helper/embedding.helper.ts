import { pipeline, RawImage } from "@xenova/transformers";
import fs from "fs";
import path from "path";

let extractor: any = null;

export const getExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "image-feature-extraction",
      "Xenova/clip-vit-base-patch32",
    );
  }
  return extractor;
};

const isUrl = (input: string): boolean => {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
};

const isLocalFile = (input: string): boolean => {
  try {
    return fs.existsSync(path.resolve(input));
  } catch {
    return false;
  }
};

export const generateEmbedding = async (
  imageInput: string | Buffer,
): Promise<number[]> => {
  if (!imageInput) {
    throw new Error("Image input is required");
  }

  const extractor = await getExtractor();

  let resolvedInput: string | RawImage;

  if (Buffer.isBuffer(imageInput)) {
    // Buffer → RawImage — convert Buffer to Uint8Array to satisfy Blob constructor types
    const uint8 = new Uint8Array(imageInput);
    resolvedInput = await RawImage.fromBlob(new Blob([uint8]));
  } else if (isUrl(imageInput)) {
    resolvedInput = imageInput;
  } else if (isLocalFile(imageInput)) {
    resolvedInput = path.resolve(imageInput);
  } else {
    throw new Error(`Invalid image input: ${imageInput}`);
  }

  const output = await extractor(resolvedInput, {
    pooling: "mean",
    normalize: true,
  });

  const embedding = Array.from(output.data) as number[];

  if (!embedding.length) {
    throw new Error("Empty embedding generated");
  }

  return embedding;
};
