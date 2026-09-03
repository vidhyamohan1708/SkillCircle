import { Router } from "express";
import { z } from "zod";
import { Connection } from "../models/Connection";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const idSchema = z.string().regex(/^[a-f\d]{24}$/i);

router.get("/discover", requireAuth, async (request: AuthenticatedRequest, response) => {
  const query = typeof request.query.q === "string" ? request.query.q.trim() : "";
  const filter = query ? { _id: { $ne: request.userId }, $or: [{ name: new RegExp(query, "i") }, { college: new RegExp(query, "i") }, { skills: new RegExp(query, "i") }, { interests: new RegExp(query, "i") }] } : { _id: { $ne: request.userId } };
  const users = await User.find(filter).select("name username profileImage college degree skills interests").limit(30).lean();
  const connections = await Connection.find({ $or: [{ requester: request.userId }, { recipient: request.userId }] }).lean();
  response.json({ users: users.map((user) => ({ ...user, connection: connections.find((item) => item.requester.toString() === user._id.toString() || item.recipient.toString() === user._id.toString())?.status || "none" })) });
});

router.post("/connections/:userId", requireAuth, async (request: AuthenticatedRequest, response) => {
  const parsed = idSchema.safeParse(request.params.userId);
  if (!parsed.success || parsed.data === request.userId) { response.status(400).json({ error: "Invalid connection target" }); return; }
  const connection = await Connection.findOneAndUpdate({ requester: request.userId, recipient: parsed.data }, { $setOnInsert: { requester: request.userId, recipient: parsed.data, status: "pending" } }, { upsert: true, new: true });
  await Notification.create({ recipient: parsed.data, actor: request.userId, type: "connection_request" });
  response.status(201).json({ connection });
});

router.get("/connections", requireAuth, async (request: AuthenticatedRequest, response) => {
  const connections = await Connection.find({ $or: [{ requester: request.userId }, { recipient: request.userId }] }).populate("requester recipient", "name username profileImage college").lean();
  response.json({ connections });
});

router.get("/notifications", requireAuth, async (request: AuthenticatedRequest, response) => {
  const notifications = await Notification.find({ recipient: request.userId }).sort({ createdAt: -1 }).limit(50).populate("actor", "name username profileImage").lean();
  response.json({ notifications });
});

export default router;
