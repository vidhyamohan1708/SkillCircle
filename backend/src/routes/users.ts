import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { requireAuth, verifyFirebaseToken, type AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  username: z.string().trim().regex(/^[a-zA-Z0-9_]+$/).max(30),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
  college: z.string().max(160).optional(),
  degree: z.string().max(160).optional(),
  graduationYear: z.number().int().min(1900).max(2200).optional(),
  skills: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  interests: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
});

router.post("/", verifyFirebaseToken, async (request: AuthenticatedRequest, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success || !request.firebaseUid) {
    response.status(400).json({ error: "Valid profile fields are required" });
    return;
  }
  try {
    const user = await User.create({ ...parsed.data, firebaseUid: request.firebaseUid });
    response.status(201).json({ user });
  } catch (error) {
    response.status(409).json({ error: error instanceof Error ? error.message : "Could not create profile" });
  }
});

router.get("/me", requireAuth, async (request: AuthenticatedRequest, response) => {
  const user = await User.findById(request.userId).lean();
  response.json({ user });
});

router.patch("/me", requireAuth, async (request: AuthenticatedRequest, response) => {
  const parsed = profileSchema.partial().omit({ email: true }).safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const user = await User.findByIdAndUpdate(request.userId, parsed.data, { new: true, runValidators: true }).lean();
  response.json({ user });
});

router.get("/search", async (request, response) => {
  const query = typeof request.query.q === "string" ? request.query.q.trim() : "";
  if (!query) {
    response.json({ users: [] });
    return;
  }
  const users = await User.find({ $or: [{ name: new RegExp(query, "i") }, { username: new RegExp(query, "i") }, { college: new RegExp(query, "i") }, { skills: new RegExp(query, "i") }] }).limit(20).lean();
  response.json({ users });
});

export default router;
