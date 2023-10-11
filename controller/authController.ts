import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { resetAccountPassword, sendAccountOpeningMail } from "../utils/email";
import { streamUpload } from "../utils/streamUpload";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    const salt: any = await bcrypt.genSalt(10);
    const hash: any = await bcrypt.hash(password, salt);

    const value = crypto.randomBytes(32).toString("hex");
    const token = jwt.sign(value, "secret");

    const user = await prisma.authService.create({
      data: {
        name,
        password: hash,
        token,
        email,
      },
    });

    const tokenID = jwt.sign({ id: user.id }, "secret");
    sendAccountOpeningMail(user, tokenID).then(() => {
      console.log("Mail sent");
    });
    return res.status(201).json({
      message: "success",
      data: user,
      token: tokenID,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error registering user",
      data: error.message,
    });
  }
};

export const signInAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.authService.findUnique({
      where: { email },
    });
    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        if (user.verified && user.token === "") {
          const token = jwt.sign({ id: user.id }, "secret");

          return res.status(201).json({
            message: "successfully signed in",
            data: token,
          });
        } else {
          return res.status(404).json({
            message: "verify your email address",
          });
        }
      } else {
        return res.status(404).json({
          message: "invalid password",
        });
      }
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error registering user",
      data: error.message,
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await prisma.authService.findUnique({
      where: { id: userID },
    });
    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error registering user",
      data: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await prisma.authService.delete({
      where: { id: userID },
    });
    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error registering user",
      data: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const user = await prisma.authService.findMany({});
    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error registering user",
      data: error.message,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const getID: any = jwt.verify(token, "secret", (err, payload) => {
      if (err) {
        return err;
      } else {
        return payload;
      }
    });

    const user = await prisma.authService.findUnique({
      where: { id: getID.id },
    });

    if (user?.verified && user.token !== "") {
      const salt: any = await bcrypt.genSalt(10);
      const hash: any = await bcrypt.hash(password, salt);
      const pass = await prisma.authService.update({
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
    } else {
      return res.status(404).json({
        message: "error",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error registering user",
      data: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response)=>{
    try {
       const {email}=req.body
       
       const user = await prisma.authService.findUnique({
        where:{email}
       })
       if (user?.verified && user.token === "") {
       const token =jwt.sign({id:user.id}, "secret")


        const pass = await prisma.authService.update({
          where: { id: user.id },
          data: {
            token,
          },
        });
        resetAccountPassword(user, token).then(()=>{
            console.log("mail sent")
        })
        return res.status(200).json({
          message: "success",
          data: pass,
        });
      } else {
        return res.status(404).json({
          message: "you cant reset your password",
        });
      }
    } catch (error:any) {
        return res.status(404).json({
            message: "error registering user",
            data: error.message,
          });
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      const getID: any = jwt.verify(token, "secret", (err, payload) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      });
  
      const user = await prisma.authService.update({
        where: { id: getID?.id },
        data:{
            verified:true,
            token:""
        }
      });
      return res.status(200).json({
        message: "success",
        data: user,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "error registering user",
        data: error.message,
      });
    }
  };

  export const updateAvatar =async(req:any, res:Response)=>{
    try {
      const {userID} = req.params
      const {secure_url, public_id}:any = await streamUpload(req)
  
      const user =await prisma.authService.update({
        where:{id:userID},
        data:{
          avatar:secure_url, avatarURL:public_id
        }
      })
      return res.status(201).json({
        message:"Success",
        data:user
      })
    } catch (error:any) {
      return res.status(404).json({
        message:"Error updating avatar",
        data:error.message
      })
    }
  }