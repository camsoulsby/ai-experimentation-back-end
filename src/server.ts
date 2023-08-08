import express from "express";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", audioRoutes);

app.listen(3001, () => {
  console.log("Server listening at http://localhost:3001");
});
