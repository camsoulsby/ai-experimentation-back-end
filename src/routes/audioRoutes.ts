import express from "express";
import { uploadAudio } from "../controllers/audioController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-audio", upload.single("audio"), uploadAudio);

export default router;
