"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAudioTranscription = void 0;
const convertToWav_1 = __importDefault(require("../services/audioProcessing/convertToWav"));
const transcribeWavToText_1 = __importDefault(require("../services/audioProcessing/transcribeWavToText"));
const fs_1 = __importDefault(require("fs"));
require("dotenv").config();
const handleAudioTranscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received request to /api/audio-to-text");
    if (req.file && req.file.path) {
        const filePath = req.file.path;
        const model = "whisper-1"; // this should be passed in as part of the request rather than hardcoded on server maybe?
        // Convert the audio file to wav format
        (0, convertToWav_1.default)(filePath, (err, wavFilePath) => __awaiter(void 0, void 0, void 0, function* () {
            if (err || !wavFilePath) {
                console.error("Conversion error:", err);
                return res
                    .status(500)
                    .json({ error: "Failed to convert audio to WAV" });
            }
            // Transcribe the WAV file to text
            const text = yield (0, transcribeWavToText_1.default)(wavFilePath, model, process.env.OPENAI_API_KEY);
            if (text) {
                res.json({ text: text });
            }
            else {
                res.status(500).json({ error: "Failed to transcribe audio" });
            }
            // Remove the temporary files
            fs_1.default.unlinkSync(filePath);
            fs_1.default.unlinkSync(wavFilePath);
        }));
    }
    else {
        res.status(400).send("No file received");
    }
});
exports.handleAudioTranscription = handleAudioTranscription;
