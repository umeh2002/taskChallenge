import express, { Application } from "express";
import env from "dotenv";
import { mainApp } from "./main";

env.config();
const app: Application = express();

const port: number = parseInt(process.env.PORT!);
mainApp(app);

const server = app.listen(port, () => {
  console.log("");
  console.log("server listening on port", port);
});

process.on("uncaughtException", (err: any) => {
  console.log("server uncaught exception", err);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("server unhandled rejection", reason);

  server.close(() => {
    process.exit(1);
  });
});
