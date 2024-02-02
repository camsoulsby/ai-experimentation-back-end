import express from "express";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes";
import textRoutes from "./routes/textRoutes";
import http from "http";
import { validateJWT } from "./middlewares/jwtMiddleware";
import { checkAllowedEmails } from "./middlewares/checkAllowedEmails";

const app = express();
const server = http.createServer(app);

//redirect HTTP requests to HTTPS
app.use((req, res, next) => {
  if (
    req.header("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://callreview.camsoulsby.com"
      : "http://localhost:5173",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api", validateJWT);

app.use("/api", checkAllowedEmails);

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
