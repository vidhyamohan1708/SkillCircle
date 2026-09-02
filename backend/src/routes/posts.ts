import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { Post } from "../models/Post";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const postSchema = z.object({ content: z.string().trim().min(1).max(2000), image: z.string().url().optional() });
const commentSchema = z.object({ content: z.string().trim().min(1).max(500) });

router.get("/", async (request, response) => {
  const page = Math.max(Number(request.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 50);
  const posts = await Post.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
    .populate("author", "name username profileImage")
    .populate("comments.author", "name username profileImage")
    .lean();
  response.json({ posts: posts.map((post) => ({ ...post, comments: post.comments || [] })), page, hasMore: posts.length === limit });
});

router.post("/", requireAuth, async (request: AuthenticatedRequest, response) => {
  const parsed = postSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const post = await Post.create({ ...parsed.data, author: request.userId });
  await post.populate("author", "name username profileImage");
  response.status(201).json({ post });
});

router.post("/:id/like", requireAuth, async (request: AuthenticatedRequest, response) => {
  const post = await Post.findById(request.params.id);
  if (!post) {
    response.status(404).json({ error: "Post not found" });
    return;
  }
  const userId = request.userId!;
  const alreadyLiked = post.likes.some((like) => like.toString() === userId);
  post.likes = alreadyLiked
    ? post.likes.filter((like) => like.toString() !== userId)
    : [...post.likes, new Types.ObjectId(userId)];
  await post.save();
  response.json({ liked: !alreadyLiked, likeCount: post.likes.length });
});

router.post("/:id/comments", requireAuth, async (request: AuthenticatedRequest, response) => {
  const parsed = commentSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const post = await Post.findByIdAndUpdate(request.params.id, { $push: { comments: { author: request.userId, content: parsed.data.content } } }, { new: true })
    .populate("comments.author", "name username profileImage").lean();
  if (!post) {
    response.status(404).json({ error: "Post not found" });
    return;
  }
  response.status(201).json({ comments: post.comments });
});

router.delete("/:id", requireAuth, async (request: AuthenticatedRequest, response) => {
  const post = await Post.findOneAndDelete({ _id: request.params.id, author: request.userId });
  if (!post) {
    response.status(404).json({ error: "Post not found or not owned by you" });
    return;
  }
  response.status(204).send();
});

export default router;
