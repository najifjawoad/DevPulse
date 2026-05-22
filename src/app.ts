import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import config from "./config/env";
import { initDB, pool } from "./DB/db";
import { userRoute } from "./modules/users/users.route";
import { issuesRoute } from "./modules/issues/issues.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse server",
    author: "next level",
  });
});

app.use("/api/users", userRoute);

app.use("/api/issues" , issuesRoute );
app.use("/api/auth", authRoute)

export default app;
