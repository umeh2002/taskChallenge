import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { taskName, priority } = req.body;

    const user = await prisma.authService.findUnique({
      where: { id: userID },
      include: { task: true },
    });
    
    if (user) {
      const taked = await prisma.taskService.create({
        data: {
          taskName,
          priority,
          userID,
          avatar:user.avatar,
          name:user.name
        },
      });
      user?.task.push(taked);
      // console.log(user?.task.push(taked))
      return res.status(201).json({
        message: "Task created",
        data: taked,
      });
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating task",
      data: error.message,
    });
  }
};

export const getAllTask = async (req: Request, res: Response) => {
  try {
    const tasked = await prisma.taskService.findMany({});
    return res.status(201).json({
      message: "Task created",
      data: tasked,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating task",
      data: error.message,
    });
  }
};

export const getOneTask = async (req: Request, res: Response) => {
  try {
    const { taskID } = req.params;
    const tasked = await prisma.taskService.findUnique({
      where: { id: taskID },
    });
    return res.status(201).json({
      message: "Task created",
      data: tasked,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating task",
      data: error.message,
    });
  }
};

export const viewUserTask = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await prisma.authService.findUnique({
      where: { id: userID },
      include: { task: true },
    });
    if (user) {
      return res.status(201).json({
        message: "Task created",
        data: user.task,
      });
    } else {
      return res.status(404).json({
        message: "register user",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating task",
      data: error.message,
    });
  }
};

export const deleteOneTask = async (req: Request, res: Response) => {
  try {
    const { taskID } = req.params;
    const tasked = await prisma.taskService.delete({
      where: { id: taskID },
    });
    return res.status(201).json({
      message: "Task created",
      data: tasked,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating task",
      data: error.message,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskID, userID } = req.params;
    const tasked = await prisma.taskService.findUnique({
      where: { id: taskID },
    });

    const user = await prisma.authService.delete({
      where: { id: userID },
    });
    if (user?.id === tasked?.userID) {
      const taked = await prisma.taskService.delete({
        where: { id: taskID },
      });
      return res.status(201).json({
        message: "Task created",
        data: taked,
      });
    } else {
      return res.status(404).json({
        message: "you cannot delete",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating task",
      data: error.message,
    });
  }
};

export const updateOneTask = async (req: Request, res: Response) => {
  try {
    const { taskID } = req.params;
    const { taskName, priority } = req.body;
    const tasked = await prisma.taskService.update({
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
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating task",
      data: error.message,
    });
  }
};
