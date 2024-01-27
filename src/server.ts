import express from "express";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes";
import textRoutes from "./routes/textRoutes";
import http from "http";
import { validateJWT } from "./middlewares/jwtMiddleware"; // Adjust the path as needed

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://callreview.camsoulsby.com"
      : "http://localhost:5173",
};

app.use(cors(corsOptions));

app.use("/api", validateJWT);

app.use(express.json());
app.use("/api", audioRoutes);
app.use("/api", textRoutes);

// Add a ping endpoint for testing backend
app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
