import dotenv from "dotenv";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

dotenv.config();

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const annotateCallTranscription = async (text: string) => {
  const question = text;
  const callReviewMessage = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `You are an expert at deciphering phone call transcriptions, figuring out who said what, and correcting mistakes in the transcription.`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content:
        "Can you help work out who said what on this call? Note that all the calls will be answered by a representative at RealNZ",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: "Deb (RealNZ): Welcome to RealNZ, you're ",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content:
        "Please output the text that I provide below in full first, and then give another transcription with your best effort at outlining which participant said what, with their names included if you can learn them from the call:" +
        question,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: callReviewMessage,
  });

  return response.data.choices[0].message?.content; // Changed from message.content to text
};

export default annotateCallTranscription;
