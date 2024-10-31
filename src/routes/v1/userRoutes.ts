import express from "express";
const userRouter = express.Router();
import userController from "../../controllers/user_controller";
import {
  createUserMiddleware,
  signInValidator,
} from "../../middlewares/user_middleware";
import { isAdmin, isLoggedIn } from "../../middlewares/auth_middleware";

const { getUserById, getAllUsers, createUser, signinUser, updateUserRole } =
  userController;

userRouter.get("/:id", getUserById);

userRouter.get("/", getAllUsers);

userRouter.post("/signup", createUserMiddleware, createUser);

userRouter.post("/signin", signInValidator, signinUser);

userRouter.patch("/updateRole/:id", isLoggedIn, isAdmin, updateUserRole);

export default userRouter;
