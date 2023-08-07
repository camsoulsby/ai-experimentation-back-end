import ffmpeg from "fluent-ffmpeg";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

type ConvertToWavCallback = (err: Error | null, wavFilePath?: string) => void;

const convertToWav = (filePath: string, callback: ConvertToWavCallback) => {
  // Path to the converted WAV file
  const wavFilePath = filePath + ".wav";

  // Convert to WAV using ffmpeg
  ffmpeg(filePath)
    .output(wavFilePath)
    .audioCodec("pcm_s16le")
    .audioChannels(1)
    .audioFrequency(16000)
    .on("end", () => callback(null, wavFilePath))
    .on("error", (err) => callback(err))
    .run(); // Start the conversion
};

export default convertToWav;
