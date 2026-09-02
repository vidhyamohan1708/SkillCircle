import cors from "cors";
import express from "express";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import uploadsRouter from "./routes/uploads";

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "skillcircle-api", phase: 2 });
});
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/uploads", uploadsRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});
