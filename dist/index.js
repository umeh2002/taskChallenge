"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const main_1 = require("./main");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
(0, main_1.mainApp)(app);
const server = app.listen(port, () => {
    console.log("");
    console.log("server listening on port", port);
});
process.on("uncaughtException", (err) => {
    console.log("server uncaught exception", err);
});
process.on("unhandledRejection", (reason) => {
    console.log("server unhandled rejection", reason);
    server.close(() => {
        process.exit(1);
    });
});
