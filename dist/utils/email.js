"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAccountPassword = exports.sendAccountOpeningMail = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const GOOGLE_ID = "72356347044-qj7re6pj9lc6onng45o5f6s6k9qk9q67.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REFRESH_TOKEN = "1//04bvw-58jDJqbCgYIARAAGAQSNwF-L9IrqMkUVudZc-hQ0eT5zPqpyt57Q6TgAnl25j3sVZcuJIMetAENeundPQHMkUWZ-Nqj984";
const GOOGLE_URL = "https://developers.google.com/oauthplayground";
// import file from "../views/index.ejs"
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ access_token: GOOGLE_REFRESH_TOKEN });
// const url: string = "https://task-challenge.netlify.app";
// const url: string = "https://task-challenge.netlify.app";
// const url:string ="http://localhost:5173"
const sendAccountOpeningMail = (user, tokenID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAccess = (yield oAuth.getAccessToken()).token;
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "eumeh3882@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: getAccess,
            },
        });
        const passedData = {
            userName: user.name,
            url: `https://todo-challenge-emma.web.app/${tokenID}/verify-account`,
        };
        const readData = path_1.default.join(__dirname, "../views/index.ejs");
        const data = yield ejs_1.default.renderFile(readData, passedData);
        console.log(data);
        const mailer = {
            from: " <eumeh3882@gmail.com> ",
            to: user.email,
            subject: "Welcome ",
            html: data,
        };
        transport.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendAccountOpeningMail = sendAccountOpeningMail;
const resetAccountPassword = (user, tokenID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAccess = (yield oAuth.getAccessToken()).token;
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "eumeh3882@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: getAccess,
            },
        });
        const passedData = {
            userName: user.name,
            url: `https://todo-challenge-emma.web.app/${tokenID}/reset-password`,
        };
        const readData = path_1.default.join(__dirname, "../views/resetPassword.ejs");
        const data = yield ejs_1.default.renderFile(readData, passedData);
        const mailer = {
            from: " <eumeh3882@gmail.com > ",
            to: user.email,
            subject: "Welcome you can now reset your password",
            html: data,
        };
        transport.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.resetAccountPassword = resetAccountPassword;
