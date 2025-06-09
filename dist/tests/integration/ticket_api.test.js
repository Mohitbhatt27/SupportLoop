"use strict";
// Integration test for ticket API using Supertest and Jest
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
const app_1 = __importDefault(require("../../src/app"));
const supertest_1 = __importDefault(require("supertest"));
describe("Ticket API Integration", () => {
    // You may want to set up and tear down a test DB here
    it("should create a ticket (POST /api/v1/tickets/create)", () => __awaiter(void 0, void 0, void 0, function* () {
        // You may need to mock authentication or seed a user
        const token = "valid-jwt-token"; // Generate or mock a valid token
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/v1/tickets/create")
            .set("x-access-token", token)
            .send({
            title: "Integration Test Ticket",
            description: "Test desc",
            // ...other required fields
        });
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.success).toBe(true);
    }));
    // Add more tests for update, delete, get, etc.
});
