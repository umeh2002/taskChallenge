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
exports.updateAvatar = exports.verifyUser = exports.resetPassword = exports.changePassword = exports.getAll = exports.deleteUser = exports.getOne = exports.signInAccount = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const streamUpload_1 = require("../utils/streamUpload");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const value = crypto_1.default.randomBytes(32).toString("hex");
        const token = jsonwebtoken_1.default.sign(value, "secret");
        const user = yield prisma.authService.create({
            data: {
                name,
                password: hash,
                token,
                email,
            },
        });
        const tokenID = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
        (0, email_1.sendAccountOpeningMail)(user, tokenID).then(() => {
            console.log("Mail sent");
        });
        return res.status(201).json({
            message: "success",
            data: user,
            token: tokenID,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.registerUser = registerUser;
const signInAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.authService.findUnique({
            where: { email },
        });
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user.password);
            if (check) {
                if (user.verified && user.token === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
                    return res.status(201).json({
                        message: "successfully signed in",
                        data: token,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "verify your email address",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "invalid password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "user not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.signInAccount = signInAccount;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authService.findUnique({
            where: { id: userID },
        });
        return res.status(200).json({
            message: "success",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.getOne = getOne;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authService.delete({
            where: { id: userID },
        });
        return res.status(200).json({
            message: "success",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.authService.findMany({});
        return res.status(200).json({
            message: "success",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.getAll = getAll;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const getID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authService.findUnique({
            where: { id: getID.id },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && user.token !== "") {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(password, salt);
            const pass = yield prisma.authService.update({
                where: { id: user.id },
                data: {
                    password: hash,
                    token: "",
                },
            });
            return res.status(200).json({
                message: "success",
                data: pass,
            });
        }
        else {
            return res.status(404).json({
                message: "error",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.changePassword = changePassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prisma.authService.findUnique({
            where: { email }
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && user.token === "") {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
            const pass = yield prisma.authService.update({
                where: { id: user.id },
                data: {
                    token,
                },
            });
            (0, email_1.resetAccountPassword)(user, token).then(() => {
                console.log("mail sent");
            });
            return res.status(200).json({
                message: "success",
                data: pass,
            });
        }
        else {
            return res.status(404).json({
                message: "you cant reset your password",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.resetPassword = resetPassword;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const getID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authService.update({
            where: { id: getID === null || getID === void 0 ? void 0 : getID.id },
            data: {
                verified: true,
                token: ""
            }
        });
        return res.status(200).json({
            message: "success",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
        });
    }
});
exports.verifyUser = verifyUser;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { secure_url, public_id } = yield (0, streamUpload_1.streamUpload)(req);
        const user = yield prisma.authService.update({
            where: { id: userID },
            data: {
                avatar: secure_url, avatarURL: public_id
            }
        });
        return res.status(201).json({
            message: "Success",
            data: user
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error updating avatar",
            data: error.message
        });
    }
});
exports.updateAvatar = updateAvatar;
