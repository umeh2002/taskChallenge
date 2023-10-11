"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.change = exports.reset = exports.signIn = exports.createAccount = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAccount = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().trim().lowercase().required(),
    password: joi_1.default.string().required(),
    confirm: joi_1.default.ref("password"),
});
exports.signIn = joi_1.default.object({
    email: joi_1.default.string().email().trim().lowercase().required(),
    password: joi_1.default.string().required(),
});
exports.reset = joi_1.default.object({
    email: joi_1.default.string().email().trim().lowercase().required(),
});
exports.change = joi_1.default.object({
    password: joi_1.default.string().required(),
});
