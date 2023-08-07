import express from "express";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", audioRoutes);

// app.post(
//   "/api/process-text",
//   async (req: express.Request, res: express.Response) => {
//     const inputText = req.body.text;

//     const completionRequest = {
//       model: "text-davinci-003",
//       prompt: `Ask a clarifying questions based on the follow text: ${inputText}`,
//       max_tokens: 100,
//     };

//     try {
//       const response = await openai.createCompletion(completionRequest);
//       console.log(response.data);

//       const processedText = response.data.choices[0].text.trim();

//       res.json({ processedText });
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while processing the text" });
//     }
//   }
// );

app.listen(3001, () => {
  console.log("Server listening at http://localhost:3001");
});
