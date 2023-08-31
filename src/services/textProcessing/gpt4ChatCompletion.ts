import dotenv from "dotenv";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

dotenv.config();

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const gpt4Completion = async (text: string, model: string) => {
  console.log(`running using model: ${model}`);
  const functions = [
    {
      name: "display_transcription",
      description: "Displays the speaker and the text that they spoke.",
      parameters: {
        type: "object",
        properties: {
          lines: {
            type: "array",
            description: "An array of dialog entries.",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the speaker.",
                },
                text: {
                  type: "string",
                  description: "Text spoken by the speaker.",
                },
              },
              required: ["name", "text"],
            },
          },
        },
        required: ["lines"],
      },
    },
  ];
  const userInput = text;
  const system =
    "You take as input a text transcription of a call between a RealNZ Customer Service Rep and a guest or trade partner. You output an annotated dialog with the real name of the speaking party. Note that the call may have been mis-transcribed, particularly the name RealNZ. You can fix this!";
  // "You take as input a text transcription of a phone call. You work out who said what, based on which sentences are likely to be a contact centre rep, and which sound like a guest or agent. You output a nicely formatted transcription, formatted with the real names at the start of each sentence and their role in brackets";
  // "You take raw text transcriptions of calls between a RealNZ Contact Centre Representative and their guest or agent, and you output dialog annotated with the real names of the parties";
  // "You are an expert at analysing raw transcriptions of calls between contact centre staff at RealNZ and RealNZ's guests or agents, and provided an annotated transcriptions which provides the names of the speaking parties. The call will often start with Welcome to RealNZ or similar, but this may have been mis-transcribed, so you can fix it. You can carefully analyse whether a sentence is more likely to be spoken by the RealNZ representitive or the guest/agent, based on whether they are providing informaion or requesting information about a RealNZ tourism experience. You will use the name of the representitive and guest/agent if they are available.";

  // From Whisper docs: system_prompt = "You are a helpful assistant for the company ZyntriQix. Your task is to correct any spelling discrepancies in the transcribed text. Make sure that the names of the following products are spelled correctly: ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as periods, commas, and capitalization, and use only the context provid
  const gpt4Message = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: system,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content:
        "Can you help to provide an annotated transcription of a call if I provide the raw text? This is a transcription of a conversation between one RealNZ contact centre representative and one guest or trade partner. I want to you analyse the text to work out which party said which sentence, keeping in mind that the contact centre rep is likely to be asking details about the guest or booking, and the guest or agent is likley to ask about availabilities or experiences. Please provide an annotated transcription, showing the real names if they are available. The format should look like this: Deb (RealNZ): Welcome to RealNZ, you're speaking with Deb. James (Guest): Hi, can you please help me.",
    },
    {
      // In this case, this is used to give an example of desired behaviour. But this can also store chat history.
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content:
        "Yes, I would be happy to help. Please input the raw text file below and I will output the JSON required to call a function to display this information.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: userInput,
    },
  ];

  const response = await openai.createChatCompletion({
    model: model, //"gpt-4-0613",
    messages: gpt4Message,
    max_tokens: 1000,
    functions: functions,
    function_call: { name: "display_transcription" },
  });
  return response.data.choices[0].message;
};

export default gpt4Completion;
