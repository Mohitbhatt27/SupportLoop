"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const ticketRoutes_1 = __importDefault(require("./ticketRoutes"));
const v1Router = express_1.default.Router();
v1Router.use("/users", userRoutes_1.default);
v1Router.use("/tickets", ticketRoutes_1.default);
exports.default = v1Router;
