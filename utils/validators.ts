import joi from "joi";

export const createAccount = joi.object({
  name: joi.string().required(),
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().required(),
  confirm: joi.ref("password"),
});

export const signIn = joi.object({
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().required(),
});

export const reset = joi.object({
  email: joi.string().email().trim().lowercase().required(),
});

export const change = joi.object({
  password: joi.string().required(),
});