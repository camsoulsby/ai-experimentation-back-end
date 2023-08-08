import dotenv from "dotenv";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

dotenv.config();

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const gpt35Completion = async (text: string) => {
  const question = text;
  const gpt35Message = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `You are an an expert web developer`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: "Can you help me write some HTML?",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: "Yes, I can output perfect HTML.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content:
        "Please output only HTML with no intro or explanation:" + question,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: gpt35Message,
  });

  return response.data.choices[0].message?.content; // Changed from message.content to text
};

export default gpt35Completion;
