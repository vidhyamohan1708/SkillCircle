import type { NextFunction, Request, Response } from "express";
import { getFirebaseAuth } from "../config/firebase";
import { User } from "../models/User";

export type AuthenticatedRequest = Request & { userId?: string; firebaseUid?: string };

export async function verifyFirebaseToken(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.startsWith("Bearer ")
    ? request.headers.authorization.slice(7)
    : undefined;

  if (!token) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const decoded = await getFirebaseAuth().verifyIdToken(token);
    request.firebaseUid = decoded.uid;
    next();
  } catch (error) {
    if (error instanceof Error && error.message === "Firebase Admin credentials are not configured") {
      response.status(503).json({ error: "Firebase Admin is not configured. Add backend/.env credentials." });
      return;
    }
    response.status(401).json({ error: "Invalid or expired authentication token" });
  }
}

export async function requireAuth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  await verifyFirebaseToken(request, response, async () => {
    const user = await User.findOne({ firebaseUid: request.firebaseUid });
    if (!user) {
      response.status(404).json({ error: "Complete your profile before continuing" });
      return;
    }
    request.userId = user.id;
    next();
  });
}
