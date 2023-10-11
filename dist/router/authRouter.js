"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authController_1 = require("../controller/authController");
const validatorsHandler_1 = __importDefault(require("../utils/validatorsHandler"));
const validators_1 = require("../utils/validators");
const upload = (0, multer_1.default)().single("avatar");
const router = (0, express_1.Router)();
router
    .route("/register-user")
    .post((0, validatorsHandler_1.default)(validators_1.createAccount), authController_1.registerUser);
router.route("/sign-in").post((0, validatorsHandler_1.default)(validators_1.signIn), authController_1.signInAccount);
router.route("/:userID/get-one").get(authController_1.getOne);
router.route("/:userID/delete-user").delete(authController_1.deleteUser);
router.route("/get-all").get(authController_1.getAll);
router
    .route("/:token/change-password")
    .patch((0, validatorsHandler_1.default)(validators_1.change), authController_1.changePassword);
router.route("/reset-password").patch((0, validatorsHandler_1.default)(validators_1.reset), authController_1.resetPassword);
router.route("/:token/verify").patch(authController_1.verifyUser);
router.route("/:userID/update-avatar").patch(upload, authController_1.updateAvatar);
exports.default = router;
