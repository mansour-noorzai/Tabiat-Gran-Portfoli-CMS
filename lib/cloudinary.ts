import { v2 as cloudinary } from "cloudinary";

export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary environment variables are not configured");
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return cloudinary;
}

export async function uploadBuffer(buffer: Buffer, filename: string, folder = "tabiat-gran") {
  const instance = getCloudinary();
  return new Promise<any>((resolve, reject) => {
    const stream = instance.uploader.upload_stream(
      { folder, resource_type: "auto", use_filename: true, unique_filename: true, filename_override: filename },
      (error, result) => (error || !result ? reject(error ?? new Error("Upload failed")) : resolve(result)),
    );
    stream.end(buffer);
  });
}

export async function deleteAsset(publicId: string, preferredResourceType?: string) {
  const instance = getCloudinary();
  const allowed = new Set(["image", "video", "raw"]);
  const first = preferredResourceType && allowed.has(preferredResourceType) ? preferredResourceType : "image";
  const candidates = [first, "image", "raw", "video"].filter((value, index, array) => array.indexOf(value) === index);
  let lastResult: any = null;
  let lastError: unknown = null;

  for (const resourceType of candidates) {
    try {
      const result = await instance.uploader.destroy(publicId, { resource_type: resourceType, type: "upload", invalidate: true });
      lastResult = result;
      if (result?.result === "ok") return { deleted: true, result, resourceType };
      if (result?.result !== "not found") return { deleted: true, result, resourceType };
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResult?.result === "not found") return { deleted: false, alreadyMissing: true, result: lastResult };
  if (lastError) throw lastError;
  throw new Error("Cloudinary did not confirm deletion");
}
