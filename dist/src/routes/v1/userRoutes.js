"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const user_controller_1 = __importDefault(require("../../controllers/user_controller"));
const user_middleware_1 = require("../../middlewares/user_middleware");
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const { getUserById, getAllUsers, createUser, signinUser, updateUserRole } = user_controller_1.default;
userRouter.get("/:id", getUserById);
userRouter.get("/", getAllUsers);
userRouter.post("/signup", user_middleware_1.createUserMiddleware, createUser);
userRouter.post("/signin", user_middleware_1.signInValidator, signinUser);
userRouter.patch("/updateRole/:id", auth_middleware_1.isLoggedIn, auth_middleware_1.isAdmin, updateUserRole);
exports.default = userRouter;
