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
// import WebSocket from "ws";
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// const wss = new WebSocket.Server({ server });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", audioRoutes_1.default);
app.use("/api", textRoutes_1.default);
// // Variable to hold a peice to be edited via websocket connection
// let text = "Initial text";
// wss.on("connection", (ws: WebSocket) => {
//   console.log("Client connected");
//   // Send the initial text to the client
//   ws.send(JSON.stringify({ text }));
//   ws.on("message", (message: string) => {
//     // Parse the client's request
//     const { action, newText } = JSON.parse(message);
//     if (action === "edit") {
//       // Update the text variable
//       text = newText;
//       console.log(`Text updated to: ${text}`);
//       // Optionally, send a confirmation or the updated text back to the client
//       ws.send(JSON.stringify({ text }));
//     }
//   });
// });
server.listen(3001, () => {
    console.log("Server listening at http://localhost:3001");
});
