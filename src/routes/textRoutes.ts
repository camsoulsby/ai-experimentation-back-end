import express from "express";
import { handleCallTranscriptionAttribution } from "../controllers/textController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/attribute-call-transcription",
  upload.single("text"),
  handleCallTranscriptionAttribution
);

export default router;
