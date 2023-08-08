import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const basicTextCompletion = async (inputText: string) => {
  const completionRequest = {
    model: "text-davinci-003",
    prompt: inputText,
    max_tokens: 100,
  };

  try {
    const response = await openai.createCompletion(completionRequest);

    const processedText = response.data.choices[0].text;
    const cleanedText = processedText?.trim(); //added this to remove line breaks that were added to response.
    return cleanedText;
  } catch (error) {
    console.error(error);
  }
};
export default basicTextCompletion;
