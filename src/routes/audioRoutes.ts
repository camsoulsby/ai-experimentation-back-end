import express from "express";
import {
  audioToText,
  uploadAudio,
  uploadAudio35,
  uploadAudioToCode,
  uploadAudioCallReview,
} from "../controllers/audioController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/audio-to-text", upload.single("audio"), audioToText);
router.post("/upload-audio", upload.single("audio"), uploadAudio);
router.post("/upload-audio-35", upload.single("audio"), uploadAudio35);
router.post("/upload-audio-to-code", upload.single("audio"), uploadAudioToCode);
router.post(
  "/upload-audio-call-review",
  upload.single("audio"),
  uploadAudioCallReview
);

export default router;
