import { Request, Response } from "express";
import attributeCallTranscription from "../services/textProcessing/attributeCallTranscription";

require("dotenv").config();

export const handleCallTranscriptionAttribution = async (
  req: Request,
  res: Response
) => {
  console.log("Received request to /api/attribute-call-transcription");
  const text = req.body.text;
  const model = req.body.model;
  if (text) {
    const output = await attributeCallTranscription(text, model);

    res.json({ text: output });
  } else {
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
};
