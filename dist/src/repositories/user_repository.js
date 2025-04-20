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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserRepository {
    createUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.create({
                data: {
                    name: userDetails.name,
                    email: userDetails.email,
                    password: userDetails.password,
                    role: "CUSTOMER",
                    ticketsCreated: [],
                    ticketsAssigned: [],
                },
            });
            return response;
        });
    }
    signinUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.findUnique({
                where: {
                    email: userDetails.email,
                },
            });
            console.log(response);
            return response;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.findUnique({
                where: {
                    id,
                },
            });
            return response;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.findUnique({
                where: {
                    email,
                },
            });
            return response;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.findMany();
            return response;
        });
    }
    updateUserRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.update({
                where: {
                    id,
                },
                data: {
                    role: role,
                },
            });
            return response;
        });
    }
    getAvailableEngineers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.findMany({
                where: {
                    role: "ENGINEER",
                },
            });
            return response;
        });
    }
    updateUser(id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.user.update({
                where: {
                    id,
                },
                data: Object.assign({}, updatedData),
            });
            return response;
        });
    }
}
exports.default = UserRepository;
