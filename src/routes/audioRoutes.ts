import express from "express";
import { handleAudioTranscription } from "../controllers/audioController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/audio-to-text", upload.single("audio"), handleAudioTranscription);

export default router;
