import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

import convertToWav from "../src/services/audioProcessing/convertToWav";
import transcribeWavToText from "../src/services/audioProcessing/transcribeWavToText";

require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();

app.use(cors());
app.use(express.json());

const config = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const upload = multer({ dest: "uploads/" });

app.post("/api/upload-audio", upload.single("audio"), async (req, res) => {
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
        OPENAI_API_KEY
      );

      if (text) {
        res.json({ text: text });
      } else {
        res.status(500).json({ error: "Failed to transcribe audio" });
      }

      // Remove the temporary files
      // fs.unlinkSync(filePath);
      // fs.unlinkSync(wavFilePath);
    });
  } else {
    res.status(400).send("No file received");
  }
});

// app.post(
//   "/api/process-text",
//   async (req: express.Request, res: express.Response) => {
//     const inputText = req.body.text;

//     const completionRequest = {
//       model: "text-davinci-003",
//       prompt: `Ask a clarifying questions based on the follow text: ${inputText}`,
//       max_tokens: 100,
//     };

//     try {
//       const response = await openai.createCompletion(completionRequest);
//       console.log(response.data);

//       const processedText = response.data.choices[0].text.trim();

//       res.json({ processedText });
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while processing the text" });
//     }
//   }
// );

app.listen(3001, () => {
  console.log("Server listening at http://localhost:3001");
});
