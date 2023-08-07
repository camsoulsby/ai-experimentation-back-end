import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const transcribeWavToText = async (
  wavFilePath: string,
  model: string,
  OPENAI_API_KEY: string | undefined
): Promise<string | null> => {
  try {
    const fileStream = fs.createReadStream(wavFilePath);
    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", fileStream, {
      filename: "Recording.wav",
      contentType: "audio/wav",
    });

    const headers = formData.getHeaders();
    headers["Authorization"] = `Bearer ${OPENAI_API_KEY}`;
    console.log("got to this bit");
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: headers,
      }
    );

    return response.data.text;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default transcribeWavToText;
