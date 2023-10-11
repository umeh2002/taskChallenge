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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneTask = exports.deleteTask = exports.deleteOneTask = exports.viewUserTask = exports.getOneTask = exports.getAllTask = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { taskName, priority } = req.body;
        const user = yield prisma.authService.findUnique({
            where: { id: userID },
            include: { task: true },
        });
        if (user) {
            const taked = yield prisma.taskService.create({
                data: {
                    taskName,
                    priority,
                    userID,
                    avatar: user.avatar,
                    name: user.name
                },
            });
            user === null || user === void 0 ? void 0 : user.task.push(taked);
            // console.log(user?.task.push(taked))
            return res.status(201).json({
                message: "Task created",
                data: taked,
            });
        }
        else {
            return res.status(404).json({
                message: "user not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating task",
            data: error.message,
        });
    }
});
exports.createTask = createTask;
const getAllTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasked = yield prisma.taskService.findMany({});
        return res.status(201).json({
            message: "Task created",
            data: tasked,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating task",
            data: error.message,
        });
    }
});
exports.getAllTask = getAllTask;
const getOneTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskID } = req.params;
        const tasked = yield prisma.taskService.findUnique({
            where: { id: taskID },
        });
        return res.status(201).json({
            message: "Task created",
            data: tasked,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating task",
            data: error.message,
        });
    }
});
exports.getOneTask = getOneTask;
const viewUserTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authService.findUnique({
            where: { id: userID },
            include: { task: true },
        });
        if (user) {
            return res.status(201).json({
                message: "Task created",
                data: user.task,
            });
        }
        else {
            return res.status(404).json({
                message: "register user",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating task",
            data: error.message,
        });
    }
});
exports.viewUserTask = viewUserTask;
const deleteOneTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskID } = req.params;
        const tasked = yield prisma.taskService.delete({
            where: { id: taskID },
        });
        return res.status(201).json({
            message: "Task created",
            data: tasked,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating task",
            data: error.message,
        });
    }
});
exports.deleteOneTask = deleteOneTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskID, userID } = req.params;
        const tasked = yield prisma.taskService.findUnique({
            where: { id: taskID },
        });
        const user = yield prisma.authService.delete({
            where: { id: userID },
        });
        if ((user === null || user === void 0 ? void 0 : user.id) === (tasked === null || tasked === void 0 ? void 0 : tasked.userID)) {
            const taked = yield prisma.taskService.delete({
                where: { id: taskID },
            });
            return res.status(201).json({
                message: "Task created",
                data: taked,
            });
        }
        else {
            return res.status(404).json({
                message: "you cannot delete",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating task",
            data: error.message,
        });
    }
});
exports.deleteTask = deleteTask;
const updateOneTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskID } = req.params;
        const { taskName, priority } = req.body;
        const tasked = yield prisma.taskService.update({
            where: { id: taskID },
            data: {
                taskName,
                priority,
            },
        });
        return res.status(201).json({
            message: "Task created",
            data: tasked,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating task",
            data: error.message,
        });
    }
});
exports.updateOneTask = updateOneTask;
