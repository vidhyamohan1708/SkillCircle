import { Schema, model, type InferSchemaType } from "mongoose";

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  image: { type: String, default: "" },
  likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, maxlength: 500 },
  }],
}, { timestamps: true });

postSchema.index({ createdAt: -1 });
export type PostDocument = InferSchemaType<typeof postSchema>;
export const Post = model("Post", postSchema);
