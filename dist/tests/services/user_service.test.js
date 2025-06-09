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
const user_service_1 = __importDefault(require("../../src/services/user_service"));
const user_repository_1 = __importDefault(require("../../src/repositories/user_repository"));
const createUser_DTO_1 = __importDefault(require("../../src/dtos/createUser_DTO"));
const signinUser_DTO_1 = __importDefault(require("../../src/dtos/signinUser_DTO"));
const notFound_1 = __importDefault(require("../../src/errors/notFound"));
const unauthorisedError_1 = __importDefault(require("../../src/errors/unauthorisedError"));
jest.mock("../../src/repositories/user_repository");
describe("UserService - createUser (register)", () => {
    let userService;
    let userRepository;
    beforeEach(() => {
        userRepository = new user_repository_1.default();
        userService = new user_service_1.default(userRepository);
    });
    it("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = new createUser_DTO_1.default("test@example.com", "Test User", "password123");
        userRepository.createUser.mockResolvedValue({
            id: "userId",
            email: dto.email,
            name: dto.name,
            password: "hashed",
            role: "CUSTOMER",
            ticketsCreated: [],
            ticketsAssigned: [],
        });
        const result = yield userService.createUser(dto);
        expect(result.email).toBe(dto.email);
        expect(userRepository.createUser).toHaveBeenCalled();
    }));
});
describe("UserService - signinUser (login)", () => {
    let userService;
    let userRepository;
    beforeEach(() => {
        userRepository = new user_repository_1.default();
        userService = new user_service_1.default(userRepository);
    });
    it("should throw NotFoundError if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.signinUser.mockResolvedValue(null);
        const dto = new signinUser_DTO_1.default("notfound@example.com", "password123");
        yield expect(userService.signinUser(dto)).rejects.toThrow(notFound_1.default);
    }));
    it("should throw UnauthorisedError if password is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.signinUser.mockResolvedValue({
            id: "userId",
            email: "test@example.com",
            name: "Test User",
            password: "hashed",
            role: "CUSTOMER",
            ticketsCreated: [],
            ticketsAssigned: [],
        });
        const dto = new signinUser_DTO_1.default("test@example.com", "wrongpassword");
        jest.spyOn(require("bcryptjs"), "compareSync").mockReturnValue(false);
        yield expect(userService.signinUser(dto)).rejects.toThrow(unauthorisedError_1.default);
    }));
    it("should return token and user data on valid login", () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.signinUser.mockResolvedValue({
            id: "userId",
            email: "test@example.com",
            name: "Test User",
            password: "hashed",
            role: "CUSTOMER",
            ticketsCreated: [],
            ticketsAssigned: [],
        });
        const dto = new signinUser_DTO_1.default("test@example.com", "password123");
        jest.spyOn(require("bcryptjs"), "compareSync").mockReturnValue(true);
        jest.spyOn(require("../../src/utils/auth"), "generateJWT").mockReturnValue("mocktoken");
        const result = yield userService.signinUser(dto);
        expect(result).not.toBeNull();
        // Use type assertion to access userData property
        expect(result.token).toBe("mocktoken");
        expect(result.userData).toBeDefined();
        expect(result.userData.name).toBe("Test User");
    }));
});
