import cors from "cors";
import express from "express";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import uploadsRouter from "./routes/uploads";
import networkRouter from "./routes/network";
import path from "node:path";

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "skillcircle-api", phase: 2 });
});
app.get("/api/config", (_request, response) => {
  response.json({ firebase: { apiKey: process.env.FIREBASE_API_KEY, authDomain: process.env.FIREBASE_AUTH_DOMAIN, projectId: process.env.FIREBASE_PROJECT_ID, storageBucket: process.env.FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID, appId: process.env.FIREBASE_APP_ID } });
});
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/network", networkRouter);
const frontendPath = path.resolve(process.cwd(), "../frontend");
app.use(express.static(frontendPath));
app.get("*", (_request, response) => response.sendFile(path.join(frontendPath, "index.html")));

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});
