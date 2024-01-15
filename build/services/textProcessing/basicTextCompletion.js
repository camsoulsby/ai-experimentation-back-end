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
const basicTextCompletion = (inputText) => __awaiter(void 0, void 0, void 0, function* () {
    const completionRequest = {
        model: "text-davinci-003",
        prompt: inputText,
        max_tokens: 100,
    };
    try {
        const response = yield openai.createCompletion(completionRequest);
        console.log(response);
        const processedText = response.data.choices[0].text;
        const cleanedText = processedText === null || processedText === void 0 ? void 0 : processedText.trim(); //added this to remove line breaks that were added to response.
        return cleanedText;
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = basicTextCompletion;
