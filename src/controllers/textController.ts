import { Request, Response } from "express";
import convertToWav from "../services/audioProcessing/convertToWav";
import transcribeWavToText from "../services/audioProcessing/transcribeWavToText";
import fs, { realpathSync } from "fs";
import basicTextCompletion from "../services/textProcessing/basicTextCompletion";
import gpt35ChatCompletion from "../services/textProcessing/gpt35ChatCompletion";
import annotateCallTranscription from "../services/textProcessing/annotateCallTranscription";

require("dotenv").config();

export const textToAnnotatedText = async (req: Request, res: Response) => {
  console.log("Received request to /api/annotate-call-text");
  const text = req.body.text;
  if (text) {
    const output = await gpt35ChatCompletion(text);

    res.json({ text: output });
  } else {
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
};
