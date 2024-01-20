import express from "express";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes";
import textRoutes from "./routes/textRoutes";
import http from "http";
// import WebSocket from "ws";

const app = express();
const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// Add a ping endpoint for testing backend
app.get("/ping", (req, res) => {
  res.send("pong");
});

const corsOptions = {
  origin: "https://callreview.camsoulsby.com", // Replace with your actual frontend domain
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", audioRoutes);
app.use("/api", textRoutes);

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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
