import express from "express";
import {
  uploadAudio,
  uploadAudio35,
  uploadAudioToCode,
} from "../controllers/audioController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-audio", upload.single("audio"), uploadAudio);
router.post("/upload-audio-35", upload.single("audio"), uploadAudio35);
router.post("/upload-audio-to-code", upload.single("audio"), uploadAudioToCode);

export default router;
