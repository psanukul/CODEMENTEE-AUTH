import express from "express";
import { login, signup } from "../controller/auth.controller.js";
import passport from "passport";
import chalk from "chalk";
import prisma from "../prisma/prismaClient.js";
import { cookieConfig } from "../kitchensink/cookieConfig.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRoutes = express.Router();

authRoutes.route('/signup').post(signup);
authRoutes.route('/login').post(login);



export default authRoutes;