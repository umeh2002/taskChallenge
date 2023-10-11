import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import auth from "./router/authRouter"
import task from "./router/taskRouter"

export const mainApp = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.set("view engine", "ejs")

  app.get("/", async (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "welcome to my api",
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "error",
      });
    }
  });

  app.use("/api", auth)
  app.use("/api", task)
};
