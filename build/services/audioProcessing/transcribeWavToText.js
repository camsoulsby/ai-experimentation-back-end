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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
const transcribeWavToText = (wavFilePath, model, OPENAI_API_KEY) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Preparing WAV file");
    try {
        const fileStream = fs_1.default.createReadStream(wavFilePath);
        const formData = new form_data_1.default();
        formData.append("model", model);
        formData.append("file", fileStream, {
            filename: "Recording.wav",
            contentType: "audio/wav",
        });
        formData.append("prompt", "This call will likley start with an introduction to RealNZ and a customer service representative's name, and will likely involve enquiries around the T.S.S Earnslaw Cruise to Walter Peak, or trips to Doubtful Sound, Milford Sounds, Stewart Island, or the Te Anau Glowworm Caves. If credit card information is present, please return this in a redacted format for privacy.");
        formData.append("language", "en");
        // formData.append("response_format", "text"); <-- experiment with this as may make more sense that returning JSON
        // formData.append("temperature", 0.8) <-- experiement with this to see the impact?
        const headers = formData.getHeaders();
        headers["Authorization"] = `Bearer ${OPENAI_API_KEY}`;
        console.log("Making request to Whisper API");
        const response = yield axios_1.default.post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: headers,
        });
        console.log("Returning response");
        return response.data.text;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.default = transcribeWavToText;
