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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const server_config_1 = __importDefault(require("../config/server_config"));
const auth_1 = require("../utils/auth");
const notFound_1 = __importDefault(require("../errors/notFound"));
const unauthorisedError_1 = __importDefault(require("../errors/unauthorisedError"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getUserById(id);
                if (!response) {
                    throw { error: "User not found" };
                }
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getAllUsers();
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    createUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const SaltRounds = bcryptjs_1.default.genSaltSync(server_config_1.default.SALT);
                userDetails.password = bcryptjs_1.default.hashSync(userDetails.password, SaltRounds);
                const response = yield this.userRepository.createUser(userDetails);
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    signinUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.signinUser(userDetails);
                if (!response) {
                    throw new notFound_1.default("User", "email", userDetails.email);
                }
                const isPasswordValid = bcryptjs_1.default.compareSync(userDetails.password, response.password);
                if (!isPasswordValid) {
                    throw new unauthorisedError_1.default();
                }
                const token = (0, auth_1.generateJWT)({
                    id: response.id,
                    email: response.email,
                    role: response.role,
                });
                const res = {
                    token: token,
                    id: response.id,
                    role: response.role,
                    userData: {
                        id: response.id,
                        name: response.name,
                    },
                };
                return res;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateUserRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.updateUserRole(id, role);
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = UserService;
