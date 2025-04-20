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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const server_config_1 = __importDefault(require("./src/config/server_config"));
const routes_1 = __importDefault(require("./src/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.text());
// Serve static files from the "dist" directory
app.use(express_1.default.static("frontend_dist"));
// API routes
app.use("/api", routes_1.default);
// Fallback route to serve React app's index.html for any unknown routes
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "frontend_dist", "index.html"));
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(server_config_1.default.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server started on port ${server_config_1.default.PORT}`);
}));
