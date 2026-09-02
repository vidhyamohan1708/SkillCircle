import "dotenv/config";
import { connectDatabase } from "./config/database";
import { app } from "./app";

const port = Number(process.env.PORT || 4000);

connectDatabase()
  .then(() => app.listen(port, () => console.log(`SkillCircle API listening on port ${port}`)))
  .catch((error: unknown) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
