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
  const system =
    "You take as input a text transcription of a call between a RealNZ Customer Service Rep and a guest or trade partner. You output an annotated dialog with the real name of the speaking party. Note that the call may have been mis-transcribed, particularly the name RealNZ. You can fix this!";
  // "You take as input a text transcription of a phone call. You work out who said what, based on which sentences are likely to be a contact centre rep, and which sound like a guest or agent. You output a nicely formatted transcription, formatted with the real names at the start of each sentence and their role in brackets";
  // "You take raw text transcriptions of calls between a RealNZ Contact Centre Representative and their guest or agent, and you output dialog annotated with the real names of the parties";
  // "You are an expert at analysing raw transcriptions of calls between contact centre staff at RealNZ and RealNZ's guests or agents, and provided an annotated transcriptions which provides the names of the speaking parties. The call will often start with Welcome to RealNZ or similar, but this may have been mis-transcribed, so you can fix it. You can carefully analyse whether a sentence is more likely to be spoken by the RealNZ representitive or the guest/agent, based on whether they are providing informaion or requesting information about a RealNZ tourism experience. You will use the name of the representitive and guest/agent if they are available.";
  const gpt35Message = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: system,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content:
        "Can you help to provide an annotated transcription of a call if I provide the raw text? This is a transcription of a conversation between one RealNZ contact centre representative and one guest or trade partner. I want to you analyse the text to work out which party said which sentence, keeping in mind that the contact centre rep is likely to be asking details about the guest or booking, and the guest or agent is likley to ask about availabilities or experiences. Please provide an annotated transcription, showing the real names if they are available, with their role in brackets.",
    },
    {
      // In this case, this is used to give an example of desired behaviour. But this can also store chat history.
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content:
        "Yes, I would be happy to help. Please input the raw text file below.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: userInput,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: gpt35Message,
    max_tokens: 500,
  });

  return response.data.choices[0].message?.content; // Changed from message.content to text
};

export default gpt35Completion;
