"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
fluent_ffmpeg_1.default.setFfmpegPath(ffmpegPath);
const convertToWav = (filePath, callback) => {
    // Path to the converted WAV file
    const wavFilePath = filePath + ".wav";
    // Convert to WAV using ffmpeg
    (0, fluent_ffmpeg_1.default)(filePath)
        .output(wavFilePath)
        .audioCodec("pcm_s16le")
        .audioChannels(1)
        .audioFrequency(16000)
        .on("end", () => callback(null, wavFilePath))
        .on("error", (err) => callback(err))
        .run(); // Start the conversion
};
exports.default = convertToWav;
