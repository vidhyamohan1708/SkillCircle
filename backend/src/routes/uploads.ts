import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { getCloudinary } from "../config/cloudinary";

const router = Router();
const imageUploadSchema = z.object({
  image: z.string().regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, "A base64 image is required").max(10_000_000),
  kind: z.enum(["profile", "cover", "post"]).default("profile"),
});

router.post("/image", requireAuth, async (request, response) => {
  const parsed = imageUploadSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "A valid image is required" });
    return;
  }

  try {
    const result = await getCloudinary().uploader.upload(parsed.data.image, {
      folder: `skillcircle/${parsed.data.kind}`,
      resource_type: "image",
    });
    response.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    response.status(502).json({ error: "Image upload failed" });
  }
});

export default router;