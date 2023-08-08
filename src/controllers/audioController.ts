import { Request, Response } from "express";
import convertToWav from "../services/audioProcessing/convertToWav";
import transcribeWavToText from "../services/audioProcessing/transcribeWavToText";
import fs, { realpathSync } from "fs";
import basicTextCompletion from "../services/textProcessing/basicTextCompletion";

require("dotenv").config();

export const uploadAudio = async (req: Request, res: Response) => {
  console.log("Received request to /api/upload-audio");

  if (req.file && req.file.path) {
    const filePath = req.file.path;
    const model = "whisper-1";

    // Convert the audio file to wav format
    convertToWav(filePath, async (err, wavFilePath) => {
      if (err || !wavFilePath) {
        console.error("Conversion error:", err);
        return res
          .status(500)
          .json({ error: "Failed to convert audio to WAV" });
      }

      // Transcribe the WAV file to text
      const text = await transcribeWavToText(
        wavFilePath,
        model,
        process.env.OPENAI_API_KEY
      );

      if (text) {
        const output = await basicTextCompletion(text);

        res.json({ text: output });
      } else {
        res.status(500).json({ error: "Failed to transcribe audio" });
      }

      // Remove the temporary files
      fs.unlinkSync(filePath);
      fs.unlinkSync(wavFilePath);
    });
  } else {
    res.status(400).send("No file received");
  }
};
