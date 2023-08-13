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
  const userInput = text;
  const system = "You are a helpful assistant.";
  const gpt35Message = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: system,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: "Can you help me today?",
    },
    {
      // In this case, this is used to give an example of desired behaviour. But this can also store chat history.
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: "Yes, I would be happy to help.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: userInput,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: gpt35Message,
    max_tokens: 100,
  });

  return response.data.choices[0].message?.content; // Changed from message.content to text
};

export default gpt35Completion;
