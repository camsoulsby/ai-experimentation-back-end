import express from "express";
import { textToAnnotatedText } from "../controllers/textController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/annotate-call-text", upload.single("text"), textToAnnotatedText);

export default router;
