"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
dotenv_1.default.config();
const config = new openai_1.Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new openai_1.OpenAIApi(config);
const attributeCallTranscription = (text, model) => __awaiter(void 0, void 0, void 0, function* () {
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
    const system = "You take as input a text transcription of a call between a RealNZ Customer Service Rep and a guest or trade partner. You output an annotated dialog with the real name of the speaking party. Note that the call may have been mis-transcribed, particularly the name RealNZ. You can fix this!";
    // "You take as input a text transcription of a phone call. You work out who said what, based on which sentences are likely to be a contact centre rep, and which sound like a guest or agent. You output a nicely formatted transcription, formatted with the real names at the start of each sentence and their role in brackets";
    // "You take raw text transcriptions of calls between a RealNZ Contact Centre Representative and their guest or agent, and you output dialog annotated with the real names of the parties";
    // "You are an expert at analysing raw transcriptions of calls between contact centre staff at RealNZ and RealNZ's guests or agents, and provided an annotated transcriptions which provides the names of the speaking parties. The call will often start with Welcome to RealNZ or similar, but this may have been mis-transcribed, so you can fix it. You can carefully analyse whether a sentence is more likely to be spoken by the RealNZ representitive or the guest/agent, based on whether they are providing informaion or requesting information about a RealNZ tourism experience. You will use the name of the representitive and guest/agent if they are available.";
    // From Whisper docs: system_prompt = "You are a helpful assistant for the company ZyntriQix. Your task is to correct any spelling discrepancies in the transcribed text. Make sure that the names of the following products are spelled correctly: ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as periods, commas, and capitalization, and use only the context provid
    const gptMessage = [
        {
            role: openai_1.ChatCompletionRequestMessageRoleEnum.System,
            content: system,
        },
        {
            role: openai_1.ChatCompletionRequestMessageRoleEnum.User,
            content: "Can you help to provide an annotated transcription of a call if I provide the raw text? This is a transcription of a conversation between one RealNZ contact centre representative and one guest or trade partner. I want to you analyse the text to work out which party said which sentence, keeping in mind that the contact centre rep is likely to be asking details about the guest or booking, and the guest or agent is likley to ask about availabilities or experiences. Please provide an annotated transcription, showing the real names if they are available. The format should look like this: Deb (RealNZ): Welcome to RealNZ, you're speaking with Deb. James (Guest): Hi, can you please help me.",
        },
        {
            // In this case, this is used to give an example of desired behaviour. But this can also store chat history.
            role: openai_1.ChatCompletionRequestMessageRoleEnum.Assistant,
            content: "Yes, I would be happy to help. Please input the raw text file below and I will output the JSON required to call a function to display this information.",
        },
        {
            role: openai_1.ChatCompletionRequestMessageRoleEnum.User,
            content: userInput,
        },
    ];
    console.log("Generating response");
    try {
        const response = yield openai.createChatCompletion({
            model: model,
            messages: gptMessage,
            max_tokens: 1000,
            functions: functions,
            function_call: { name: "display_transcription" },
        });
        return response.data.choices[0].message;
    }
    catch (error) {
        // Specify a variable to hold the error object
        console.log(error); // Now you can log the error
    }
});
exports.default = attributeCallTranscription;
