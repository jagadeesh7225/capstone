import express from 'express';
import userAuth from '../Middlewares/userAuth.js';
import { getUserData } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);

export default userRouter;