"use strict";
// I don't think this file is used at all and can be deleted
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
const annotateCallTranscription = (text) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const question = text;
    const callReviewMessage = [
        {
            role: openai_1.ChatCompletionRequestMessageRoleEnum.System,
            content: `You are an expert at deciphering phone call transcriptions, figuring out who said what, and correcting mistakes in the transcription.`,
        },
        {
            role: openai_1.ChatCompletionRequestMessageRoleEnum.User,
            content: "Can you help work out who said what on this call? Note that all the calls will be answered by a representative at RealNZ",
        },
        {
            role: openai_1.ChatCompletionRequestMessageRoleEnum.Assistant,
            content: "Deb (RealNZ): Welcome to RealNZ, you're ",
        },
        {
            role: openai_1.ChatCompletionRequestMessageRoleEnum.User,
            content: "Please output the text that I provide below in full first, and then give another transcription with your best effort at outlining which participant said what, with their names included if you can learn them from the call:" +
                question,
        },
    ];
    const response = yield openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: callReviewMessage,
    });
    return (_a = response.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content; // Changed from message.content to text
});
exports.default = annotateCallTranscription;
