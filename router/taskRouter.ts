import { Router } from "express";
import { createTask, deleteOneTask, deleteTask, getAllTask, getOneTask, updateOneTask, viewUserTask } from "../controller/taskController";

const router = Router()

router.route("/:userID/create-task").post(createTask)
router.route("/get-all-task").get(getAllTask)
router.route("/:taskID/get-one-task").get(getOneTask)
router.route("/:userID/get-task").get(viewUserTask)
router.route("/:taskID/delete-one-task").delete(deleteOneTask)
router.route("/:taskID/update-one-task").patch(updateOneTask)
router.route("/:userID/:taskID/get-one-task").delete(deleteTask)



export default router