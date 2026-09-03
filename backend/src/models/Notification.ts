import { Schema, model, type InferSchemaType } from "mongoose";

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["like", "comment", "connection_request", "connection_accepted"], required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;
export const Notification = model("Notification", notificationSchema);
