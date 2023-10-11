import { Router } from "express";
import multer from "multer";
import {
  changePassword,
  deleteUser,
  getAll,
  getOne,
  registerUser,
  resetPassword,
  signInAccount,
  updateAvatar,
  verifyUser,
} from "../controller/authController";
import validatorsHandler from "../utils/validatorsHandler";
import { change, createAccount, reset, signIn } from "../utils/validators";

const upload = multer().single("avatar");
const router = Router();
router
  .route("/register-user")
  .post(validatorsHandler(createAccount), registerUser);
router.route("/sign-in").post(validatorsHandler(signIn), signInAccount);
router.route("/:userID/get-one").get(getOne);
router.route("/:userID/delete-user").delete(deleteUser);
router.route("/get-all").get(getAll);
router
  .route("/:token/change-password")
  .patch(validatorsHandler(change), changePassword);
router.route("/reset-password").patch(validatorsHandler(reset), resetPassword);
router.route("/:token/verify").patch(verifyUser);
router.route("/:userID/update-avatar").patch(upload, updateAvatar);

export default router;
