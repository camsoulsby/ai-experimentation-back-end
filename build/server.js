"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const audioRoutes_1 = __importDefault(require("./routes/audioRoutes"));
const textRoutes_1 = __importDefault(require("./routes/textRoutes"));
const http_1 = __importDefault(require("http"));
const jwtMiddleware_1 = require("./middlewares/jwtMiddleware"); // Adjust the path as needed
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use("/api", jwtMiddleware_1.validateJWT);
// Add a ping endpoint for testing backend
app.get("/ping", (req, res) => {
    res.send("pong");
});
const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? "https://callreview.camsoulsby.com"
        : "http://localhost:5173",
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api", audioRoutes_1.default);
app.use("/api", textRoutes_1.default);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
