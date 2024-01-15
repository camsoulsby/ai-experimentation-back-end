import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const transcribeWavToText = async (
  wavFilePath: string,
  model: string,
  OPENAI_API_KEY: string | undefined
): Promise<string | null> => {
  console.log("Preparing WAV file");
  try {
    const fileStream = fs.createReadStream(wavFilePath);
    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", fileStream, {
      filename: "Recording.wav",
      contentType: "audio/wav",
    });
    formData.append(
      "prompt",
      "This call will likley start with an introduction to RealNZ and a customer service representative's name, and will likely involve enquiries around the T.S.S Earnslaw Cruise to Walter Peak, or trips to Doubtful Sound, Milford Sounds, Stewart Island, or the Te Anau Glowworm Caves. If credit card information is present, please return this in a redacted format for privacy."
    );
    formData.append("language", "en");
    // formData.append("response_format", "text"); <-- experiment with this as may make more sense that returning JSON
    // formData.append("temperature", 0.8) <-- experiement with this to see the impact?

    const headers = formData.getHeaders();
    headers["Authorization"] = `Bearer ${OPENAI_API_KEY}`;
    console.log("Making request to Whisper API");
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: headers,
      }
    );
    console.log("Returning response");
    return response.data.text;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default transcribeWavToText;
